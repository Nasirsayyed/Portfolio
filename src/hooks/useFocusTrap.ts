import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog focus management: moves focus into `container` when `active`, keeps
 * Tab / Shift+Tab cycling inside it, and returns focus to whatever was
 * focused before once it deactivates.
 */
export function useFocusTrap(container: RefObject<HTMLElement>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const frame = requestAnimationFrame(() => {
      const el = container.current;
      if (el && !el.contains(document.activeElement)) (focusables()[0] ?? el).focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus?.({ preventScroll: true });
    };
  }, [container, active]);
}
