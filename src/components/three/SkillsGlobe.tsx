import { useEffect, useRef, useState } from 'react';
import { MousePointerClick } from 'lucide-react';
import { ScrollTrigger, gsap } from '@/lib/gsap';
import { createSceneInput } from '@/three/types';
import { useThreeScene } from '@/three/useThreeScene';
import type { GlobeInput, GlobeLabel } from '@/three/scenes/skillsGlobe';

const loadScene = () => import('@/three/scenes/skillsGlobe');

interface SkillsGlobeProps {
  labels: GlobeLabel[];
  activeGroup: string | null;
  onSelect: (label: GlobeLabel) => void;
}

/** Drag-to-spin 3D cloud of skills; clicking a skill filters the grid below. */
export function SkillsGlobe({ labels, activeGroup, onSelect }: SkillsGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input] = useState<GlobeInput>(() =>
    createSceneInput({ labels, activeGroup, onSelect } as Pick<GlobeInput, 'labels' | 'activeGroup' | 'onSelect'>),
  );
  const status = useThreeScene(canvasRef, loadScene, input, true);

  // Keep the running scene in sync with React props without re-creating it.
  input.activeGroup = activeGroup;
  input.onSelect = onSelect;

  // Spin the globe in as it scrolls into view.
  useEffect(() => {
    if (status !== 'ready') return;
    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 80%',
      onEnter: () => gsap.to(input, { intro: 1, duration: 2.2, ease: 'expo.out', overwrite: true }),
    });
    return () => trigger.kill();
  }, [status, input]);

  if (status === 'failed') return null;

  return (
    <div ref={rootRef} className="relative mx-auto mb-6 w-full max-w-[560px]">
      <div className="relative aspect-square w-full">
        <div
          className="pointer-events-none absolute inset-[18%] rounded-full bg-gradient-brand opacity-15 blur-[80px]"
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-pan-y"
          aria-label="Interactive 3D globe of skills. Drag to rotate; select a skill to filter the list below."
          role="img"
        />
      </div>
      <p className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
        <MousePointerClick className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Drag to spin · click a skill to filter
      </p>
    </div>
  );
}
