import type { Config } from 'tailwindcss';

/**
 * Theme colours are CSS variables holding hex/rgba values. Wrapping them in
 * color-mix with Tailwind's <alpha-value> placeholder makes opacity modifiers
 * (`bg-accent/10`, `border-foreground/20`) work — a bare `var(--x)` silently
 * generates no rule for them.
 */
const token = (name: string) => `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`;

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '3rem' },
      // Content caps at 1280px so wide screens keep a gutter for the chapter index.
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    },
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        border: 'var(--border)',
        line: 'var(--border)',
        glow: 'var(--glow)',
      },
      fontFamily: {
        sans: ['"Geist Variable"', '"Geist Variable Fallback"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', '"Instrument Serif Fallback"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"Geist Mono Variable"', '"Geist Mono Variable Fallback"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid scale. `mega` is the hero name; `giga` the Connect headline.
        label: ['clamp(0.66rem, 0.62rem + 0.15vw, 0.75rem)', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        lead: ['clamp(1.05rem, 0.98rem + 0.35vw, 1.3rem)', { lineHeight: '1.6' }],
        'display-sm': ['clamp(2rem, 1.4rem + 2.6vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2.75rem, 1.6rem + 5vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        mega: ['clamp(3.5rem, 11vw, 11rem)', { lineHeight: '0.86', letterSpacing: '-0.04em' }],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 6px)',
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 14px)',
      },
      transitionTimingFunction: {
        signal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        glow: '0 0 0 1px var(--border), 0 18px 60px -20px var(--glow)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-reverse': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-5%, 3%)' },
          '40%': { transform: 'translate(4%, -6%)' },
          '60%': { transform: 'translate(-3%, 5%)' },
          '80%': { transform: 'translate(6%, -2%)' },
        },
        'scroll-cue': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        'pulse-dot': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.8)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-reverse': 'marquee-reverse 42s linear infinite',
        grain: 'grain 1s steps(4) infinite',
        'scroll-cue': 'scroll-cue 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
