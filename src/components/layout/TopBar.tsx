import { useEffect, useState } from 'react';
import { Command, Menu, SlidersHorizontal } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';
import { AvailabilityChip } from '@/components/layout/AvailabilityChip';
import { TopProgress } from '@/components/layout/ChapterNav';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { RecruiterModeToggle } from '@/components/theme/RecruiterModeToggle';

const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground';

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setThemeCustomizerOpen = useUiStore((s) => s.setThemeCustomizerOpen);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-signal ${
          scrolled ? 'border-b border-foreground/10 bg-background/75 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <a
              href="#boot"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('boot', reduceMotion);
              }}
              className="font-display text-2xl italic leading-none text-foreground"
              aria-label={`${personalInfo.name} — back to top`}
            >
              N<span className="text-accent">.</span>S<span className="text-accent">.</span>
            </a>
            <AvailabilityChip className="hidden md:inline-flex" />
          </div>

          <div className="flex items-center gap-2">
            <RecruiterModeToggle className="hidden sm:inline-flex" />
            <RecruiterModeToggle variant="compact" className="sm:hidden" />
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className={`${iconButton} hidden w-auto gap-1.5 px-3 lg:inline-flex`}
              aria-label="Open command palette"
            >
              <Command className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="label">K</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeCustomizerOpen(true)}
              className={iconButton}
              aria-label="Open theme settings"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <a
              href={personalInfo.resumeUrl}
              download
              className="label hidden h-9 items-center rounded-full bg-foreground px-4 text-background transition-opacity hover:opacity-85 md:inline-flex"
            >
              Résumé ↓
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              className={`${iconButton} min-[1440px]:hidden`}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <TopProgress />
      </header>

      {/* Sibling, not child: the scrolled header has backdrop-filter, which would
          make it the containing block for this fixed overlay and clamp it. */}
      <MobileMenu />
    </>
  );
}
