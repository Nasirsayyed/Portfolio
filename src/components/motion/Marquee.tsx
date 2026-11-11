import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MarqueeProps {
  items: string[];
  /** -1 scrolls right-to-left reversed. */
  direction?: 1 | -1;
  ghost?: boolean;
  /** Seconds for one full loop at rest. */
  speed?: number;
}

/**
 * Infinite ticker that reacts to scroll: it speeds up with scroll velocity
 * and flips direction when the page scrolls back up.
 */
export function Marquee({ items, direction = 1, ghost = false, speed = 40 }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) return;
      const track = rootRef.current?.querySelector<HTMLElement>('[data-marquee-track]');
      if (!track) return;

      const loop = gsap.fromTo(
        track,
        { xPercent: direction === 1 ? 0 : -50 },
        { xPercent: direction === 1 ? -50 : 0, duration: speed, ease: 'none', repeat: -1 },
      );

      // Start deep into the repeat range so a negative timeScale (scrolling up)
      // can run "backwards" indefinitely without hitting time 0.
      loop.totalTime(speed * 500);

      const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
      let settle: gsap.core.Tween | null = null;

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = gsap.utils.clamp(-3000, 3000, self.getVelocity());
          loop.timeScale((1 + Math.abs(velocity) / 400) * self.direction);
          skewTo(gsap.utils.clamp(-6, 6, velocity / -300));
          settle?.kill();
          settle = gsap.delayedCall(0.1, () => {
            gsap.to(loop, { timeScale: self.direction, duration: 1.2, ease: 'power3.out' });
            skewTo(0);
          });
        },
      });
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion, direction, speed] },
  );

  // The list is rendered twice so the -50% loop point is seamless.
  const sequence = [...items, ...items];

  return (
    <div ref={rootRef} className="relative flex overflow-hidden py-2" aria-hidden="true">
      <div data-marquee-track className="flex w-max shrink-0 items-center will-change-transform">
        {sequence.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span
              className={`whitespace-nowrap px-6 text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-none tracking-tight ${
                ghost ? 'text-ghost' : 'text-foreground/90'
              }`}
            >
              {item}
            </span>
            <span className="text-gradient-brand text-[clamp(1.25rem,3vw,2.25rem)] font-black">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
