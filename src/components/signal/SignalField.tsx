import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { AdditiveBlending, Color, NormalBlending, ShaderMaterial, type Points } from 'three';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeColors, type ThemeColors } from '@/hooks/useThemeColors';
import { useUiStore } from '@/store/uiStore';
import { ensurePointerTracking, pointer } from '@/components/three/webgl';
import { buildSignalGeometry } from '@/components/signal/shapes';
import { fragmentShader, vertexShader } from '@/components/signal/shader';
import { sampleSignalTarget } from '@/components/signal/chapterState';

const SignalPost = lazy(() => import('@/components/signal/SignalPost'));

type Tier = 'high' | 'mid' | 'low';

const COUNTS: Record<Tier, number> = { high: 24_000, mid: 8_000, low: 4_000 };
/** Fewer particles are drawn slightly larger so the shapes keep their density. */
const SIZES: Record<Tier, number> = { high: 2.1, mid: 2.9, low: 3.6 };

const FOCUS_INDEX = { client: 0, api: 1, data: 2, tooling: -1 } as const;

function initialTier(): Tier {
  return window.matchMedia('(max-width: 767px), (pointer: coarse)').matches ? 'mid' : 'high';
}

/** Frame-rate independent exponential damping. */
function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

interface ParticlesProps {
  tier: Tier;
  colors: ThemeColors;
  still: boolean;
  interactive: boolean;
}

function Particles({ tier, colors, still, interactive }: ParticlesProps) {
  const geometry = useMemo(() => buildSignalGeometry(COUNTS[tier]), [tier]);
  const points = useRef<Points>(null);
  const frame = useRef(0);
  const { gl, invalidate } = useThree();

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uStage: { value: 0 },
          uSize: { value: SIZES[tier] },
          uPixelRatio: { value: 1 },
          uDim: { value: 1 },
          uTravel: { value: 0 },
          uFocus: { value: -1 },
          uScale: { value: 1 },
          uPointerStrength: { value: interactive ? 1 : 0 },
          uOffset: { value: [0, 0] },
          uPointer: { value: [0, 0] },
          uAccent: { value: new Color() },
          uMuted: { value: new Color() },
        },
      }),
    // Uniform values are updated in place below; the material itself is built once per tier.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tier],
  );

  useEffect(() => () => material.dispose(), [material]);

  // Theme → uniforms. Additive glow on ink; plain alpha on paper, where additive would wash out.
  useEffect(() => {
    (material.uniforms.uAccent!.value as Color).set(colors.accent);
    (material.uniforms.uMuted!.value as Color).set(colors.isDark ? colors.foreground : colors.muted);
    material.blending = colors.isDark ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
    invalidate();
  }, [colors, material, invalidate]);

  useEffect(() => {
    material.uniforms.uSize!.value = SIZES[tier];
    material.uniforms.uPointerStrength!.value = interactive ? 1 : 0;
    if (interactive) ensurePointerTracking();
  }, [tier, interactive, material]);

  // Reduced motion renders on demand: one settled frame per scroll position, no idle animation.
  useEffect(() => {
    if (!still) return;
    const onChange = () => invalidate();
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, [still, invalidate]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const dt = Math.min(delta, 1 / 20);
    frame.current += 1;
    const target = sampleSignalTarget(frame.current);
    const focus = useUiStore.getState().stackFocus;
    const focusIndex = focus ? FOCUS_INDEX[focus] : -1;

    u.uPixelRatio!.value = gl.getPixelRatio();

    if (still) {
      // Jump straight to the settled pose; time stays fixed so nothing drifts.
      u.uStage!.value = target.stage;
      u.uScale!.value = target.scale;
      u.uDim!.value = target.dim;
      u.uTravel!.value = target.travel;
      u.uOffset!.value = [target.offsetX, target.offsetY];
      u.uFocus!.value = focusIndex;
      return;
    }

    u.uTime!.value = state.clock.elapsedTime;
    u.uStage!.value = damp(u.uStage!.value as number, target.stage, 5, dt);
    u.uScale!.value = damp(u.uScale!.value as number, target.scale, 4, dt);
    u.uDim!.value = damp(u.uDim!.value as number, target.dim, 4, dt);
    u.uTravel!.value = damp(u.uTravel!.value as number, target.travel, 6, dt);
    u.uFocus!.value = focusIndex;
    const [ox, oy] = u.uOffset!.value as [number, number];
    u.uOffset!.value = [damp(ox, target.offsetX, 4, dt), damp(oy, target.offsetY, 4, dt)];

    if (interactive) {
      // Pointer in world units at z = 0 (camera at z 10, fov 45 → half-height ≈ 4.14).
      const halfH = Math.tan((45 / 2) * (Math.PI / 180)) * 10;
      const halfW = halfH * (state.size.width / Math.max(1, state.size.height));
      const [px, py] = u.uPointer!.value as [number, number];
      u.uPointer!.value = [damp(px, pointer.x * halfW, 6, dt), damp(py, pointer.y * halfH, 6, dt)];
    }

    // A slow drift keeps the field alive between chapters.
    if (points.current) points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.12;
  });

  return (
    <points ref={points} material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.targets[0]!, 3]} />
        <bufferAttribute attach="attributes-aPos1" args={[geometry.targets[1]!, 3]} />
        <bufferAttribute attach="attributes-aPos2" args={[geometry.targets[2]!, 3]} />
        <bufferAttribute attach="attributes-aPos3" args={[geometry.targets[3]!, 3]} />
        <bufferAttribute attach="attributes-aPos4" args={[geometry.targets[4]!, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[geometry.random, 1]} />
        <bufferAttribute attach="attributes-aTone" args={[geometry.tone, 1]} />
        <bufferAttribute attach="attributes-aLayer" args={[geometry.layer, 1]} />
      </bufferGeometry>
    </points>
  );
}

/**
 * The persistent particle "signal" behind every chapter. One draw call; all
 * morphing happens in the vertex shader. Lazy-loaded, never in the entry chunk.
 */
export default function SignalField() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const colors = useThemeColors();
  const [tier, setTier] = useState<Tier>(initialTier);
  // Fades in once the GL context exists, so the field never pops in over the page.
  const [shown, setShown] = useState(false);

  const post = tier === 'high' && colors.isDark && !reduceMotion;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-1000 ease-signal"
      style={{ opacity: shown ? 1 : 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        frameloop={reduceMotion ? 'demand' : 'always'}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          requestAnimationFrame(() => setShown(true));
        }}
      >
        {!reduceMotion && (
          <PerformanceMonitor
            flipflops={2}
            onDecline={() => setTier((t) => (t === 'high' ? 'mid' : 'low'))}
            onFallback={() => setTier('low')}
          />
        )}
        <Particles
          key={tier}
          tier={tier}
          colors={colors}
          still={reduceMotion}
          interactive={finePointer && !reduceMotion}
        />
        {post && (
          <Suspense fallback={null}>
            <SignalPost background={colors.background} />
          </Suspense>
        )}
      </Canvas>
    </div>
  );
}
