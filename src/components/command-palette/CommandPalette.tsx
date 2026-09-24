import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CornerDownLeft, Search } from 'lucide-react';
import { commandActions, type CommandAction } from '@/data/commands';
import { chapters } from '@/data/navigation';
import { personalInfo } from '@/data/portfolio';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';

const sectionIds = new Set(chapters.map((chapter) => chapter.id));

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setThemeCustomizerOpen = useUiStore((s) => s.setThemeCustomizerOpen);
  const setTerminalOpen = useUiStore((s) => s.setTerminalOpen);
  const setContactOpen = useUiStore((s) => s.setContactOpen);

  const appearance = useThemeStore((s) => s.appearance);
  const setAppearance = useThemeStore((s) => s.setAppearance);
  const toggleRecruiterMode = useThemeStore((s) => s.toggleRecruiterMode);
  const reduceMotion = useReducedMotion();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useLockBodyScroll(open);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commandActions;
    return commandActions.filter(
      (action) => action.label.toLowerCase().includes(q) || action.keywords?.includes(q),
    );
  }, [query]);

  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onGlobalKeyDown);
    return () => document.removeEventListener('keydown', onGlobalKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    // Return focus to whatever opened the palette once it closes.
    const opener = document.activeElement as HTMLElement | null;
    setQuery('');
    setSelected(0);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => opener?.focus?.({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const runAction = (action: CommandAction) => {
    if (sectionIds.has(action.id)) {
      scrollToSection(action.id, reduceMotion);
    } else if (action.id === 'download-resume') {
      const link = document.createElement('a');
      link.href = personalInfo.resumeUrl;
      link.download = '';
      link.click();
    } else if (action.id === 'toggle-dark-mode') {
      setAppearance(appearance === 'dark' ? 'light' : 'dark');
    } else if (action.id === 'open-theme-customizer') {
      setThemeCustomizerOpen(true);
    } else if (action.id === 'toggle-recruiter-mode') {
      toggleRecruiterMode();
    } else if (action.id === 'open-terminal') {
      setTerminalOpen(true);
    } else if (action.id === 'open-contact') {
      setContactOpen(true);
    }
    setOpen(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = filtered[selected];
      if (action) runAction(action);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-24 sm:pt-32">
          <m.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-foreground/15 bg-card shadow-2xl"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a chapter or run a command…"
                aria-label="Command search"
                aria-activedescendant={filtered[selected] ? `cmd-${filtered[selected].id}` : undefined}
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="label rounded border border-foreground/15 px-1.5 py-0.5 text-muted-foreground">
                Esc
              </kbd>
            </div>

            <ul id="command-list" role="listbox" className="max-h-80 overflow-y-auto p-2" data-lenis-prevent>
              {filtered.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-muted-foreground">No matching commands.</li>
              ) : (
                filtered.map((action, index) => (
                  <li key={action.id} id={`cmd-${action.id}`} role="option" aria-selected={selected === index}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelected(index)}
                      onClick={() => runAction(action)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                        selected === index ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      <span>
                        <span className="label mr-3 inline-block w-20 text-muted-foreground">
                          {action.group}
                        </span>
                        {action.label}
                      </span>
                      {selected === index ? <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
