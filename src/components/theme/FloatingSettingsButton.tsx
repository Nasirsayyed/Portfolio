import { Settings2 } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

export function FloatingSettingsButton() {
  const setThemeCustomizerOpen = useUiStore((s) => s.setThemeCustomizerOpen);

  return (
    <button
      type="button"
      onClick={() => setThemeCustomizerOpen(true)}
      aria-label="Open theme customizer"
      className="focus-ring fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow transition-transform hover:scale-105 hover:rotate-45"
    >
      <Settings2 className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
