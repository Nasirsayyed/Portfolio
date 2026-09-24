import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy: string;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Modal({ open, onClose, children, labelledBy, className = '' }: ModalProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // Only re-run when `open` changes — `onClose` is often a fresh inline
    // function, and re-running on every render would disturb focus inside the
    // modal (e.g. the dev terminal's input) on every keystroke.
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-6">
          <m.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
            className={`relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-foreground/15 bg-card text-card-foreground shadow-2xl outline-none ${className}`}
            data-lenis-prevent
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/20 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {children}
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
