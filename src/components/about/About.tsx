import { useEffect, useRef, useState } from 'react';
import { personalInfo, stats } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStickyProgress } from '@/hooks/useStickyProgress';
import { Chapter, ChapterLabel } from '@/components/ui/Chapter';
import profileJpg from '@/assets/images/profile.jpg';
import profileWebp from '@/assets/images/profile.webp';

const DIM = 0.16;
/** Words finish lighting up at this share of the pin, leaving a beat to read the whole thing. */
const REVEAL_END = 0.78;

/**
 * Duotone portrait (ink → accent on dark, accent → paper on light) that
 * cross-fades to full colour on hover. Both layers share one image request.
 */
function Portrait({ className = '' }: { className?: string }) {
  const image = (extra: string) => (
    <picture>
      <source srcSet={profileWebp} type="image/webp" />
      <img
        src={profileJpg}
        alt=""
        width={900}
        height={1352}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-[50%_20%] ${extra}`}
      />
    </picture>
  );

  return (
    <figure className={`group ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-card">
        <div className="absolute inset-0 scale-[1.04] transition-transform duration-1000 ease-signal group-hover:scale-100">
          {image('')}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 isolate bg-accent transition-opacity duration-700 ease-signal group-hover:opacity-0"
        >
          {image('scale-[1.04] grayscale contrast-125 mix-blend-screen dark:mix-blend-multiply')}
        </div>
        <span className="sr-only">Portrait of {personalInfo.name}</span>
      </div>
      <figcaption className="label mt-3 flex justify-between text-muted-foreground">
        <span>{personalInfo.name}</span>
        <span>{personalInfo.city}, IN</span>
      </figcaption>
    </figure>
  );
}

function CountUp({ value, suffix = '', animate }: { value: number; suffix?: string; animate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(animate ? 0 : value);

  useEffect(() => {
    const node = ref.current;
    if (!animate || !node) {
      setShown(value);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          setShown(Math.round((1 - Math.pow(1 - t, 4)) * value));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, animate]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}

export function About() {
  const reduceMotion = useReducedMotion();
  const pin = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const manifesto = personalInfo.manifesto.split(' ');

  // Scrub: each word lights up in turn as the pinned block is scrolled through.
  useStickyProgress(
    pin,
    (progress) => {
      const lit = (progress / REVEAL_END) * manifesto.length;
      words.current.forEach((word, i) => {
        if (word) word.style.opacity = String(DIM + (1 - DIM) * Math.min(1, Math.max(0, lit - i)));
      });
    },
    !reduceMotion,
  );

  useEffect(() => {
    if (!reduceMotion) return;
    words.current.forEach((word) => word?.style.removeProperty('opacity'));
  }, [reduceMotion]);

  return (
    <Chapter id="about">
      <div ref={pin} className={reduceMotion ? '' : 'h-[210svh]'}>
        <div className={`${reduceMotion ? 'py-28' : 'sticky top-0 flex h-[100svh] items-center'}`}>
          <div className="container grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ChapterLabel id="about" />
              <h2 className="sr-only">About</h2>
              <p className="mt-8 text-balance font-display text-[clamp(1.75rem,3.5vw,3.25rem)] leading-[1.1] tracking-[-0.01em] text-foreground">
                {manifesto.map((word, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      words.current[i] = el;
                    }}
                    className="transition-opacity duration-150"
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>
            <Portrait className="hidden w-full max-w-sm justify-self-end lg:col-span-4 lg:block" />
          </div>
        </div>
      </div>

      <div className="container pb-28 sm:pb-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <Portrait className="max-w-xs lg:hidden" />
          <p className="max-w-2xl text-lead text-muted-foreground lg:col-span-7">{personalInfo.about}</p>
        </div>

        <dl className="mt-16 grid grid-cols-2 border-t border-foreground/10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              // Two columns on mobile, four on desktop: rule between neighbours, never on the outer edge.
              className={`flex flex-col gap-3 border-b border-foreground/10 py-8 pr-6 lg:border-b-0 ${
                i % 2 === 1 ? 'border-l pl-6' : ''
              } ${i > 0 ? 'lg:border-l lg:pl-8' : ''}`}
            >
              <dt className="label order-2 text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 font-display text-[clamp(3rem,6vw,5rem)] leading-none text-foreground">
                <CountUp value={stat.value} suffix={stat.suffix} animate={!reduceMotion} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Chapter>
  );
}
