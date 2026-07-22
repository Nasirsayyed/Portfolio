import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Search } from 'lucide-react';
import { commandActions, type CommandAction } from '@/data/commands';
import { personalInfo } from '@/data/portfolio';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';

const sectionIds = new Set([
  'home',
  'about',
  'experience',
  'skills',
  'projects',
  'education',
  'contact',
]);

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setThemeCustomizerOpen = useUiStore((s) => s.setThemeCustomizerOpen);
  const setTerminalOpen = useUiStore((s) => s.setTerminalOpen);

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
    if (open) {
      setQuery('');
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
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
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="glass relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border shadow-2xl"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                aria-label="Command search"
                aria-activedescendant={filtered[selected] ? `cmd-${filtered[selected].id}` : undefined}
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Esc
              </kbd>
            </div>

            <ul id="command-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-muted-foreground">No matching commands.</li>
              ) : (
                filtered.map((action, index) => (
                  <li key={action.id} id={`cmd-${action.id}`} role="option" aria-selected={selected === index}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelected(index)}
                      onClick={() => runAction(action)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        selected === index ? 'bg-secondary text-primary' : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>
                        <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
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
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
