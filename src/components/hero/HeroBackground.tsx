import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const el = glowRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      {!recruiterMode && (
        <>
          <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-[100px] animate-blob" />
          <div className="absolute right-[10%] top-[28%] h-80 w-80 rounded-full bg-accent opacity-10 blur-[110px] animate-blob [animation-delay:3s]" />
          <div className="absolute bottom-[5%] left-[30%] h-64 w-64 rounded-full bg-primary opacity-10 blur-[90px] animate-blob [animation-delay:6s]" />
        </>
      )}

      {!reduceMotion && !recruiterMode && (
        <div
          ref={glowRef}
          className="absolute inset-0 opacity-[0.06] transition-opacity"
          style={{
            background:
              'radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), var(--primary), transparent 60%)',
          }}
        />
      )}
    </div>
  );
}
