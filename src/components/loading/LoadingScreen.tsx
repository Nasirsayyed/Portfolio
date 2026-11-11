import { useRef } from 'react';
import { personalInfo } from '@/data/portfolio';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * Intro curtain: the initials rise in, a 0→100 counter and progress bar run,
 * then the whole panel wipes upward to uncover the hero.
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) {
        const id = window.setTimeout(onComplete, 250);
        return () => window.clearTimeout(id);
      }

      const counter = { value: 0 };
      const tl = gsap.timeline({ onComplete });

      tl.from('[data-loader-char]', { yPercent: 120, rotate: 8, duration: 0.7, stagger: 0.06, ease: 'power4.out' })
        .to(
          counter,
          {
            value: 100,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
            },
          },
          0.1,
        )
        .to('[data-loader-bar]', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.1)
        .to('[data-loader-inner]', { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, '+=0.1')
        .to(rootRef.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '-=0.25');
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion] },
  );

  const glyphs = ['<', ...personalInfo.initials.split(''), '/', '>'];

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-label="Loading portfolio"
    >
      <div data-loader-inner className="flex flex-col items-center gap-6">
        <div className="flex overflow-hidden font-mono text-4xl font-semibold sm:text-6xl" aria-hidden="true">
          {glyphs.map((glyph, i) => (
            <span
              key={`${glyph}-${i}`}
              data-loader-char
              className={`inline-block ${
                glyph === '<' || glyph === '/' || glyph === '>' ? 'text-muted-foreground' : 'text-gradient-brand'
              }`}
            >
              {glyph}
            </span>
          ))}
        </div>

        <div className="flex w-48 flex-col gap-2 sm:w-64">
          <div className="h-px w-full overflow-hidden bg-border">
            <div data-loader-bar className="h-full origin-left scale-x-0 bg-gradient-brand" />
          </div>
          <div className="flex justify-between font-mono text-xs text-muted-foreground">
            <span>Loading</span>
            <span ref={countRef} className="tabular-nums">
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
