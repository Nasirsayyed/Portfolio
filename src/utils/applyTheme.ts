import { themePresets } from '@/data/themePresets';
import { personalInfo } from '@/data/portfolio';
import { radiusValues, fontSizeValues } from '@/store/themeStore';
import type { AppearanceMode, FontSizeKey, MotionKey, RadiusKey, ThemePresetKey, ThemeTokens } from '@/types';

export function resolveIsDark(appearance: AppearanceMode): boolean {
  if (appearance === 'dark') return true;
  if (appearance === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Redraws the browser-tab favicon (and mobile theme-color) to match the active preset/mode. */
function updateBrandChrome(tokens: ThemeTokens): void {
  const start = tokens['--gradient-start'];
  const end = tokens['--gradient-end'];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><text x="32" y="42" font-family="Arial, sans-serif" font-size="26" font-weight="800" text-anchor="middle" fill="#ffffff">${personalInfo.initials}</text></svg>`;

  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  let themeColorMeta = document.querySelector<HTMLMetaElement>("meta[name='theme-color']");
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.content = tokens['--primary'];
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

  updateBrandChrome(tokens);
}
