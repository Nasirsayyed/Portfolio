import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sparkles, useTexture } from '@react-three/drei';
import { useInView } from 'framer-motion';
import * as THREE from 'three';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeColors, type ThemeColors } from '@/hooks/useThemeColors';
import { ensurePointerTracking, pointer } from '@/components/three/webgl';
import profileWebp from '@/assets/images/profile.webp';

const RADIUS = 1.45;
const THICKNESS = 0.22;
/** profile.webp is 900×1352; crop the top square so the face stays centered, like object-top. */
const PHOTO_ASPECT = 900 / 1352;

function Medallion({ colors, animate }: { colors: ThemeColors; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(profileWebp);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(1, PHOTO_ASPECT);
    texture.offset.set(0, 1 - PHOTO_ASPECT);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!animate) {
      g.rotation.set(0.05, -0.18, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    // Flip away as the hero scrolls out of view.
    const scrollTurn = Math.min(window.scrollY / window.innerHeight, 1.2) * 1.1;
    const targetY = pointer.x * 0.45 + Math.sin(t * 0.5) * 0.08 + scrollTurn;
    const targetX = -pointer.y * 0.3 + Math.cos(t * 0.4) * 0.04;
    const d = Math.min(delta, 0.1);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 4, d);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, d);
    g.position.y = Math.sin(t * 0.9) * 0.08;
  });

  return (
    <group ref={group}>
      {/* Coin edge */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[RADIUS, RADIUS, THICKNESS, 96, 1, true]} />
        <meshStandardMaterial color={colors.gradientStart} metalness={0.85} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* Front bezel */}
      <mesh position-z={THICKNESS / 2 + 0.001}>
        <ringGeometry args={[RADIUS * 0.93, RADIUS, 96]} />
        <meshStandardMaterial color={colors.gradientEnd} emissive={colors.gradientEnd} emissiveIntensity={0.25} metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Photo — unlit and untonemapped so skin tones render exactly as photographed */}
      <mesh position-z={THICKNESS / 2 + 0.002}>
        <circleGeometry args={[RADIUS * 0.93, 96]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Back face */}
      <mesh position-z={-THICKNESS / 2 - 0.001} rotation-y={Math.PI}>
        <circleGeometry args={[RADIUS, 96]} />
        <meshStandardMaterial color={colors.gradientEnd} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

interface OrbitSpec {
  label: string;
  radius: number;
  speed: number;
  phase: number;
  tilt: [number, number, number];
  tone: 'primary' | 'accent';
}

const ORBITS: OrbitSpec[] = [
  { label: 'C#', radius: 2.05, speed: 0.45, phase: 0.4, tilt: [1.25, 0.25, 0.2], tone: 'primary' },
  { label: 'React', radius: 2.3, speed: -0.32, phase: 2.4, tilt: [1.05, -0.45, -0.3], tone: 'accent' },
  { label: '.NET', radius: 2.15, speed: 0.38, phase: 4.3, tilt: [1.9, 0.1, 0.6], tone: 'primary' },
];

function Orbit({ spec, colors, animate }: { spec: OrbitSpec; colors: ThemeColors; animate: boolean }) {
  const planet = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLSpanElement>(null);
  const world = useMemo(() => new THREE.Vector3(), []);
  const color = spec.tone === 'primary' ? colors.primary : colors.accent;

  useFrame((state) => {
    const mesh = planet.current;
    if (!mesh) return;
    const angle = spec.phase + (animate ? state.clock.elapsedTime * spec.speed : 0);
    mesh.position.set(Math.cos(angle) * spec.radius, Math.sin(angle) * spec.radius, 0);
    // Fade the label while its planet passes behind the medallion.
    if (label.current) {
      mesh.getWorldPosition(world);
      const behind = world.z < -0.1 && Math.hypot(world.x, world.y) < RADIUS * 1.05;
      const depth = THREE.MathUtils.clamp((world.z + 2.5) / 5, 0.35, 1);
      label.current.style.opacity = behind ? '0' : String(depth);
      label.current.style.transform = `scale(${0.8 + depth * 0.25})`;
    }
  });

  return (
    <group rotation={spec.tilt}>
      <mesh>
        <torusGeometry args={[spec.radius, 0.01, 12, 180]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh ref={planet}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} />
        <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <span
            ref={label}
            className="glass block whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground shadow-card transition-opacity duration-200"
            style={{ transformOrigin: 'center' }}
          >
            {spec.label}
          </span>
        </Html>
      </mesh>
    </group>
  );
}

export default function HeroMedallion() {
  const reduceMotion = useReducedMotion();
  const colors = useThemeColors();
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container, { margin: '100px' });
  const animate = !reduceMotion;

  useEffect(() => {
    ensurePointerTracking();
  }, []);

  return (
    <div
      ref={container}
      className="relative mx-auto aspect-square w-full max-w-[440px]"
      role="img"
      aria-label={`${personalInfo.name}, ${personalInfo.title}`}
    >
      <div className="absolute inset-10 rounded-full bg-gradient-brand opacity-30 blur-3xl" aria-hidden="true" />
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 35 }}
        dpr={[1, 2]}
        frameloop={animate && inView ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true }}
        aria-hidden="true"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-3, -2, 3]} intensity={25} color={colors.accent} />
        <Suspense fallback={null}>
          <Medallion colors={colors} animate={animate} />
        </Suspense>
        {ORBITS.map((spec) => (
          <Orbit key={spec.label} spec={spec} colors={colors} animate={animate} />
        ))}
        {animate && <Sparkles count={40} scale={[5, 5, 3]} size={2.5} speed={0.4} color={colors.gradientEnd} />}
      </Canvas>
    </div>
  );
}
