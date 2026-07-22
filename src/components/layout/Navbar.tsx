import { useEffect, useState } from 'react';
import { Command, Download, Github, Linkedin, Menu, Settings2 } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { navItems, recruiterNavItems } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { RecruiterModeToggle } from '@/components/theme/RecruiterModeToggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setThemeCustomizerOpen = useUiStore((s) => s.setThemeCustomizerOpen);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);

  const items = recruiterMode ? recruiterNavItems : navItems;
  const activeId = useActiveSection(items.map((i) => i.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border shadow-card' : 'bg-transparent'
      }`}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <nav className="container flex h-16 items-center justify-between sm:h-20" aria-label="Primary">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home', reduceMotion);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground shadow-glow focus-ring"
          aria-label={`${personalInfo.name} — home`}
        >
          {personalInfo.initials}
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToSection(item.id, reduceMotion)}
                className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeId === item.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
                {activeId === item.id ? (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-brand" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <RecruiterModeToggle />

          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="focus-ring flex h-10 items-center gap-2 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span>K</span>
          </button>

          <a
            href={personalInfo.socials.find((s) => s.icon === 'github')?.url}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={personalInfo.socials.find((s) => s.icon === 'linkedin')?.url}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setThemeCustomizerOpen(true)}
            aria-label="Open theme customizer"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </button>

          <Button as="a" href={personalInfo.resumeUrl} download size="sm" variant="primary">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Resume
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>

      <MobileMenu items={items} activeId={activeId} />
    </header>
  );
}
