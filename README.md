# Nasirahmed Sayyed — Portfolio

**🔗 Live site: [nasirahmedsayyed.vercel.app](https://nasirahmedsayyed.vercel.app/)**

A premium, interactive developer portfolio built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. All content is sourced from `src/data/*.ts`, populated from the resume — nothing is fabricated.

## Stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS (semantic CSS-variable design tokens)
- Framer Motion
- three.js + React Three Fiber + drei (3D scenes, lazy-loaded)
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

## 3D Experience

> Full write-up — architecture, performance numbers, fallbacks, bugs fixed and extension guide: **[docs/3D-IMPLEMENTATION.md](docs/3D-IMPLEMENTATION.md)**

The site is built in two layers of 3D:

- **WebGL (`src/components/three/`)** — `Scene3D` is a fixed full-page canvas behind all content: floating geometry, a particle field and lighting, with a camera that descends through the world as you scroll and drifts with the pointer. `HeroMedallion` puts the profile photo on a 3D medallion with orbiting tech rings that tilts toward the pointer and turns away as you scroll past. Both read the active theme's CSS variables (`useThemeColors`), so switching preset or light/dark recolours the 3D world live.
- **CSS 3D (no WebGL)** — `TiltCard` rotates cards toward the pointer; children marked `.depth-1/2/3` sit at different Z depths and separate on hover. `Reveal3D` swings content in on a hinge, `SkillSphere` projects every skill onto a draggable rotating sphere, and project covers are glass cubes that turn over on hover.

Performance and fallbacks:

- three.js (~220 kB gzipped) is only reachable through `React.lazy` imports, so it loads after first paint and never blocks the page; the hero shows the flat photo until it arrives.
- The hero canvas stops rendering when scrolled out of view, the skill sphere pauses offscreen, and `PerformanceMonitor` lowers resolution and particle count on slow devices.
- **Reduced motion** keeps the scenes but renders them static; tilt is disabled on touch devices.
- **Recruiter Mode** and browsers without WebGL get the flat 2D site (a `WebGLBoundary` also catches runtime context failures).

## Recruiter Mode

The toggle in the navbar (and command palette) switches the whole site into a concise, HR-focused view: the nav's quick-jump list narrows to Experience → Skills → Projects → Resume → Contact, the About and Highlights sections are hidden, all WebGL scenes are removed in favour of the flat 2D layout (skills become a scannable grid instead of the sphere), and all animation throughout the site is forced to its reduced form — the same code path used for `prefers-reduced-motion`.

## Command Palette

`Cmd/Ctrl + K` opens a searchable command list for navigation, resume download, dark mode toggle, opening the theme customizer, toggling Recruiter Mode, and opening the developer terminal easter egg (also reachable via the floating terminal button).

## Deployment

**Currently deployed on Vercel at [https://nasirahmedsayyed.vercel.app/](https://nasirahmedsayyed.vercel.app/)** — every push to the connected branch redeploys automatically, and pull requests get their own preview URLs.

This is a static Vite build (no backend, no serverless functions — the contact form uses `mailto:`), so it deploys to any static host. Vercel needs zero extra setup beyond the included `vercel.json`: import the repo at [vercel.com/new](https://vercel.com/new) and it picks up build command `npm run build` and output directory `dist` on its own. A custom domain can be added for free under Project → Settings → Domains.

If you add a custom domain later, update the absolute URLs in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, and the JSON-LD `url`), plus `public/sitemap.xml` and `public/robots.txt`, which all currently point at the Vercel URL.

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
