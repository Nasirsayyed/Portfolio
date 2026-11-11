import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { createSceneInput } from '@/three/types';
import { useThreeScene } from '@/three/useThreeScene';
import { useUiStore } from '@/store/uiStore';

const loadScene = () => import('@/three/scenes/portraitOrb');

/** Liquid WebGL orb glowing behind the portrait. */
export function PortraitOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input] = useState(() => createSceneInput());
  const status = useThreeScene(canvasRef, loadScene, input, true);
  const introComplete = useUiStore((s) => s.introComplete);

  useEffect(() => {
    if (status !== 'ready' || !introComplete) return;
    const tween = gsap.to(input, { intro: 1, duration: 2, ease: 'elastic.out(1, 0.6)', delay: 0.4 });
    return () => {
      tween.kill();
    };
  }, [status, introComplete, input]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute -inset-[22%] h-[144%] w-[144%]"
      aria-hidden="true"
    />
  );
}
