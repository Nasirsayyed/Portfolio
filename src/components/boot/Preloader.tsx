import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '@/data/portfolio';
import { use3DEnabled } from '@/hooks/use3DEnabled';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { markBooted, wantsIntro } from '@/components/boot/intro';

/** Share of the counter each real resource accounts for. */
const FONT_WEIGHT = 60;
const SIGNAL_WEIGHT = 40;
/** Fonts are enough to reveal once this long has passed, even if WebGL is still coming. */
const SOFT_WAIT = 1200;
/** Never hold the page longer than this. */
const HARD_CAP = 2500;
const EXIT_MS = 900;

/**
 * 000 → 100 counter tied to real loading (display fonts + the Signal chunk),
 * then a curtain wipe. Only on a first visit per session, never under reduced
 * motion or in Recruiter Mode. The page renders underneath the whole time, so
 * the hero name is painted (and measured for LCP) before the curtain lifts.
 */
export function Preloader() {
  const reduceMotion = useReducedMotion();
  const webgl = use3DEnabled();
  const setBooted = useUiStore((s) => s.setBooted);
  const [active] = useState(() => wantsIntro(reduceMotion));
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(!active);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) {
      setBooted(true);
      return;
    }

    let fonts = false;
    let signal = !webgl;
    let raf = 0;
    let shown = 0;
    let prev = performance.now();
    let finished = false;
    let exitTimer = 0;
    const start = prev;

    void document.fonts.ready.then(() => (fonts = true));
    if (!signal) {
      // Same specifier as App's lazy() import, so this warms the real chunk rather than a copy.
      import('@/components/signal/SignalField').then(
        () => (signal = true),
        () => (signal = true),
      );
    }

    const finish = () => {
      finished = true;
      setLeaving(true);
      setBooted(true);
      markBooted();
      exitTimer = window.setTimeout(() => setGone(true), EXIT_MS);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const elapsed = now - start;
      const ready = (fonts && (signal || elapsed > SOFT_WAIT)) || elapsed > HARD_CAP;
      // Pending resources creep toward (never reach) their share so the counter isn't frozen.
      const creep = (weight: number, done: boolean) => (done ? weight : weight * 0.8 * (1 - Math.exp(-elapsed / 700)));
      const target = ready ? 100 : creep(FONT_WEIGHT, fonts) + creep(SIGNAL_WEIGHT, signal);
      shown += (target - shown) * (1 - Math.exp(-dt * (ready ? 9 : 5)));
      if (ready && shown > 99.4) shown = 100;

      const value = Math.floor(shown);
      if (count.current) count.current.textContent = String(value).padStart(3, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`;
      if (status.current) {
        status.current.textContent = !fonts ? 'Setting type' : !signal ? 'Warming up the signal' : 'Ready';
      }

      if (shown >= 100) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      if (!finished) setBooted(true);
    };
    // Runs once for the page load; later theme/mode changes don't restart the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recruiter Mode or reduced motion switched on mid-intro: get out of the way immediately.
  useEffect(() => {
    if (active && reduceMotion && !gone) {
      setBooted(true);
      markBooted();
      setGone(true);
    }
  }, [active, reduceMotion, gone, setBooted]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-background px-5 pb-8 pt-6 text-foreground transition-transform ease-signal sm:px-8 sm:pb-10"
      style={{ transform: leaving ? 'translate3d(0,-100%,0)' : 'none', transitionDuration: `${EXIT_MS}ms` }}
    >
      <div
        className="label flex items-start justify-between text-muted-foreground transition-opacity duration-300"
        style={{ opacity: leaving ? 0 : 1 }}
      >
        <span>
          <span className="font-display text-xl normal-case italic tracking-normal text-foreground">
            N<span className="text-accent">.</span>S<span className="text-accent">.</span>
          </span>
        </span>
        <span className="text-right">
          {personalInfo.city} · {personalInfo.timeZoneLabel}
          <br />
          Portfolio — Ed. 2026
        </span>
      </div>

      <div className="transition-opacity duration-300" style={{ opacity: leaving ? 0 : 1 }}>
        <div className="flex items-end justify-between gap-6">
          <span
            ref={count}
            className="font-mono text-[clamp(4.5rem,15vw,10rem)] font-light leading-[0.8] tracking-tight tabular-nums"
          >
            000
          </span>
          <span ref={status} className="label mb-1 text-right text-muted-foreground">
            Setting type
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-foreground/10">
          <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </div>
  );
}
