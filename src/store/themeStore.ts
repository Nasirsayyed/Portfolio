import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppearanceMode, FontSizeKey, MotionKey, RadiusKey, ThemePresetKey } from '@/types';
import { defaultThemePreset } from '@/data/themePresets';

export interface ThemeState {
  appearance: AppearanceMode;
  preset: ThemePresetKey;
  radius: RadiusKey;
  motion: MotionKey;
  fontSize: FontSizeKey;
  recruiterMode: boolean;
  setAppearance: (appearance: AppearanceMode) => void;
  setPreset: (preset: ThemePresetKey) => void;
  setRadius: (radius: RadiusKey) => void;
  setMotion: (motion: MotionKey) => void;
  setFontSize: (fontSize: FontSizeKey) => void;
  toggleRecruiterMode: () => void;
  setRecruiterMode: (value: boolean) => void;
  reset: () => void;
}

const defaults = {
  appearance: 'dark' as AppearanceMode,
  preset: defaultThemePreset,
  radius: 'rounded' as RadiusKey,
  motion: 'full' as MotionKey,
  fontSize: 'default' as FontSizeKey,
  recruiterMode: false,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...defaults,
      setAppearance: (appearance) => set({ appearance }),
      setPreset: (preset) => set({ preset }),
      setRadius: (radius) => set({ radius }),
      setMotion: (motion) => set({ motion }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleRecruiterMode: () => set((s) => ({ recruiterMode: !s.recruiterMode })),
      setRecruiterMode: (value) => set({ recruiterMode: value }),
      reset: () => set({ ...defaults }),
    }),
    {
      name: 'portfolio-theme',
      // v1 = the v3 redesign. Move returning visitors onto the new Signal
      // default once; keep an explicit light/dark choice, but an untouched
      // "system" default becomes the new dark-first default.
      version: 1,
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<ThemeState>;
        if (version < 1) {
          return {
            ...state,
            preset: defaultThemePreset,
            appearance: state.appearance === 'system' || !state.appearance ? 'dark' : state.appearance,
          } as ThemeState;
        }
        return state as ThemeState;
      },
    },
  ),
);

export const radiusValues: Record<RadiusKey, string> = {
  sharp: '0px',
  rounded: '6px',
  'extra-rounded': '14px',
};

export const fontSizeValues: Record<FontSizeKey, string> = {
  compact: '93.75%',
  default: '100%',
  comfortable: '107.5%',
};
