import { create } from 'zustand';

export type CursorState = 'default' | 'link' | 'view' | 'drag' | 'text';

interface UiState {
  commandPaletteOpen: boolean;
  themeCustomizerOpen: boolean;
  terminalOpen: boolean;
  mobileMenuOpen: boolean;
  contactOpen: boolean;
  activeProjectId: string | null;
  /** True once the preloader has handed over (or was skipped). */
  booted: boolean;
  /** True once the lazy motion engine (Lenis + GSAP) is running. */
  motionReady: boolean;
  /** Stack chapter focus: layer id, or null for all. */
  stackFocus: 'client' | 'api' | 'data' | 'tooling' | null;
  setCommandPaletteOpen: (open: boolean) => void;
  setThemeCustomizerOpen: (open: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setContactOpen: (open: boolean) => void;
  setActiveProjectId: (id: string | null) => void;
  setBooted: (booted: boolean) => void;
  setMotionReady: (ready: boolean) => void;
  setStackFocus: (focus: UiState['stackFocus']) => void;
}

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  themeCustomizerOpen: false,
  terminalOpen: false,
  mobileMenuOpen: false,
  contactOpen: false,
  activeProjectId: null,
  booted: false,
  motionReady: false,
  stackFocus: null,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setThemeCustomizerOpen: (open) => set({ themeCustomizerOpen: open }),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setContactOpen: (open) => set({ contactOpen: open }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setBooted: (booted) => set({ booted }),
  setMotionReady: (ready) => set({ motionReady: ready }),
  setStackFocus: (stackFocus) => set({ stackFocus }),
}));
