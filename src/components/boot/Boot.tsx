import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { ArrowDown, ArrowDownRight } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScramble } from '@/hooks/useScramble';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';
import { Chapter, ChapterLabel } from '@/components/ui/Chapter';
import { Magnetic } from '@/components/ui/Magnetic';
import { RecruiterModeToggle } from '@/components/theme/RecruiterModeToggle';
import { wantsIntro } from '@/components/boot/intro';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/** As the hero scrolls away its content lifts, fades and softens. Pure transform/filter, no re-renders. */
function useScrollOut(ref: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      if (p === 0) {
        el.style.removeProperty('transform');
        el.style.removeProperty('filter');
        el.style.removeProperty('opacity');
        return;
      }
      el.style.transform = `translate3d(0, ${(-p * 80).toFixed(1)}px, 0)`;
      el.style.filter = `blur(${(p * 10).toFixed(2)}px)`;
      el.style.opacity = String(1 - p * 0.85);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.removeProperty('transform');
      el.style.removeProperty('filter');
      el.style.removeProperty('opacity');
    };
  }, [ref, enabled]);
}

/**
 * The name, rendered as one plain text run until the intro plays so it is
 * painted (and counted as the LCP element) under the preloader. Only when the
 * curtain lifts is it split into masked characters that rise into place.
 */
function Name({ split }: { split: boolean }) {
  const [first = '', ...rest] = personalInfo.name.split(' ');
  const last = rest.join(' ');

  if (!split) {
    return (
      <>
        {first} <em className="italic">{last}</em>
      </>
    );
  }

  let i = 0;
  const chars = (word: string) =>
    Array.from(word, (ch) => (
      <span key={i} className="char inline-block" style={{ '--i': i++ } as CSSProperties}>
        {ch}
      </span>
    ));

  return (
    <>
      <span className="sr-only">{personalInfo.name}</span>
      <span aria-hidden="true">
        <span className="mask-hero">{chars(first)}</span> <em className="mask-hero italic">{chars(last)}</em>
      </span>
    </>
  );
}

export function Boot() {
  const reduceMotion = useReducedMotion();
  const booted = useUiStore((s) => s.booted);
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const [intro] = useState(() => wantsIntro(reduceMotion));
  const reveal = intro ? (booted ? 'play' : 'armed') : undefined;
  const content = useRef<HTMLDivElement>(null);
  useScrollOut(content, !reduceMotion);

  const roleLine = personalInfo.coreStack.join(' · ').toUpperCase();
  const role = useScramble(roleLine, {
    start: !intro || booted,
    enabled: !reduceMotion,
    delay: intro ? 900 : 250,
  });

  return (
    <Chapter id="boot" title="Introduction" className={`flex flex-col ${recruiterMode ? '' : 'min-h-[100svh]'}`}>
      <div
        ref={content}
        data-reveal={reveal}
        className="container flex flex-1 flex-col pb-8 pt-24 will-change-[transform,filter] sm:pb-10 sm:pt-28"
      >
        <div className="rise flex items-start justify-between gap-6" style={delay(150)}>
          <ChapterLabel id="boot" />
          <p className="label hidden text-right text-muted-foreground sm:block">
            {personalInfo.title}
            <br />
            {personalInfo.domains.join(' / ')}
          </p>
        </div>

        {/* The gap leaves room for the Signal core; Recruiter Mode has no field, so it closes up. */}
        <div className={`mt-auto ${recruiterMode ? 'pt-16 sm:pt-24' : 'pt-[27svh] lg:pt-0'}`}>
          <p className="rise label mb-5 text-muted-foreground sm:mb-7" style={delay(250)}>
            <span className="text-accent">●</span> 4+ years · .NET &amp; React · Sangli, India
          </p>

          <h1 className="font-display text-mega font-normal leading-[0.95] tracking-[-0.025em] text-foreground">
            <Name split={reveal === 'play'} />
          </h1>

          <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-7 sm:mt-10 lg:grid-cols-12 lg:items-end lg:gap-6">
            <div className="rise lg:col-span-5" style={delay(450)}>
              <p className="font-mono text-xs tracking-[0.14em] text-accent sm:text-sm">
                <span className="sr-only">{roleLine}</span>
                <span aria-hidden="true">{role}</span>
              </p>
              <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lead">{personalInfo.valueProposition}</p>
            </div>

            <div className="rise flex flex-col gap-5 lg:col-span-5 lg:col-start-7" style={delay(600)}>
              <div className="flex flex-wrap items-center gap-3">
                {recruiterMode ? (
                  <a
                    href={personalInfo.resumeUrl}
                    download
                    className="inline-flex h-12 items-center gap-3 rounded-full bg-accent pl-6 pr-5 font-medium text-accent-foreground transition-[filter] hover:brightness-110"
                  >
                    Download résumé
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Magnetic>
                    <a
                      href="#work"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('work', reduceMotion);
                      }}
                      className="group inline-flex h-12 items-center gap-3 rounded-full bg-accent pl-6 pr-5 font-medium text-accent-foreground transition-[filter] hover:brightness-110"
                    >
                      View selected work
                      <ArrowDownRight
                        className="h-4 w-4 transition-transform duration-300 ease-signal group-hover:rotate-[-45deg]"
                        aria-hidden="true"
                      />
                    </a>
                  </Magnetic>
                )}
                <Magnetic>
                  <a
                    href="#connect"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('connect', reduceMotion);
                    }}
                    className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 font-medium text-foreground transition-colors hover:border-foreground/60"
                  >
                    Get in touch
                  </a>
                </Magnetic>
              </div>
              <div className="label flex items-center gap-3 text-muted-foreground">
                <span>{recruiterMode ? 'Flat, fast view' : 'In a hurry?'}</span>
                <RecruiterModeToggle />
              </div>
            </div>

            <div className="rise hidden justify-end lg:col-span-1 lg:col-start-12 lg:flex" style={delay(750)}>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about', reduceMotion);
                }}
                className="label flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground"
              >
                Scroll
                <span className="relative block h-12 w-px overflow-hidden bg-foreground/15" aria-hidden="true">
                  <span className="absolute inset-0 animate-scroll-cue bg-accent" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
