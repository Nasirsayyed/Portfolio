import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], input, textarea, select, label, [data-cursor]';

/**
 * A soft follower ring + precise dot. The native cursor stays visible —
 * this layer only adds feedback, it never replaces the real pointer.
 */
export function CustomCursor() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!enabled || !dot || !ring) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

      let visible = false;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        if (!visible) {
          visible = true;
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const hovering = e.target instanceof Element && e.target.closest(INTERACTIVE) !== null;
        gsap.to(ring, { scale: hovering ? 1.9 : 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(dot, { scale: hovering ? 0 : 1, duration: 0.25, overwrite: 'auto' });
        ring.classList.toggle('cursor-ring--active', hovering);
      };

      const onLeave = () => {
        visible = false;
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3, overwrite: 'auto' });
      };
      const onDown = () => gsap.to(ring, { scale: '-=0.25', duration: 0.15 });
      const onUp = (e: PointerEvent) => onOver(e);

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver);
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
      };
    },
    { revertOnUpdate: true, dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
