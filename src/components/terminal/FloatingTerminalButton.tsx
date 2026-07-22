import { TerminalSquare } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

export function FloatingTerminalButton() {
  const setTerminalOpen = useUiStore((s) => s.setTerminalOpen);

  return (
    <button
      type="button"
      onClick={() => setTerminalOpen(true)}
      aria-label="Open developer terminal"
      className="focus-ring fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-transform hover:-translate-y-0.5 hover:border-primary/50"
    >
      <TerminalSquare className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
