import { useEffect, useRef } from 'react';
import { chapters } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollToSection } from '@/utils/scroll';

const ids = chapters.map((c) => c.id);

/** Writes page scroll progress (0–1) into a CSS transform without re-rendering. */
function useProgressBar(axis: 'x' | 'y') {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = axis === 'y' ? `scaleY(${p})` : `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [axis]);
  return bar;
}

/** Fixed side index for desktop: `01 Boot … 07 Connect` with a thin progress rail. */
export function ChapterNav() {
  const active = useActiveSection(ids);
  const reduceMotion = useReducedMotion();
  const bar = useProgressBar('y');

  return (
    <nav
      aria-label="Chapters"
      className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:flex"
    >
      <div className="relative mr-4 w-px bg-foreground/10" aria-hidden="true">
        <div ref={bar} className="absolute inset-0 origin-top bg-accent" style={{ transform: 'scaleY(0)' }} />
      </div>
      <ol className="flex flex-col gap-2.5">
        {chapters.map((chapter) => {
          const isActive = chapter.id === active;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => scrollToSection(chapter.id, reduceMotion)}
                aria-current={isActive ? 'true' : undefined}
                className="group label flex items-center gap-3 py-0.5 text-left"
              >
                <span className={isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'}>
                  {chapter.number}
                </span>
                <span
                  className={`transition-[opacity,transform] duration-300 ease-signal ${
                    isActive
                      ? 'translate-x-0 text-foreground opacity-100'
                      : '-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  {chapter.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Thin horizontal progress line for the top bar (mobile + tablet). */
export function TopProgress() {
  const bar = useProgressBar('x');
  return (
    <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/10 min-[1440px]:hidden" aria-hidden="true">
      <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
