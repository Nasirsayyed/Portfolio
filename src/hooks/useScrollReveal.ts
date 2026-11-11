import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'clip' | 'tilt';

const fromVars: Record<RevealVariant, gsap.TweenVars> = {
  up: { y: 60, autoAlpha: 0 },
  left: { x: -70, autoAlpha: 0 },
  right: { x: 70, autoAlpha: 0 },
  scale: { scale: 0.85, autoAlpha: 0, y: 30 },
  clip: { clipPath: 'inset(35% 0% 0% 0%)', y: 80, autoAlpha: 0 },
  tilt: { rotateX: -18, y: 70, autoAlpha: 0, transformPerspective: 900, transformOrigin: '50% 0%' },
};

const toVars: gsap.TweenVars = {
  x: 0,
  y: 0,
  scale: 1,
  rotateX: 0,
  autoAlpha: 1,
  clipPath: 'inset(0% 0% 0% 0%)',
};

/**
 * Reveals every `[data-reveal]` element inside `scope` as it scrolls into
 * view, batching elements that enter together into one staggered wave.
 * Set `data-reveal="left|right|scale|clip|tilt"` to pick a variant.
 */
export function useScrollReveal(scope: RefObject<HTMLElement>): void {
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (items.length === 0) return;

      items.forEach((el) => {
        const variant = (el.dataset.reveal || 'up') as RevealVariant;
        gsap.set(el, fromVars[variant] ?? fromVars.up);
      });

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        // An end past the bottom of the page keeps every trigger "active" once
        // its start is passed, so elements above the viewport on load (e.g.
        // restored scroll position) still get revealed instead of staying hidden.
        end: () => ScrollTrigger.maxScroll(window) + window.innerHeight,
        onEnter: (batch) =>
          gsap.to(batch, {
            ...toVars,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.12,
            overwrite: true,
            clearProps: 'transform,clipPath,visibility,opacity',
          }),
      });
    },
    { scope, dependencies: [reduceMotion], revertOnUpdate: true },
  );
}
