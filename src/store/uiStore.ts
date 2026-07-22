import { create } from 'zustand';

interface UiState {
  commandPaletteOpen: boolean;
  themeCustomizerOpen: boolean;
  terminalOpen: boolean;
  mobileMenuOpen: boolean;
  activeProjectId: string | null;
  setCommandPaletteOpen: (open: boolean) => void;
  setThemeCustomizerOpen: (open: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveProjectId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  themeCustomizerOpen: false,
  terminalOpen: false,
  mobileMenuOpen: false,
  activeProjectId: null,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setThemeCustomizerOpen: (open) => set({ themeCustomizerOpen: open }),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
}));
