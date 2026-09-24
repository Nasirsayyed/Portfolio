# Portfolio v3 — "Signal"

Branch `claude/portfolio-v3`, built from `claude/portfolio-3d`. React 18, React Three Fiber 8, Vite 5. Not merged into production.

v3 turns the portfolio into one continuous piece. A single WebGL particle field — the **Signal** — sits behind the whole page and changes shape as you move through seven chapters. Every word on the page is still real DOM text read from `src/data/*.ts`. Recruiter Mode is still a flat, fast résumé with no WebGL at all.

---

## 1. Art direction

| | |
|---|---|
| **Palette** | Ink `#0A0A0B` with a single lime accent `#C6FF3D` (dark). Paper `#F4F2EE` with olive `#3F5900` (light). The six v2 presets (Ocean, Royal, Emerald, Sunset, Monochrome, Cyber) remain, generated from the same token recipe. |
| **Type** | *Instrument Serif* for display (roman + italic), *Geist Sans* for body, *Geist Mono* for labels and metadata. All self-hosted via Fontsource, with Capsize-matched fallbacks so a font swap doesn't move text. |
| **Motion** | One easing, `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-signal` in Tailwind, `--ease-signal` in CSS). Movement is scroll-scrubbed or tied to a single transition. Nothing loops for decoration except the pulse dots, marquees and the field itself. |
| **Texture** | Animated film grain and a vignette (`Atmosphere`), both `pointer-events: none`. |
| **Labels** | `[ 03 / 07 ]  STACK`: every chapter opens with the same mono index (`ChapterLabel`). |

Theme tokens live in `src/data/themePresets.ts` (`tokens(ground, mode)`). Tailwind colours resolve through `color-mix()` so opacity modifiers (`bg-foreground/10`) work on CSS variables. Every text/background pairing was checked at ≥ 4.5 : 1; the lowest is 4.76.

## 2. Chapters

| # | Chapter | What happens | Signal shape |
|---|---|---|---|
| 01 | **Boot** | Preloader counts 000→100 on real loading, curtain lifts, name rises letter by letter from a mask, stack line decodes from random glyphs. Magnetic CTAs, Recruiter Mode toggle, scroll cue; content blurs and lifts as it scrolls away. | Core: a breathing sphere that bulges toward the pointer |
| 02 | **About** | Pinned manifesto whose words light up as you scroll; duotone portrait that cross-fades to full colour on hover; count-up stats. | Core, parked beside the portrait |
| 03 | **Stack** | Sticky stage. Three DOM bands (Client / API / Data) sit exactly on the field's three planes; hovering a band or choosing a filter lights that plane in the accent. Dual marquees below. | Architecture: three tilted planes, with request streams running between them |
| 04 | **Experience** | Desktop: the chapter pins and its panels travel sideways, oldest to newest, over a year ruler. Phones / reduced motion: a vertical timeline. Current role has a pulsing "Now" badge. | Timeline: a helix that slides with the panels |
| 05 | **Work** | Editorial index. A cover follows the pointer and slides between projects; rows dim around the hovered one. A click opens a full-screen case study: the name flies from its row (shared `layoutId`) while a separate curtain wipes up. Previous/next, arrow keys, Esc. Phones expand rows inline. | Grid: a receding lattice with a standing wave |
| 06 | **Proof** | Bento of spotlight tiles: one pointer handler lights every tile, so neighbours catch the edge of the glow. Achievements lead with a headline figure; education and certifications complete the grid. | Grid, dimmer |
| 07 | **Connect** | "Let's build something *solid*." Copy-email with a toast, magnetic socials, and the contact form in a side drawer (flat — it never tilts). Footer with chapter index, live IST clock and the dev-terminal entry point. | Pulse: a small core emitting rings |

## 3. The Signal field

`src/components/signal/`

