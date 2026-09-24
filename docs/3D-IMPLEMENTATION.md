# 3D Portfolio — Implementation Notes

**Branch:** `claude/portfolio-3d` (branched from `claude/premium-dev-portfolio-i0jzge`)
**Live (current 2D site):** https://nasirahmedsayyed.vercel.app/

This branch rebuilds the portfolio as a 3D experience. The content, data files, theme system, and Recruiter Mode are unchanged. It adds a 3D layer on top and falls back to the original flat site when 3D would get in the way.

---

## Table of Contents

1. [What Changed at a Glance](#what-changed-at-a-glance)
2. [Tech Stack Additions](#tech-stack-additions)
3. [Architecture](#architecture)
4. [WebGL Layer](#webgl-layer)
5. [CSS 3D Layer](#css-3d-layer)
6. [Section-by-Section Changes](#section-by-section-changes)
7. [Theme Integration](#theme-integration)
8. [Performance](#performance)
9. [Fallbacks & Accessibility](#fallbacks--accessibility)
10. [Bugs Found and Fixed During Development](#bugs-found-and-fixed-during-development)
11. [Testing Performed](#testing-performed)
12. [File Reference](#file-reference)
13. [How-To: Extending the 3D System](#how-to-extending-the-3d-system)
14. [Running, Previewing & Merging](#running-previewing--merging)
15. [Known Limitations](#known-limitations)

---

## What Changed at a Glance

| Area | Before (2D) | Now (3D) |
|---|---|---|
| Page background | Dot grid + blurred gradient blobs (hero only) | Full-page WebGL world with floating geometry and a particle field. The camera travels through it as you scroll |
| Hero photo | Circular image with CSS glow | Photo on a 3D medallion with orbiting tech rings (C#, React, .NET). It tilts toward the cursor and turns away as you scroll |
| Hero text | Fade-up | Each element flips up on a 3D hinge in sequence. The rotating job title rolls like a cube |
| Section headings | Fade-up | Hinge flip-in with extruded 3D typography |
| Cards (experience, projects, highlights, education, contact, stats) | Flat hover lift | Tilt toward the pointer with glare. Inner layers sit at different depths and separate on hover |
| Skills | Filterable grid | A sphere of skills you can drag to spin, with inertia. Picking a category brings it forward |
| Project covers | Gradient + initials | Glass cube (initials plus top technologies) that turns over on hover |
| Modals / drawer | Scale / slide | 3D hinge entrances |
| Loading screen | Text | Spinning 3D cube + text |

About **2,200 lines added across 32 files** in two commits:

- `caa87f3` — Rebuild the portfolio as a 3D experience
- `263fb90` — Fix hero content vanishing when Recruiter Mode is turned on

---

## Tech Stack Additions

| Package | Version | Why |
|---|---|---|
| `three` | ^0.169.0 | WebGL engine |
| `@react-three/fiber` | ^8.18.0 | React renderer for three.js. **v8 is the React 18 line** (v9 requires React 19) |
| `@react-three/drei` | ^9.122.0 | Helpers: `Float`, `Html`, `Sparkles`, `useTexture`, `PerformanceMonitor`. v9 pairs with Fiber v8 |
| `@types/three` | ^0.169.0 | Types (dev dependency) |

There are no other new dependencies. The CSS 3D layer uses Framer Motion and Tailwind, which were already in the project.

---

## Architecture

The site has two independent 3D layers:

```
┌──────────────────────────────────────────────────────────┐
│  DOM content (text, cards, forms) — always readable      │
│    └─ CSS 3D layer: TiltCard, Reveal3D, SkillSphere,     │
│       project cubes, 3D headings  (no WebGL needed)      │
├──────────────────────────────────────────────────────────┤
│  HeroMedallion — WebGL canvas #2 (hero only)             │
├──────────────────────────────────────────────────────────┤
│  Scene3D — WebGL canvas #1, fixed full-page, z-index -10 │
└──────────────────────────────────────────────────────────┘
```

**Why two layers?** WebGL gives real depth, lighting, and particles for the background and hero. Text stays in the DOM so it is crisp, selectable, accessible, and indexable by search engines. The CSS 3D layer puts genuine depth on real DOM content without rendering text inside a canvas.

**Why two canvases rather than one?** A single canvas with drei `View`s tracking DOM elements is possible, but it's considerably more complex and fragile. Two WebGL contexts is well within browser limits (~16).

### Gatekeeping: `use3DEnabled()`

`src/hooks/use3DEnabled.ts` decides whether WebGL renders at all:

```ts
return webglAvailable && !recruiterMode;
```

- `isWebGLAvailable()` (`src/components/three/webgl.ts`) probes once for a `webgl2`/`webgl` context and caches the result.
- Recruiter Mode deliberately returns the concise flat site (see [Fallbacks](#fallbacks--accessibility)).

---

## WebGL Layer

### `Scene3D` — the page-wide world

`src/components/three/Scene3D.tsx`, lazy-loaded from `App.tsx`.

- **Placement:** `fixed inset-0 -z-10 pointer-events-none`, behind all content. Clicks pass straight through.
- **Camera rig (`CameraRig`):** each frame reads scroll progress (0 → 1) and moves the camera down by `TRAVEL = 38` world units, so you fly past shapes as you read. The pointer adds a damped parallax offset. A small roll (`rotation.z`) stops the descent from feeling like a flat pan.
- **Floating shapes (`FloatingShapes`):** 18 meshes on desktop and 12 on mobile. They cycle through icosahedron, torus-knot, octahedron, torus, dodecahedron and tetrahedron. Every third shape is wireframe and the rest are glossy standard materials. Each one bobs and rotates via drei `Float`.
  - **Positions are seeded** (`seeded(n)`, a deterministic pseudo-random function), so the layout is identical on every load.
  - **Kept to the edges:** x-position is computed from the actual visible width at each shape's depth (`tan(fov/2) × distance × aspect`) and placed at 84–104% of the half-width. The shapes frame the content instead of sitting behind the text.
  - **Hero corner kept clear:** right-side shapes in the hero zone are pushed back to `z = -16`, where the fog hides them, so they don't collide with the medallion.
- **Particle field (`ParticleField`):** 1,400 points on desktop and 500 on mobile. They're spread through the whole travel volume and coloured on a gradient between the theme's `--gradient-start` and `--gradient-end`. A soft round sprite is generated at runtime on a `<canvas>`, so no image asset is needed.
- **Fog** uses the theme's `--background` colour, so distant objects fade into the page colour.
- **Lighting:** ambient, one directional, and three coloured point lights spaced along the travel path (primary, accent, primary).

### `HeroMedallion` — the 3D photo

`src/components/three/HeroMedallion.tsx`, lazy-loaded from `Hero.tsx`.

- **Construction:** an open cylinder (the metallic coin edge), a front bezel ring, the photo on a circle, and a back face.
- **Photo fidelity:** the photo uses `meshBasicMaterial` with `toneMapped={false}` and an sRGB texture. It is unlit, so skin tones render exactly as photographed.
- **Cropping:** the 900×1352 portrait is cropped to its top square with texture `repeat`/`offset`. This matches the old `object-top` framing and keeps the face centred without distortion. A `CircleGeometry` is used because its planar UVs keep the image upright.
- **Orbits:** three tilted rings, each with a small orbiting sphere carrying a drei `<Html>` label. Each frame the label's world position is checked. When it passes **behind** the medallion it hides, and it scales and fades with depth.
- **Motion:** it tilts toward the pointer, sways gently at idle, floats, and turns up to about 1.3 rad away as the hero scrolls out of view.
- **Extras:** drei `Sparkles` in the theme's gradient colour, plus a CSS glow behind the canvas.
- **Rendering is paused offscreen:** `useInView` switches the canvas `frameloop` from `'always'` to `'demand'` when the hero leaves the viewport.

### Shared utilities — `src/components/three/webgl.ts`

- `isWebGLAvailable()` — the cached capability probe.
- `pointer` + `ensurePointerTracking()` — one passive window-level `pointermove` listener that stores the normalised (-1…1) cursor position. Both canvases read it inside their render loops. It can't use R3F's own pointer because the background canvas is `pointer-events: none`.
- `scrollProgress()` — scroll position normalised to 0…1.

### `WebGLBoundary`

`src/components/three/WebGLBoundary.tsx` is a small error boundary. If creating a WebGL context fails at runtime (GPU blocklisted, context lost, driver crash), it renders a fallback instead of breaking the page. The hero falls back to the flat `ProfileImage`, and the background falls back to nothing.

---

## CSS 3D Layer

These are GPU-accelerated CSS transforms. They work without WebGL and look crisp at any zoom.

### `TiltCard` — `src/components/ui/TiltCard.tsx`

A wrapper that rotates toward the pointer. Framer Motion springs drive `rotateX`, `rotateY`, `z` lift, and a radial glare that follows the cursor.

- **Depth layers:** the card sets `transform-style: preserve-3d`. Children can use `.depth-1` (20px), `.depth-2` (40px) or `.depth-3` (64px) to float at different depths above the card face.
- **Layers stay aligned at rest:** perspective is animated from 6000px at rest (almost flat, so layers line up with the card) down to 900px on hover. That change is what makes the layers visibly separate. A fixed perspective would have left headings visibly misaligned even when idle.
- **Props:** `maxTilt` (degrees, default 9), `lift` (px, default 18), `glare` (default true).
- **Disabled** on touch devices (`useFinePointer`), under reduced motion, and in Recruiter Mode. When disabled, the card renders completely flat.

> ⚠️ **Never put `overflow: hidden` on a TiltCard or on an element between it and its `.depth-*` children.** CSS spec: `overflow` other than `visible` forces `transform-style: flat`, which silently kills the depth layers. `ProjectCard` clips its rounded cover on the cover element itself for this reason.

### `Reveal3D` — `src/components/ui/Reveal3D.tsx`

A scroll-triggered entrance that swings content in on a hinge. The `from` prop picks the edge: `'bottom'` rotates on X, and `'left'`/`'right'` rotate on Y from that side. Under reduced motion it renders a plain `<div>`.

### `SkillSphere` — `src/components/skills/SkillSphere.tsx`

The 29 skills are placed on a sphere and projected **in JavaScript**. It does not use nested CSS 3D.

- **Distribution:** a Fibonacci lattice gives even spacing across the sphere.
- **Rendering:** a `requestAnimationFrame` loop rotates every point and writes `transform`, `opacity`, `z-index` and a slight blur straight to each chip's `style`. **React doesn't re-render per frame.**
- **Chips stay upright:** labels are billboarded, so they always face the viewer however the sphere turns.
- **Depth cues:** chips further back are smaller, fainter and slightly blurred. Chip size falls off faster than position so far chips shrink out of the way.
- **Interaction:** drag to spin, with inertia. Auto-rotation slows to 25% while hovered. `touch-action: pan-y` keeps vertical page scrolling working on phones.
- **Filtering:** chips in the selected category are highlighted and brought forward. Other chips recede to 16% opacity.
- **Efficiency:** an `IntersectionObserver` stops the loop when the sphere is offscreen, and a `ResizeObserver` resizes it.
- **Reduced motion:** no loop at all. It redraws only on drag, resize, or filter change.

### Project cube covers — `src/components/projects/ProjectCover.tsx`

Each cover is a six-face CSS cube of glassy faces showing the project initials and its top three technologies. It sits over a receding perspective floor grid with a contact shadow.

- It rests at an isometric angle and **turns 180° when its card is hovered** (Tailwind `group-hover`).
- `backface-visibility: hidden` on the faces stops mirrored text showing through the glass.
- Sizes: `card` (84px cube), `feature` (120px, wider aspect for the lead card) and `modal` (112px).

### Utilities added to `src/index.css`

| Class | Effect |
|---|---|
| `.preserve-3d` | `transform-style: preserve-3d` |
| `.backface-hidden` | `backface-visibility: hidden` |
| `.depth-1` / `.depth-2` / `.depth-3` | `translateZ(20px / 40px / 64px)` |
| `.text-3d` | Stacked theme-tinted text-shadows that read as extruded type |
| `.text-3d-glow` | Soft drop-shadow glow using `--glow` |

A `spin-cube` keyframe and matching `animate-spin-cube` utility were added in `tailwind.config.ts` (used by the loader).

---

## Section-by-Section Changes

| Section | Changes |
|---|---|
| **Hero** | The WebGL medallion replaces the flat photo, which remains as the loading fallback and in Recruiter Mode. Text flips up in sequence. The job title rolls like a cube: old and new titles share a grid cell and a common axis, so the line never goes blank. `HeroBackground` renders only when 3D is off |
| **About / Stats** | Stat cards are TiltCards with the number floated forward (`depth-2`) and glowing. Staggered `Reveal3D` entrance |
| **Experience** | Cards swing in from alternating sides and tilt gently (4°, readable while you hover). The "Current Role" badge floats furthest forward. Timeline dots are now lit spheres (radial gradient) |
| **Skills** | `SkillSphere` replaces the grid (the grid returns in Recruiter Mode). An `sr-only` list mirrors the visible skills for screen readers |
| **Projects** | TiltCards with cube covers; the featured card gets the larger cube |
| **Highlights** | Three depth planes: icon tile (`depth-3`), title (`depth-2`), body (`depth-1`) |
| **Education & Certs** | Swing in from left and right; TiltCards with depth |
| **Contact** | Contact tiles tilt with icons popping forward. **The form itself does not tilt** — a moving target is miserable to type into |
| **Modals / Drawer** | Hinge entrances (`rotateX` / `rotateY`) with perspective |
| **Loading screen** | Wireframe cube spinning above `<NS />` |

---

## Theme Integration

`src/hooks/useThemeColors.ts` connects the CSS-variable theme to WebGL materials.

- It reads `--primary`, `--accent`, `--gradient-start`, `--gradient-end`, `--foreground` and `--background` from computed style, and dark mode from the `.dark` class.
- It re-reads through a **`MutationObserver` on `<html>`** (`style`, `class`, `data-preset`, `data-theme`) rather than subscribing to the Zustand store.
  - **Why:** the store changes *before* `applyThemeToDocument` has written the new CSS variables. React runs child effects before parent effects, so a store subscription would read stale colours. Observing the DOM guarantees the new values are already there.
- The result: switching any of the six presets (Ocean, Royal, Emerald, Sunset, Monochrome, Cyber), or light/dark/system, recolours the shapes, particles, medallion, rings, sparkles, lights and fog live.

---

## Performance

### Bundle

| Chunk | Size (min) | Gzip | When it loads |
|---|---|---|---|
| Main entry (`index-*.js`) | ~369 kB | ~114 kB | Immediately (+~13 kB vs. the 2D branch) |
| three.js + R3F + drei (shared chunk) | ~822 kB | ~222 kB | **Lazily, after first paint** |
| `Scene3D` | ~6.5 kB | ~3 kB | Lazy |
| `HeroMedallion` | ~16.5 kB | ~6 kB | Lazy |

- three.js is reachable **only** through `React.lazy` imports, so it never blocks first paint. Until it arrives, the hero shows the normal flat photo inside `Suspense`, so the page is never blank.
- **Verified:** `dist/index.html` preloads nothing from the 3D chunks, and the entry chunk has no static imports of them.
- `chunkSizeWarningLimit` is set to 900 kB in `vite.config.ts` with a comment. three.js on its own is about 800 kB minified; R3F imports the whole `THREE` namespace, so it can't be tree-shaken.

> ⚠️ **Don't add a `manualChunks` rule for three.js.** It was tried. Rollup then hoisted shared dependencies such as React into that chunk, and the entry ended up statically importing all ~980 kB of three.js on every page load. The automatic split is kept on purpose. There is a comment in `vite.config.ts` explaining this.

### Runtime

- The hero canvas switches to `frameloop="demand"` when scrolled out of view.
- The skill sphere's loop stops offscreen.
- drei `PerformanceMonitor` watches the frame rate. If it drops, it lowers device-pixel-ratio to 1 and halves the particle count.
- DPR is capped at 1.5 for the background and 2 for the hero.
- Mobile gets fewer shapes (12), fewer particles (500), and smaller, fainter shapes.
- The seeded layout and memoised geometry mean nothing is recomputed per render.

---

## Fallbacks & Accessibility

| Condition | Behaviour |
|---|---|
| **Recruiter Mode** | No WebGL at all. Flat hero photo, skills as a scannable grid, TiltCards flat, reveals plain. The concise 2D site, as intended |
| **`prefers-reduced-motion` / Animation: Reduced** | WebGL scenes stay but render one static frame (`frameloop="demand"`, no scroll-linked camera). Tilt off, reveals plain, sphere not auto-spinning (still draggable) |
| **No WebGL support** | `use3DEnabled` returns false and you get the full 2D site |
| **WebGL fails at runtime** | `WebGLBoundary` catches it and falls back to 2D |
| **Touch devices** | Tilt is off; WebGL, reveals and the sphere (with swipe to spin) remain |

Accessibility details:

- Both canvases are `aria-hidden`. The medallion's container carries `role="img"` with an `aria-label` naming you and your title.
- The skill sphere is `aria-hidden` and paired with an `sr-only` list of the currently filtered skills.
- All text remains real DOM text: selectable, translatable, indexable, and read by screen readers.
- The background canvas is `pointer-events: none`, so it can never intercept a click.
- Filter tabs, buttons, links and the command palette keep their keyboard behaviour and focus rings.

---

## Bugs Found and Fixed During Development

These were caught by browser testing on this branch before handing it over:

1. **Horizontal scroll on phones.** Elements waiting to reveal start rotated, and perspective pushed their near edge past the screen (the page measured 404px wide on a 375px phone). Mobile browsers then widen the layout to fit, which also pushed the fixed header's ☰ button partly off-screen.
   **Fix:** `overflow-x: clip` on `<main>`. Unlike `hidden`, `clip` doesn't create a scroll container, so scroll anchoring and fixed UI keep working, and it doesn't flatten the 3D. Verified 0px overflow at 320, 375, 390, 425, 768, 1024 and 1440px, at every scroll position.
2. **three.js forced onto the critical path.** The `manualChunks` experiment described in [Performance](#performance). Reverted and documented.
3. **Depth layers misaligned at rest.** Fixed perspective made `.depth-*` layers visibly offset even when idle. Perspective is now animated (6000px at rest → 900px on hover).
4. **Mirrored text through glass cubes.** The far faces' labels showed through reversed. Fixed with `backface-visibility: hidden`.
5. **Job title blank ~30% of the time.** The old "fade out, then fade in" roll left a gap. Old and new faces now turn together on a shared axis.
6. **Clutter.** Wobbling "distort" blobs read as pastel stains over the text in light mode, and shapes crowded the medallion and headline. The blobs were removed, shapes pushed to the viewport edges, and the hero corner cleared.
7. **Hero content vanishing in Recruiter Mode** (commit `263fb90`). Turning Recruiter Mode on after load enables reduced motion, and the hero's entrance switched `animate` from `"show"` to `undefined`. Framer Motion responds to a removed target by animating back to the *initial* state, so all the left-hand hero text faded to `opacity: 0`. Reloading with it already on was unaffected, which made it look intermittent.
   **Fix:** keep `animate="show"` fixed and use `initial={false}` to skip the entrance.
   > ⚠️ **Rule of thumb for this codebase:** don't toggle `animate` / `whileInView` between a value and `undefined` based on runtime state. Keep the target fixed and skip or zero the transition instead.

---

## Testing Performed

Headless Chromium with WebGL (SwiftShader), plus DOM and computed-style assertions:

- ✅ Typecheck (`tsc -b`), ESLint, and production build all clean.
- ✅ Both canvases render; no console errors. The only network error is Google Fonts through the sandbox proxy, which is environment-only.
- ✅ Desktop screenshots of every section in light and dark mode.
- ✅ Live theme switch to Sunset recolours the whole 3D world.
- ✅ Hover tilt engages (a `matrix3d` transform is applied) and the depth layers separate.
- ✅ **Recruiter Mode:** 0 canvases, flat hero photo present, 29-card skill grid shown.
- ✅ **Recruiter Mode toggled on after load, after scrolling the whole page:** 0 faded text nodes.
- ✅ **Reduced motion:** 2 canvases, and consecutive frames are pixel-identical (static).
- ✅ **WebGL disabled** (`--disable-webgl`): 0 canvases, flat photo present, no errors.
- ✅ **Mobile (390px, touch):** layout correct, the mobile menu still covers the full viewport, and the ☰ button is fully on-screen.
- ✅ **No horizontal overflow** at 320–1440px at every scroll position.
- ✅ **Bundle:** no preload of, and no static import of, the 3D chunks from the entry.

---

## File Reference

### New files

| File | Purpose |
|---|---|
| `src/components/three/Scene3D.tsx` | Page-wide WebGL world (camera rig, shapes, particles, lights, fog) |
| `src/components/three/HeroMedallion.tsx` | 3D photo medallion, orbits, sparkles |
| `src/components/three/webgl.ts` | WebGL probe, shared pointer tracker, scroll progress |
| `src/components/three/WebGLBoundary.tsx` | Error boundary → 2D fallback |
| `src/components/ui/TiltCard.tsx` | Pointer-tilt card with depth layers and glare |
| `src/components/ui/Reveal3D.tsx` | 3D hinge scroll-reveal |
| `src/components/skills/SkillSphere.tsx` | Draggable 3D skill sphere |
| `src/hooks/useThemeColors.ts` | CSS theme variables → WebGL colours |
| `src/hooks/use3DEnabled.ts` | WebGL-available and not Recruiter Mode |
| `src/hooks/useFinePointer.ts` | Mouse/trackpad vs. touch detection |
| `docs/3D-IMPLEMENTATION.md` | This document |

### Modified files

`src/App.tsx` · `src/components/hero/Hero.tsx` · `src/components/about/Stats.tsx` · `src/components/experience/ExperienceCard.tsx` · `src/components/experience/ExperienceTimeline.tsx` · `src/components/skills/SkillsGrid.tsx` · `src/components/projects/ProjectCard.tsx` · `src/components/projects/ProjectCover.tsx` · `src/components/projects/ProjectModal.tsx` · `src/components/achievements/Achievements.tsx` · `src/components/education/Education.tsx` · `src/components/contact/Contact.tsx` · `src/components/ui/SectionHeading.tsx` · `src/components/ui/Modal.tsx` · `src/components/ui/Drawer.tsx` · `src/components/loading/LoadingScreen.tsx` · `src/index.css` · `tailwind.config.ts` · `vite.config.ts` · `package.json` · `package-lock.json` · `README.md`

---

## How-To: Extending the 3D System

### Make any card 3D

```tsx
import { Reveal3D } from '@/components/ui/Reveal3D';
import { TiltCard } from '@/components/ui/TiltCard';

<Reveal3D from="left" delay={0.1}>
  <TiltCard maxTilt={10} className="rounded-xl border border-border bg-card p-6 shadow-card">
    <span className="depth-3">Icon — floats furthest forward</span>
    <h3 className="depth-2">Title</h3>
    <p className="depth-1">Body copy</p>
  </TiltCard>
</Reveal3D>
```

Rules:

- Keep `Reveal3D` (entrance) and `TiltCard` (interaction) as **separate elements**. They both drive `transform`.
- No `overflow-hidden` between `TiltCard` and `.depth-*` children. If a child must clip (a rounded image, for example), clip on that child.
- If a `.depth-*` element sits inside an intermediate wrapper (such as an `<a>`), give the wrapper `.preserve-3d`.
- Don't use Tailwind `hover:-translate-y-*` on a TiltCard. Framer's inline transform overrides it; use the `lift` prop instead.

### Add a shape to the background

Change the count in `buildShapes()` or add a new `ShapeKind` in `Scene3D.tsx`. Positions come from `seeded()`, so the layout stays deterministic.

### Change how far the camera travels

Adjust `TRAVEL` in `Scene3D.tsx`. Shapes and particles are distributed along it automatically.

### Swap the profile photo

Replace `src/assets/images/profile.webp` and `profile.jpg`. If the new photo isn't 900×1352, update `PHOTO_ASPECT` in `HeroMedallion.tsx` (width ÷ height) so the crop stays centred on the face.

---

## Running, Previewing & Merging

```bash
git fetch origin
git checkout claude/portfolio-3d
npm install          # pulls three / @react-three/fiber / @react-three/drei
npm run dev          # http://localhost:5173
npm run build        # typecheck + production build
```

- **Preview on Vercel:** Vercel normally builds a preview deployment for every pushed branch. Look under *Deployments* in the Vercel project for `claude/portfolio-3d`.
- **Try every mode:** toggle Recruiter Mode, switch presets and light/dark in the ⚙ customizer, set *Animation → Reduced*, and check on a real phone.
- **Go live:** merge `claude/portfolio-3d` into the branch Vercel deploys to production. The 2D site stays intact on `claude/premium-dev-portfolio-i0jzge` if you ever need to roll back.

---

## Known Limitations

- **Motion level is a judgment call.** This is considerably more animated than the 2D site. For a recruiter-facing portfolio, review it on a real phone. Recruiter Mode and *Animation → Reduced* are one tap away for visitors who prefer it calmer.
- **Download size:** the 3D chunk (~222 kB gzipped) is lazy and non-blocking, but on slow connections the 3D hero appears a moment after the flat one.
- **Very low-end GPUs** get reduced resolution and particle count through `PerformanceMonitor`, but a static fallback isn't forced unless WebGL is unavailable or fails.
- **Headless screenshots** used SwiftShader (software WebGL). Real-GPU rendering will be smoother but should look the same.
