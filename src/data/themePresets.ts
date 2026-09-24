import type { ThemePreset, ThemePresetKey, ThemeTokens } from '@/types';

/**
 * v3 "editorial" token system. Every preset shares the same structure — ink
 * (dark) or paper (light) grounds, one hairline, one muted grey, and a single
 * accent — and differs only in its hue. Components never reference these
 * values directly; they read the CSS variables applyTheme writes to :root.
 *
 * Light-mode accents are darkened versions of the dark-mode hue so accent
 * text keeps >= 4.5:1 contrast on paper (a raw neon on paper is ~1:1).
 */

interface Ground {
  background: string;
  surface: string;
  raised: string;
  accent: string;
}

const INK_TEXT = '#EDEDED';
const INK_MUTED = '#8A8A8F';
const PAPER_TEXT = '#0A0A0B';
const PAPER_MUTED = '#5E5E63';

function hexToRgba(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function tokens(ground: Ground, mode: 'dark' | 'light'): ThemeTokens {
  const dark = mode === 'dark';
  const text = dark ? INK_TEXT : PAPER_TEXT;
  const onAccent = dark ? '#0A0A0B' : ground.background;
  return {
    '--background': ground.background,
    '--foreground': text,
    '--primary': ground.accent,
    '--primary-foreground': onAccent,
    '--secondary': ground.raised,
    '--secondary-foreground': text,
    '--accent': ground.accent,
    '--accent-foreground': onAccent,
    '--card': ground.surface,
    '--card-foreground': text,
    '--border': dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 10, 11, 0.10)',
    '--muted': ground.raised,
    '--muted-foreground': dark ? INK_MUTED : PAPER_MUTED,
    // One accent only: the old two-stop gradients collapse onto it.
    '--gradient-start': ground.accent,
    '--gradient-end': ground.accent,
    '--glow': hexToRgba(ground.accent, dark ? 0.35 : 0.22),
  };
}

function preset(
  key: ThemePresetKey,
  name: string,
  description: string,
  dark: Ground,
  light: Ground,
): ThemePreset {
  return {
    key,
    name,
    description,
    swatch: `linear-gradient(135deg, ${dark.background} 0 55%, ${dark.accent} 55% 100%)`,
    dark: tokens(dark, 'dark'),
    light: tokens(light, 'light'),
  };
}

export const themePresets: ThemePreset[] = [
  preset(
    'signal',
    'Signal',
    'Ink and electric lime — the default.',
    { background: '#0A0A0B', surface: '#111113', raised: '#18181B', accent: '#C6FF3D' },
    { background: '#F4F2EE', surface: '#EDEAE4', raised: '#E4E1DA', accent: '#3F5900' },
  ),
  preset(
    'ocean',
    'Ocean',
    'Deep navy ink with a cool cyan signal.',
    { background: '#07090C', surface: '#0E1217', raised: '#151B22', accent: '#5CC8FF' },
    { background: '#F1F4F6', surface: '#E8ECEF', raised: '#DDE3E8', accent: '#0B5E8E' },
  ),
  preset(
    'royal',
    'Royal',
    'Violet ink, lavender signal.',
    { background: '#0A090D', surface: '#121017', raised: '#1A1721', accent: '#B69CFF' },
    { background: '#F3F1F6', surface: '#EAE7EF', raised: '#E0DCE8', accent: '#5B3FC4' },
  ),
  preset(
    'emerald',
    'Emerald',
    'Forest ink, mint signal.',
    { background: '#070B09', surface: '#0E1411', raised: '#151D19', accent: '#4BE3A5' },
    { background: '#F0F4F1', surface: '#E6ECE8', raised: '#DBE3DE', accent: '#0B6B47' },
  ),
  preset(
    'sunset',
    'Sunset',
    'Warm ink, ember signal.',
    { background: '#0C0908', surface: '#15100E', raised: '#1E1714', accent: '#FF9A5A' },
    { background: '#F6F1EC', surface: '#EEE7E0', raised: '#E5DCD3', accent: '#A33E0B' },
  ),
  preset(
    'monochrome',
    'Monochrome',
    'No hue at all — pure contrast.',
    { background: '#0A0A0A', surface: '#121212', raised: '#1A1A1A', accent: '#F5F5F5' },
    { background: '#F4F4F2', surface: '#EAEAE7', raised: '#DFDFDB', accent: '#0A0A0A' },
  ),
  preset(
    'cyber',
    'Cyber',
    'Near-black with an aqua signal.',
    { background: '#050608', surface: '#0C0F13', raised: '#13181E', accent: '#3DF5FF' },
    { background: '#EFF4F5', surface: '#E4EBEC', raised: '#D8E1E3', accent: '#006A73' },
  ),
];

export const defaultThemePreset: ThemePresetKey = 'signal';
