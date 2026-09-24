import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Reports 0–1 progress through a tall section whose child is `position:
 * sticky` — 0 when its top reaches the viewport top, 1 when its bottom
 * reaches the viewport bottom. The callback runs in rAF and should write
 * styles directly rather than set state. Reads window scroll, which Lenis
 * drives, so it stays in step with smooth scrolling.
 */
export function useStickyProgress(
  ref: RefObject<HTMLElement>,
  onProgress: (progress: number) => void,
  enabled = true,
) {
  const callback = useRef(onProgress);
  useLayoutEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : rect.top <= 0 ? 1 : 0;
      callback.current(progress);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
}
