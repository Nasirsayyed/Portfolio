import { useEffect, useRef } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { chapters, chapterCount } from '@/data/navigation';
import { personalInfo } from '@/data/portfolio';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';
import { AvailabilityChip } from '@/components/layout/AvailabilityChip';

const ids = chapters.map((c) => c.id);
const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu() {
  const open = useUiStore((s) => s.mobileMenuOpen);
  const setOpen = useUiStore((s) => s.setMobileMenuOpen);
  const reduceMotion = useReducedMotion();
  const active = useActiveSection(ids);
  const closeButton = useRef<HTMLButtonElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id, reduceMotion);
  };

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label="Chapters"
          className="fixed inset-0 z-[70] flex flex-col bg-background"
          initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
        >
          <div className="flex h-16 items-center justify-between border-b border-foreground/10 px-5 sm:px-8">
            <span className="label text-muted-foreground">Chapters · {chapterCount}</span>
            <button
              ref={closeButton}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ol className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-5 sm:px-8" data-lenis-prevent>
            {chapters.map((chapter, i) => (
              <li key={chapter.id} className="mask">
                <m.button
                  type="button"
                  onClick={() => go(chapter.id)}
                  aria-current={active === chapter.id ? 'true' : undefined}
                  initial={reduceMotion ? false : { y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: reduceMotion ? 0 : 0.7, ease, delay: reduceMotion ? 0 : 0.15 + i * 0.05 }}
                  className="flex items-baseline gap-4 py-1 text-left"
                >
                  <span className={`label ${active === chapter.id ? 'text-accent' : 'text-muted-foreground'}`}>
                    {chapter.number}
                  </span>
                  <span
                    className={`font-display text-display-sm ${
                      active === chapter.id ? 'italic text-foreground' : 'text-foreground/80'
                    }`}
                  >
                    {chapter.label}
                  </span>
                </m.button>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-4 border-t border-foreground/10 px-5 py-6 sm:px-8">
            <AvailabilityChip />
            <a
              href={personalInfo.resumeUrl}
              download
              className="label inline-flex h-11 items-center justify-center rounded-full bg-foreground text-background"
            >
              Download résumé ↓
            </a>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
