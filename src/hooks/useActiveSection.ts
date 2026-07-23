import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-position based (not IntersectionObserver-band based) so it stays
 * correct for short sections and the last section at the bottom of the
 * page. Depends on the joined id string rather than the array reference,
 * since callers typically pass a freshly-mapped array on every render.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? '');
  const key = sectionIds.join(',');
  const idsRef = useRef(sectionIds);
  idsRef.current = sectionIds;

  useEffect(() => {
    const ids = idsRef.current;
    if (ids.length === 0) return;

    const offset = 160;
    let raf = 0;

    const update = () => {
      raf = 0;
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) return;

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(elements[elements.length - 1]!.id);
        return;
      }

      let current = elements[0]!.id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = el.id;
        } else {
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);

  return active;
}
