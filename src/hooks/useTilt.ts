import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * 3D pointer tilt with a lift on hover. Also writes `--gx` / `--gy` (0–100%)
 * on the element so CSS can paint a glare that tracks the pointer.
 */
export function useTilt(ref: RefObject<HTMLElement>, maxRotation = 8): void {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !finePointer || reduceMotion) return;

      gsap.set(el, { transformPerspective: 1000, transformStyle: 'preserve-3d' });
      const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });

      const onEnter = () => gsap.to(el, { y: -8, duration: 0.5, ease: 'power3.out' });
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotY((px - 0.5) * maxRotation * 2);
        rotX(-(py - 0.5) * maxRotation * 2);
        el.style.setProperty('--gx', `${px * 100}%`);
        el.style.setProperty('--gy', `${py * 100}%`);
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
        gsap.to(el, { y: 0, duration: 0.6, ease: 'power3.out' });
      };

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { revertOnUpdate: true, dependencies: [finePointer, reduceMotion, maxRotation] },
  );
}
