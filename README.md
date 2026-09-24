# Nasirahmed Sayyed — Portfolio

**🔗 Live site: [nasirahmedsayyed.vercel.app](https://nasirahmedsayyed.vercel.app/)** (production branch)

This branch, `claude/portfolio-v3`, is the **v3 "Signal" redesign**: a seven-chapter, scroll-driven portfolio with one persistent WebGL particle field behind the page. The field changes shape for each chapter, from a breathing core to an architecture diagram, a timeline helix, a grid and a pulse. All content is real DOM text read from `src/data/*.ts`, taken from the résumé. Recruiter Mode is a flat, fast résumé view with no WebGL.

> Full design and engineering write-up: **[docs/V3-DESIGN.md](docs/V3-DESIGN.md)**

## Stack

- React 18 + TypeScript (strict) + Vite 5
- Tailwind CSS on CSS-variable design tokens
- three.js + React Three Fiber 8 + drei, with custom GLSL (lazy-loaded)
- @react-three/postprocessing (bloom, chromatic aberration; desktop dark mode only)
- Lenis smooth scrolling driven by the GSAP ticker, with ScrollTrigger (lazy-loaded)
- Framer Motion via `LazyMotion strict` (shared-element case studies, drawers, dialogs)
- Zustand (+ `persist`) for theme and Recruiter Mode state
- Instrument Serif, Geist Sans and Geist Mono, self-hosted via Fontsource

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
npm run lint
```

## The Seven Chapters

| # | Chapter | Highlights |
|---|---|---|
| 01 | Boot | Real-progress preloader (000→100), character-masked name, decoding stack line, magnetic CTAs |
| 02 | About | Pinned word-by-word manifesto, duotone portrait, count-up stats |
| 03 | Stack | Client / API / Data bands aligned to the field's architecture planes; hover or filter to light a layer |
| 04 | Experience | Pinned horizontal timeline on desktop (vertical on phones), riding a particle helix |
| 05 | Work | Editorial index with a pointer-following cover; full-screen shared-element case studies |
| 06 | Proof | Bento of spotlight tiles with headline figures, education and certifications |
| 07 | Connect | Copy-email, magnetic socials, contact form in a side drawer; footer with live IST clock |

## Project Structure

```
src/
  components/
    boot/         preloader, hero
    signal/       the WebGL field: shapes, GLSL, scroll→shape mapping, post-processing
    about/ stack/ experience/ work/ proof/ connect/   one folder per chapter
    layout/       top bar, chapter nav, mobile menu, footer, grain/vignette
    cursor/ ui/   custom cursor, magnetic wrapper, chapter shell, drawer, modal
    command-palette/ terminal/ theme/
  motion/         lazy motion engine (Lenis + GSAP), Lenis handle, framer features
  data/           all content + theme presets
  hooks/          reduced motion, sticky progress, scramble, idle gate, focus trap, ...
  store/          Zustand stores (theme + UI state)
  types/ utils/
```

## Content

Edit the files in `src/data/` to change copy. Nothing is hardcoded into JSX. `portfolio.ts` holds the profile, manifesto, stats, skills (each tagged with its Stack layer), achievements, education and socials. `experience.ts` holds the roles. `projects.ts` holds the case studies (problem, approach, result, headline metric).

### Profile photo

`src/assets/images/profile.jpg` + `profile.webp` (served first via `<picture>`) appear in About as a duotone portrait that turns full colour on hover. To swap it, replace both files under the same names, at about 900 px on the long edge.

### Resume

`public/resume.pdf` is what every "Résumé" button downloads. Replace it to update.

## Theme System

The default preset is **Signal**: ink `#0A0A0B` with a lime `#C6FF3D` accent, or paper with olive in light mode. The six v2 presets (Ocean, Royal, Emerald, Sunset, Monochrome, Cyber) are generated from the same token recipe. Light / dark / system, radius and motion level are all adjustable in the theme drawer. Settings persist and are applied before first paint by the inline script in `index.html`. The WebGL field reads the active colours live, so switching theme recolours the particles.

## Recruiter Mode

The toggle in the top bar, the hero and the command palette switches to a flat, fast résumé view. There's no WebGL, smooth scrolling, intro or pinning, and every animation is stopped. The résumé download stays visible at every screen size and becomes the hero's primary action. It uses the same code path as `prefers-reduced-motion`.

## Command Palette

`Cmd/Ctrl + K` opens a searchable list: jump to any chapter, download the résumé, toggle dark mode or Recruiter Mode, open the theme drawer, open the contact form, or open the developer terminal easter egg (also linked from the footer).

## Performance

Entry JS is 94 kB gzip. three.js, GSAP and Lenis load only after first paint, fonts and an idle moment. Lighthouse on the production build scores 94 (mobile) and 100 (desktop) for performance, with LCP 2.3 s / 0.5 s on the hero name and CLS 0. Browsers with only software WebGL get a static gradient in place of the field. See [docs/V3-DESIGN.md](docs/V3-DESIGN.md#7-performance) for the breakdown.

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
