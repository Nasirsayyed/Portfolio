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
  assets/         static assets, incl. the profile photo (assets/images/profile.jpg / .webp)
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

`src/components/hero/ProfileImage.tsx` renders `src/assets/images/profile.jpg` (with a `profile.webp` served first via `<picture>`) inside the gradient frame/glow wrapper, `object-cover`/`object-top` so the headshot crops sensibly at any size. To swap the photo, replace both files (keeping the same names) — resize to ~900px on the long edge first to keep the bundle lean; a JPEG quality of ~85–90 and WebP quality of ~85 is a good balance of size vs. quality for a headshot.

### Resume

`public/resume.pdf` is the actual uploaded resume and is what the "Download Resume" buttons link to. Replace this file to update it.

## Theme System

Six full presets (Ocean, Royal, Emerald, Sunset, Monochrome, Cyber) each define semantic CSS variables (`--background`, `--primary`, `--card`, `--gradient-start`, ...) for light and dark mode. Components consume only the variables via Tailwind's `bg-primary`, `text-foreground`, etc. — never a hardcoded hex — so switching preset, appearance (light/dark/system), border radius, animation level, or font size is a single DOM write in `src/utils/applyTheme.ts`. Settings persist to `localStorage` and are restored before paint via the inline script in `index.html` to avoid a flash of incorrect theme.

## Recruiter Mode

The toggle in the navbar (and command palette) switches the whole site into a concise, HR-focused view: the nav's quick-jump list narrows to Experience → Skills → Projects → Resume → Contact, the About and Highlights sections are hidden, decorative hero animation/orbits are removed, and all Framer Motion animation throughout the site is forced to its reduced form — the same code path used for `prefers-reduced-motion`.

## Command Palette

`Cmd/Ctrl + K` opens a searchable command list for navigation, resume download, dark mode toggle, opening the theme customizer, toggling Recruiter Mode, and opening the developer terminal easter egg (also reachable via the floating terminal button).

## Deployment

This is a static Vite build (no backend, no serverless functions — the contact form uses `mailto:`), so it deploys to any static host. **Vercel** is the recommended path and needs zero extra setup beyond the included `vercel.json`:

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import `nasirsayyed/portfolio`.
3. Vercel reads `vercel.json` automatically — build command `npm run build`, output directory `dist`. Click **Deploy**.
4. You'll get a live `*.vercel.app` URL immediately, with a new deployment on every push to this branch/`main`, plus preview URLs for pull requests. Add a custom domain for free under Project → Settings → Domains.

Other free options work the same way, importing the repo and using build command `npm run build` / output directory `dist`:

- **Cloudflare Pages** — most generous free bandwidth, same git-connected flow.
- **Netlify** — equivalent to Vercel; drag-and-drop `dist/` also works for a one-off deploy without connecting git.
- **GitHub Pages** — free but manual: needs a GitHub Actions workflow (or the `gh-pages` package) to publish `dist/`, and if not served from the domain root you must set `base` in `vite.config.ts` to match the repo path.

Manual/one-off build for any static host:

```bash
npm run build
# upload/point your host at the generated dist/ directory
```

Update the canonical URL and Open Graph URLs in `index.html` to match your real domain once you have one.
