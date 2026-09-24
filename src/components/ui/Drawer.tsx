import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Mono kicker above the title. */
  eyebrow?: string;
  children: ReactNode;
  width?: 'md' | 'lg';
}

const ease = [0.22, 1, 0.36, 1] as const;

/** Side panel dialog: slides in from the right, traps focus, closes on Esc / backdrop. */
export function Drawer({ open, onClose, title, eyebrow, children, width = 'md' }: DrawerProps) {
  const reduceMotion = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useLockBodyScroll(open);
  useFocusTrap(panel, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[75]">
          <m.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
            className={`absolute right-0 top-0 flex h-full w-full flex-col border-l border-foreground/10 bg-card outline-none ${
              width === 'lg' ? 'max-w-xl' : 'max-w-md'
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-foreground/10 px-6 py-5">
              <div>
                {eyebrow ? <p className="label mb-1 text-muted-foreground">{eyebrow}</p> : null}
                <h2 id="drawer-title" className="font-display text-3xl leading-none">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
              {children}
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
