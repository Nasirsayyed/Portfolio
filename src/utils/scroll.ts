import { scrollToTarget } from '@/motion/lenis';

/** Scrolls to a chapter by id, through Lenis when smooth scrolling is active. */
export function scrollToSection(id: string, reduceMotion = false): void {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToTarget(el, { immediate: reduceMotion });
  // Move focus to the chapter so keyboard and screen-reader users land there too.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
