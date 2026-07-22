# Nasirahmed Sayyed — Portfolio

A premium, interactive developer portfolio built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. All content is sourced from `src/data/*.ts`, populated from the resume — nothing is fabricated.

## Stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS (semantic CSS-variable design tokens)
- Framer Motion
- Lucide React icons
- Zustand (+ `persist`) for theme and Recruiter Mode state

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build   # type-checks then builds to dist/
npm run preview # preview the production build locally
```

## Project Structure

```
src/
  assets/         static assets (drop a real profile photo in assets/images/)
  components/     feature-organized components (layout, hero, about, experience, ...)
  data/           centralized, typed content — portfolio.ts, experience.ts, projects.ts, themePresets.ts
  hooks/          reusable hooks (scroll spy, count-up, reduced motion, ...)
  store/          Zustand stores (theme + UI state)
  types/          shared TypeScript interfaces
  utils/          small pure helpers (scroll, contact form, theme application)
```

## Content

Edit `src/data/portfolio.ts`, `src/data/experience.ts`, and `src/data/projects.ts` to update copy — every section reads from these files, nothing is hardcoded into JSX.

### Profile photo

No photo was supplied with the source resume, so the hero uses a gradient initials avatar (`src/components/hero/ProfileImage.tsx`) instead of a placeholder/stock image. To use a real photo:

1. Add the image to `src/assets/images/profile.jpg` (or `.png`/`.webp`).
2. In `ProfileImage.tsx`, replace the initials `<span>` block with an `<img>` importing that asset, keeping `object-cover` and the existing frame/gradient/glow wrapper.

### Resume

`public/resume.pdf` is the actual uploaded resume and is what the "Download Resume" buttons link to. Replace this file to update it.

## Theme System

Six full presets (Ocean, Royal, Emerald, Sunset, Monochrome, Cyber) each define semantic CSS variables (`--background`, `--primary`, `--card`, `--gradient-start`, ...) for light and dark mode. Components consume only the variables via Tailwind's `bg-primary`, `text-foreground`, etc. — never a hardcoded hex — so switching preset, appearance (light/dark/system), border radius, animation level, or font size is a single DOM write in `src/utils/applyTheme.ts`. Settings persist to `localStorage` and are restored before paint via the inline script in `index.html` to avoid a flash of incorrect theme.

## Recruiter Mode

The toggle in the navbar (and command palette) switches the whole site into a concise, HR-focused view: the nav's quick-jump list narrows to Experience → Skills → Projects → Resume → Contact, the About and Highlights sections are hidden, decorative hero animation/orbits are removed, and all Framer Motion animation throughout the site is forced to its reduced form — the same code path used for `prefers-reduced-motion`.

## Command Palette

`Cmd/Ctrl + K` opens a searchable command list for navigation, resume download, dark mode toggle, opening the theme customizer, toggling Recruiter Mode, and opening the developer terminal easter egg (also reachable via the floating terminal button).

## Deployment

This is a static Vite build — deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, S3 + CloudFront, etc.):

```bash
npm run build
# upload/point your host at the generated dist/ directory
```

Update the canonical URL and Open Graph URLs in `index.html` to match your real domain before deploying.
