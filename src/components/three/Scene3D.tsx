import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeColors, type ThemeColors } from '@/hooks/useThemeColors';
import { ensurePointerTracking, pointer, scrollProgress } from '@/components/three/webgl';

/** World units the camera descends from the top of the page to the bottom. */
const TRAVEL = 38;
const CAMERA_Z = 9;
const FOV = 50;

/** Deterministic pseudo-random so the layout is stable across reloads. */
function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type ShapeKind = 'icosahedron' | 'octahedron' | 'torusKnot' | 'torus' | 'dodecahedron' | 'tetrahedron';
const KINDS: ShapeKind[] = ['icosahedron', 'torusKnot', 'octahedron', 'torus', 'dodecahedron', 'tetrahedron'];

interface ShapeSpec {
  kind: ShapeKind;
  y: number;
  side: number;
  spread: number;
  z: number;
  scale: number;
  wireframe: boolean;
  tone: 'primary' | 'accent';
  speed: number;
}

function buildShapes(count: number): ShapeSpec[] {
  return Array.from({ length: count }, (_, i) => {
    const y = 1.5 - (i * (TRAVEL + 6)) / count;
    const side = i % 2 === 0 ? -1 : 1;
    // The hero's 3D medallion owns the top-right; send shapes there far back into the fog.
    const inHeroCorner = side === 1 && y > -6;
    return {
      kind: KINDS[i % KINDS.length] ?? 'icosahedron',
      y,
      side,
      spread: 0.84 + seeded(i + 1) * 0.2,
      z: inHeroCorner ? -16 : -1.5 - seeded(i + 7) * 6,
      scale: 0.4 + seeded(i + 3) * 0.45,
      wireframe: i % 3 === 0,
      tone: i % 2 === 0 ? 'primary' : 'accent',
      speed: 0.6 + seeded(i + 11) * 1.2,
    };
  });
}

function ShapeGeometry({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case 'icosahedron':
      return <icosahedronGeometry args={[1, 0]} />;
    case 'octahedron':
      return <octahedronGeometry args={[1, 0]} />;
    case 'torusKnot':
      return <torusKnotGeometry args={[0.65, 0.22, 120, 16]} />;
    case 'torus':
      return <torusGeometry args={[0.8, 0.26, 20, 60]} />;
    case 'dodecahedron':
      return <dodecahedronGeometry args={[1, 0]} />;
    case 'tetrahedron':
      return <tetrahedronGeometry args={[1.1, 0]} />;
  }
}

function FloatingShapes({ colors, animate, compact }: { colors: ThemeColors; animate: boolean; compact: boolean }) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const shapes = useMemo(() => buildShapes(compact ? 12 : 18), [compact]);
  const halfFov = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

  return (
    <>
      {shapes.map((shape, i) => {
        // Keep shapes toward the edges so they frame the content instead of sitting behind the text.
        const distance = CAMERA_Z - shape.z;
        const halfWidth = halfFov * distance * aspect;
        const x = shape.side * halfWidth * shape.spread;
        const color = shape.tone === 'primary' ? colors.primary : colors.accent;
        const scale = shape.scale * (compact ? 0.6 : 1);

        return (
          <Float
            key={i}
            speed={animate ? shape.speed : 0}
            rotationIntensity={animate ? 1.2 : 0}
            floatIntensity={animate ? 1.4 : 0}
          >
            <mesh position={[x, shape.y, shape.z]} scale={scale} rotation={[seeded(i) * 3, seeded(i + 2) * 3, 0]}>
              <ShapeGeometry kind={shape.kind} />
              {shape.wireframe ? (
                <meshBasicMaterial
                  color={color}
                  wireframe
                  transparent
                  opacity={colors.isDark ? 0.45 : 0.35}
                  toneMapped={false}
                />
              ) : (
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={colors.isDark ? 0.25 : 0.05}
                  metalness={0.45}
                  roughness={0.22}
                  transparent
                  opacity={compact ? 0.55 : 0.9}
                />
              )}
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

function useDotTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function ParticleField({ colors, count, animate }: { colors: ThemeColors; count: number; animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const texture = useDotTexture();

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = (seeded(i + 101) - 0.5) * 30;
      array[i * 3 + 1] = 6 - seeded(i + 202) * (TRAVEL + 14);
      array[i * 3 + 2] = -14 + seeded(i + 303) * 16;
    }
    return array;
  }, [count]);

  const vertexColors = useMemo(() => {
    const a = new THREE.Color(colors.gradientStart);
    const b = new THREE.Color(colors.gradientEnd);
    const array = new Float32Array(count * 3);
    const mixed = new THREE.Color();
    for (let i = 0; i < count; i++) {
      mixed.copy(a).lerp(b, seeded(i + 404));
      array[i * 3] = mixed.r;
      array[i * 3 + 1] = mixed.g;
      array[i * 3 + 2] = mixed.b;
    }
    return array;
  }, [colors.gradientStart, colors.gradientEnd, count]);

  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[vertexColors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={texture}
        vertexColors
        transparent
        depthWrite={false}
        opacity={colors.isDark ? 0.85 : 0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CameraRig({ animate }: { animate: boolean }) {
  useFrame((state, delta) => {
    const camera = state.camera;
    if (!animate) {
      camera.position.set(0, 0, CAMERA_Z);
      camera.lookAt(0, 0, 0);
      return;
    }
    const targetY = -scrollProgress() * TRAVEL;
    const d = Math.min(delta, 0.1);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.8, 2.5, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY + pointer.y * 0.5, 3.5, d);
    camera.position.z = CAMERA_Z;
    camera.lookAt(camera.position.x * 0.35, camera.position.y, 0);
    // A gentle roll as you travel keeps the descent from feeling like a flat pan.
    camera.rotation.z = Math.sin(targetY * 0.12) * 0.035;
  });
  return null;
}

export default function Scene3D() {
  const reduceMotion = useReducedMotion();
  const colors = useThemeColors();
  const animate = !reduceMotion;
  const [compact] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [dpr, setDpr] = useState(1.5);
  const [particleCount, setParticleCount] = useState(compact ? 500 : 1400);

  useEffect(() => {
    ensurePointerTracking();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 80 }}
        dpr={dpr}
        frameloop={animate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setParticleCount((n) => Math.max(300, Math.floor(n / 2)));
          }}
        />
        <fog attach="fog" args={[colors.background, 9, 30]} key={colors.background} />
        <ambientLight intensity={colors.isDark ? 0.45 : 0.9} />
        <directionalLight position={[-6, 8, 6]} intensity={colors.isDark ? 1.4 : 1.8} />
        <pointLight position={[6, 2, 4]} intensity={60} color={colors.primary} />
        <pointLight position={[-6, -18, 4]} intensity={60} color={colors.accent} />
        <pointLight position={[6, -32, 4]} intensity={60} color={colors.primary} />

        <CameraRig animate={animate} />
        <FloatingShapes colors={colors} animate={animate} compact={compact} />
        <ParticleField colors={colors} count={particleCount} animate={animate} />
      </Canvas>
    </div>
  );
}
