import { create } from 'zustand';

interface UiState {
  commandPaletteOpen: boolean;
  themeCustomizerOpen: boolean;
  terminalOpen: boolean;
  mobileMenuOpen: boolean;
  activeProjectId: string | null;
  /** Flips true once the loading screen has finished its exit animation. */
  introComplete: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  setThemeCustomizerOpen: (open: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveProjectId: (id: string | null) => void;
  setIntroComplete: (done: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  themeCustomizerOpen: false,
  terminalOpen: false,
  mobileMenuOpen: false,
  activeProjectId: null,
  introComplete: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setThemeCustomizerOpen: (open) => set({ themeCustomizerOpen: open }),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setIntroComplete: (done) => set({ introComplete: done }),
}));
