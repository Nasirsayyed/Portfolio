import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Github, Linkedin, Settings2, X } from 'lucide-react';
import type { NavItem } from '@/data/navigation';
import { personalInfo } from '@/data/portfolio';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';
import { Button } from '@/components/ui/Button';
import { RecruiterModeToggle } from '@/components/theme/RecruiterModeToggle';

interface MobileMenuProps {
  items: NavItem[];
  activeId: string;
}

export function MobileMenu({ items, activeId }: MobileMenuProps) {
  const open = useUiStore((s) => s.mobileMenuOpen);
  const setOpen = useUiStore((s) => s.setMobileMenuOpen);
  const setThemeCustomizerOpen = useUiStore((s) => s.setThemeCustomizerOpen);
  const reduceMotion = useReducedMotion();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="glass fixed inset-0 z-[65] flex flex-col lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <span className="text-sm font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <motion.ul
            initial={reduceMotion ? undefined : 'hidden'}
            animate={reduceMotion ? undefined : 'show'}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6"
          >
            {items.map((item) => (
              <motion.li
                key={item.id}
                variants={
                  reduceMotion ? undefined : { hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    scrollToSection(item.id, reduceMotion);
                  }}
                  className={`focus-ring flex w-full items-center rounded-lg px-4 py-3.5 text-left text-lg font-medium transition-colors ${
                    activeId === item.id ? 'bg-secondary text-primary' : 'text-foreground hover:bg-muted'
                  }`}
                  aria-current={activeId === item.id ? 'true' : undefined}
                >
                  {item.label}
                </button>
              </motion.li>
            ))}
          </motion.ul>

          <div className="flex flex-col gap-4 border-t border-border px-5 py-6">
            <RecruiterModeToggle />

            <div className="flex items-center gap-3">
              <a
                href={personalInfo.socials.find((s) => s.icon === 'github')?.url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={personalInfo.socials.find((s) => s.icon === 'linkedin')?.url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setThemeCustomizerOpen(true);
                }}
                aria-label="Open theme customizer"
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Button as="a" href={personalInfo.resumeUrl} download size="lg" variant="primary" className="w-full">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
