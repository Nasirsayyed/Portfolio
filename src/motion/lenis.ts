import type Lenis from 'lenis';

/**
 * Entry-safe handle to the smooth-scroll instance. Lenis itself lives in the
 * lazily-loaded motion engine; everything on the critical path talks to it
 * through here and falls back to native scrolling when it isn't running
 * (reduced motion, Recruiter Mode, or before the engine has loaded).
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Height of the fixed top bar; anchors land just below it. */
const HEADER_OFFSET = 72;

export function scrollToTarget(target: string | HTMLElement | number, options: { immediate?: boolean } = {}): void {
  if (instance) {
    instance.scrollTo(target, { offset: typeof target === 'number' ? 0 : -HEADER_OFFSET, immediate: options.immediate });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: options.immediate ? 'auto' : 'smooth' });
}
