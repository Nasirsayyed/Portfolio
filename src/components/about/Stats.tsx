import { useRef } from 'react';
import { stats } from '@/data/portfolio';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Stats() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const tl = gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 85%' } });
      tl.from('[data-stat]', {
        y: 60,
        autoAlpha: 0,
        rotateX: -30,
        transformPerspective: 800,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
      });
      // Values render final in markup; animate from 0 so no-JS / reduced-motion still shows real numbers.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el, i) => {
        tl.from(el, { textContent: 0, duration: 1.8, ease: 'power3.out', snap: { textContent: 1 } }, 0.1 + i * 0.12);
      });
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion] },
  );

  return (
    <div ref={rootRef} className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-stat
          className="rounded-xl border border-border bg-card p-6 text-center shadow-card"
        >
          <div className="text-gradient-brand text-4xl font-extrabold tabular-nums sm:text-5xl">
            <span data-count>{stat.value}</span>
            {stat.suffix}
          </div>
          <div className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
