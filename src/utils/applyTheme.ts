import { themePresets } from '@/data/themePresets';
import { radiusValues, fontSizeValues } from '@/store/themeStore';
import type { AppearanceMode, FontSizeKey, MotionKey, RadiusKey, ThemePresetKey } from '@/types';

export function resolveIsDark(appearance: AppearanceMode): boolean {
  if (appearance === 'dark') return true;
  if (appearance === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyThemeToDocument(settings: {
  appearance: AppearanceMode;
  preset: ThemePresetKey;
  radius: RadiusKey;
  motion: MotionKey;
  fontSize: FontSizeKey;
}): void {
  const root = document.documentElement;
  const preset = themePresets.find((p) => p.key === settings.preset) ?? themePresets[0]!;
  const isDark = resolveIsDark(settings.appearance);
  const tokens = isDark ? preset.dark : preset.light;

  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(key, value);
  }

  root.style.setProperty('--radius', radiusValues[settings.radius]);
  root.style.fontSize = fontSizeValues[settings.fontSize];

  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  root.setAttribute('data-preset', settings.preset);
  root.setAttribute('data-motion', settings.motion);
}
