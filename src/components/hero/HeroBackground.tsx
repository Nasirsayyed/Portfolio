import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || recruiterMode) return;

      // Ambient drift: each blob wanders on its own randomized yoyo loop.
      gsap.utils.toArray<HTMLElement>('[data-blob]').forEach((blob, i) => {
        gsap.to(blob, {
          x: () => gsap.utils.random(-60, 60),
          y: () => gsap.utils.random(-50, 50),
          scale: () => gsap.utils.random(0.9, 1.15),
          duration: gsap.utils.random(7, 11),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          delay: i * 0.6,
        });
      });

      // Depth parallax while scrolling out of the hero.
      gsap.to('[data-blob-layer]', {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('[data-grid-layer]', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // Pointer-follow spotlight with a soft lag.
      const glow = glowRef.current;
      if (!glow || !finePointer) return;
      gsap.set(glow, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 3 });
      const xTo = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3' });
      const yTo = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3' });
      const parent = rootRef.current?.parentElement;
      const onMove = (e: PointerEvent) => {
        const rect = parent?.getBoundingClientRect();
        xTo(e.clientX - (rect?.left ?? 0));
        yTo(e.clientY - (rect?.top ?? 0));
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      return () => window.removeEventListener('pointermove', onMove);
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion, recruiterMode, finePointer] },
  );

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        data-grid-layer
        className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />

      {!recruiterMode && (
        <div data-blob-layer className="absolute inset-0">
          <div data-blob className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-[100px]" />
          <div data-blob className="absolute right-[10%] top-[28%] h-80 w-80 rounded-full bg-accent opacity-10 blur-[110px]" />
          <div data-blob className="absolute bottom-[5%] left-[30%] h-64 w-64 rounded-full bg-primary opacity-10 blur-[90px]" />
        </div>
      )}

      {!reduceMotion && !recruiterMode && finePointer && (
        <div
          ref={glowRef}
          className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 65%)' }}
        />
      )}
    </div>
  );
}
