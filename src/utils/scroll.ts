import { getLenis } from '@/lib/smoothScroll';

type Target = HTMLElement | number;

/**
 * Smooth-scrolls through Lenis when it is running. If Lenis is momentarily
 * stopped (an overlay that locked scrolling is closing in the same click),
 * wait for it to restart — starting Lenis resets any in-flight animation.
 */
function smoothScrollTo(target: Target, reduceMotion: boolean): void {
  const lenis = getLenis();

  if (!lenis || reduceMotion) {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
    return;
  }

  const run = (attempt = 0) => {
    if (lenis.isStopped && attempt < 30) {
      requestAnimationFrame(() => run(attempt + 1));
      return;
    }
    lenis.scrollTo(target, { duration: 1.4, force: true });
  };
  run();
}

export function scrollToSection(id: string, reduceMotion = false): void {
  const el = document.getElementById(id);
  if (!el) return;
  smoothScrollTo(el, reduceMotion);
}

export function scrollToTop(reduceMotion = false): void {
  smoothScrollTo(0, reduceMotion);
}
