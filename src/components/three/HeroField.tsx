import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { createSceneInput } from '@/three/types';
import { useThreeScene } from '@/three/useThreeScene';
import { useUiStore } from '@/store/uiStore';

const loadScene = () => import('@/three/scenes/heroField');

/** WebGL particle field behind the hero. Mount only when motion is allowed. */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input] = useState(() => createSceneInput());
  const status = useThreeScene(canvasRef, loadScene, input, true);
  const introComplete = useUiStore((s) => s.introComplete);

  // Unroll the field once the loading curtain lifts.
  useEffect(() => {
    if (status !== 'ready' || !introComplete) return;
    const tween = gsap.to(input, { intro: 1, duration: 2.6, ease: 'power3.out', delay: 0.2 });
    gsap.to(canvasRef.current, { autoAlpha: 1, duration: 1.2 });
    return () => {
      tween.kill();
    };
  }, [status, introComplete, input]);

  // Scroll progress through the hero dives the camera into the field.
  useEffect(() => {
    if (status !== 'ready') return;
    const trigger = ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        input.scroll = self.progress;
      },
    });
    return () => trigger.kill();
  }, [status, input]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%,black_80%,transparent_100%)]"
      aria-hidden="true"
    />
  );
}
