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
  appearance: 'system' as AppearanceMode,
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
    { name: 'portfolio-theme' },
  ),
);

export const radiusValues: Record<RadiusKey, string> = {
  sharp: '2px',
  rounded: '12px',
  'extra-rounded': '22px',
};

export const fontSizeValues: Record<FontSizeKey, string> = {
  compact: '93.75%',
  default: '100%',
  comfortable: '107.5%',
};