| File | Role |
|---|---|
| `shapes.ts` | Builds five morph targets for *n* particles (seeded PRNG, so it's identical every load): core, architecture, helix, grid, pulse. Also per-particle `random`, `tone` (≈10% accent) and `layer` (which plane a particle belongs to in Stack). |
| `shader.ts` | Vertex shader blends between targets on `uStage` (0–4), staggering particles only mid-morph so settled shapes stay crisp. Each shape adds its own life: simplex-noise surface + pointer bulge (core), flowing request streams (architecture), spin + travel (helix), standing wave (grid), expanding rings (pulse). Fragment shader draws a soft sprite and applies `colorspace_fragment`. |
| `chapterState.ts` | Maps scroll to a target pose. Reads `[data-chapter]` rects; each chapter has a keyframe (stage, offset, scale, dim). A chapter holds its shape and morphs to the next over its last 38%, or only its last half-viewport in long pinned chapters, so a shape holds for the whole pin. |
| `SignalField.tsx` | One `<points>` draw call with a `ShaderMaterial`. Uniforms are damped toward the scroll target every frame. Theme colours arrive through `useThemeColors` (a `MutationObserver` on `<html>`); additive blending on ink, normal on paper. |
| `SignalPost.tsx` | Bloom + a hair of chromatic aberration. Lazy, and only on the high tier in dark mode without reduced motion. |

**Tiers.** 24k particles on desktop, 8k on phones/coarse pointers, 4k when drei's `PerformanceMonitor` reports sustained low frame rates (fewer particles are drawn larger to keep density). DPR is capped at 1.5.

**Stack alignment.** The planes sit at world y = ±2.1, tilted 0.42 rad toward the camera (fov 45, z = 10). They project to about 27 / 50 / 73 % of the viewport height at *any* size, because the vertical FOV is fixed, so the DOM bands are simply positioned at those percentages inside a `100svh` sticky stage.

## 4. Global systems

| System | Where | Notes |
|---|---|---|
| Smooth scroll | `motion/MotionEngine.tsx` (lazy) | Lenis driven by the GSAP ticker (`autoRaf: false`, `lagSmoothing(0)`); `lenis.on('scroll', ScrollTrigger.update)`; `ScrollTrigger.refresh()` once fonts load. Everything else reaches Lenis through `motion/lenis.ts`, which falls back to native scrolling. |
| Pins & scrubs | `hooks/useStickyProgress.ts` | Pinned chapters are CSS `position: sticky` stages inside tall wrappers; a rAF scroll handler reports 0–1 progress and writes styles directly. This is deliberate: sticky can't desync from Lenis, needs no pin-spacer, and costs no GSAP on the critical path. |
| Cursor | `cursor/Cursor.tsx` | Dot + ring with states `default / link / view / drag / text` (from `data-cursor` or inferred). Only with a fine pointer and motion enabled; rAF sleeps when idle. |
| Magnetic | `ui/Magnetic.tsx` | Springs toward the pointer; inert on touch and reduced motion. |
| Chapter nav | `layout/ChapterNav.tsx` | `01 Boot … 07 Connect` side index with a progress rail at ≥ 1440 px; a hairline progress bar in the top bar below that. |
| Preloader | `boot/Preloader.tsx` | Counter weighted by real loading: display fonts 60%, Signal chunk 40% (fetched only after fonts). Reveals when fonts are in and the chunk has landed or 1.2 s has passed; hard cap 2.5 s. Skipped on repeat visits in a session (`index.html` sets `data-booted` before paint), under reduced motion and in Recruiter Mode. |
| Hero reveal | `boot/Boot.tsx` | The name renders as **one plain text run** beneath the preloader, so it paints and is measured as the LCP element. It is split into masked characters only when the curtain lifts. |
| Case study | `work/CaseStudy.tsx` (lazy, prefetched as the index nears) | Shared-element title + curtain on separate layers (the curtain's clip must never cut the flying title). Paging swaps the article inside its own nested `AnimatePresence`, which keeps remounts from blocking the dialog's exit. |
| Framer | `LazyMotion strict` + async `domMax` | Only `m.*` components exist in the app, so full framer-motion never reaches the entry chunk. |

## 5. Modes

| | Recruiter Mode | Reduced motion | No / software WebGL | Touch |
|---|---|---|---|---|
| Signal field | none | still frame, rendered on demand | gradient backdrop | 8k tier, no pointer bulge |
| Preloader / hero reveal | skipped | skipped | preloader skips the chunk wait | as desktop |
| Smooth scroll (Lenis) | off | off | on | on |
| About | unpinned, text fully lit | unpinned, text fully lit | as desktop | as desktop |
| Stack | flat list of bands | pinned (no motion) | flat list of bands | pinned |
| Experience | vertical timeline | vertical timeline | horizontal on desktop | vertical |
| Work | index + case study, no preview | index + case study, no preview | as desktop | inline expand on phones |
| Cursor / magnetic | off | off | on | off |
| CSS loops (pulse, marquee, grain) | stopped via `html[data-recruiter]` | stopped | on | on |
| Résumé download | visible at every width, hero leads with it | top bar (≥ md) and menu | same | menu |

Recruiter Mode is the flat, fast résumé: no WebGL, no smooth scroll, no intro, no pins, résumé first. It is folded into `useReducedMotion()` for JS and into the reduced-motion CSS through `html[data-recruiter]`, which is set pre-paint from the persisted store.

**Software WebGL.** `isWebGLAvailable()` rejects SwiftShader, llvmpipe and other CPU rasterisers. They can draw the field, but at hundreds of milliseconds per frame on the main thread. To test the field in a headless browser anyway:

```js
localStorage.setItem('signal:force-webgl', '1'); // then reload
```

## 6. Accessibility

- Real DOM text everywhere; the canvas is `aria-hidden`. The split hero name keeps an `sr-only` copy; scrambled and counting text expose their final value to assistive tech.
- Landmarks: header, chapter `nav`, `main` with one labelled section per chapter, footer. Skip link. One `h1`; each chapter has an `h2`.
- Dialogs (case study, contact drawer, theme drawer, command palette, terminal) trap focus, close on Esc, lock scroll (including Lenis) and restore focus to their opener.
- Contact form: labelled fields, `aria-invalid` + described errors, focus moves to the first invalid field; error colours pass contrast in both themes.
- The horizontal Experience track scrolls the page to any panel that receives keyboard focus.
- Keyboard: ⌘/Ctrl-K palette, arrow keys page case studies, all filters are `aria-pressed` buttons.
- **axe-core**: no violations in Recruiter Mode or with reduced motion. With motion on, the only finding is About's manifesto. Words that haven't been scrolled to are dimmed to 16% by design, and they reach full contrast as you scroll (or immediately in the other two modes).

## 7. Performance

**Budgets and results** (production build, `vite preview`, Lighthouse 12):

| | Budget | Result |
|---|---|---|
| Entry JS (gzip) | ≤ 130 kB | **94.0 kB** |
| LCP | < 2.5 s, hero name | **2.3 s** mobile / **0.5 s** desktop, element: the hero `h1` |
| CLS | < 0.05 | **0** (mobile and desktop) |
| Lighthouse | — | Performance **94** mobile / **100** desktop · Accessibility 96 · Best practices 100 · SEO 100 |
| `dist/index.html` preloads | nothing 3D | four font files only |

**Chunks (gzip).** Entry 94.0 kB · CSS 10.0 kB · framer features 23.5 kB · motion engine (GSAP + ScrollTrigger + Lenis) 51.2 kB · Signal field (three.js + R3F) 226.5 kB · post-processing 17.1 kB · case study 2.4 kB. No `manualChunks`: three.js is reachable only through `lazy()`.

**Load order.** HTML → CSS + entry + four preloaded fonts → first paint (hero name) → *fonts ready + idle* → motion engine and Signal field mount (the preloader fetched the Signal chunk once fonts were in) → canvas fades in.

What made the difference:
- Preloading the hero's **italic**. Its late swap re-wrapped "Sayyed" on phones and shifted the hero (CLS 0.141 → 0).
- Deferring the field and motion engine until fonts + idle, so they stop competing for bandwidth and CPU during first paint.
- Dropping the last full `motion.*` components, which took the entry from 117.6 kB to 94.0 kB.

Caveat: the build container only has software GL, so these Lighthouse runs measure the gradient-backdrop path. On real GPUs the field mounts after LCP and can't affect LCP or CLS; its per-frame cost wasn't measurable here.

## 8. Editing content

Everything reads from `src/data/`:

| File | Holds |
|---|---|
| `portfolio.ts` | name, role line (`coreStack`), `manifesto` (About scrub) + `about`, value proposition, availability, city/time zone, stats, skills (each with a `layer`: client / api / data / tooling), achievements (each with a `figure`), education, certifications, socials |
| `experience.ts` | roles with `summary`, `impact` (shown) and `highlights` (the platform list uses the text before each `:`) |
| `projects.ts` | `name`, `tagline`, `year`, `metric`, and `problem` / `approach` / `result` for case studies, plus role, features, technologies |
| `navigation.ts` | the seven chapters |
| `themePresets.ts` | presets and the token recipe |

Figures on covers and Proof tiles are taken from the résumé. None were invented.

## 9. Lessons carried over from v2

- No `manualChunks` for three.js; lazy boundaries alone keep it off the critical path.
- No `overflow: hidden` between a `preserve-3d` parent and depth children.
- Never toggle Framer `animate` / `whileInView` between a value and `undefined`. Removing a target snaps children back to `initial`.
- `<main>` uses `overflow-x: clip`, not `hidden`, so sticky pins keep working.
- An element with `backdrop-filter` becomes the containing block for `fixed` children, so the mobile menu renders as the header's sibling.

New in v3:
- `aspect-ratio` + `overflow: clip` doesn't clip: only a scroll container (`overflow: hidden`) stops the automatic minimum height from growing to fit content.
- A shared-layout title must not live under the curtain's `clip-path`; put the curtain on its own layer.
- Remounting keyed `m.*` children inside an `AnimatePresence` child can leave the parent's exit waiting forever. Give paging its own nested presence.

## 10. Deliberate deviations

- **Pins use CSS sticky, not ScrollTrigger `pin`.** Same effect, no pin-spacer layout shifts, and no GSAP on the critical path. GSAP drives Lenis and keeps ScrollTrigger in sync for anything added later.
- **Portrait WebGL ripple (optional in the brief) was skipped.** The duotone cross-fade is CSS-only and costs nothing.
- **The portrait ships at 900 px wide** (≈ 60 kB more than the displayed size needs). A 600 px `srcset` variant is a cheap follow-up.
