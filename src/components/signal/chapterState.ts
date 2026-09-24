/**
 * Maps scroll position to what the Signal field should look like. Each
 * chapter declares a keyframe; the field holds a chapter's shape for most of
 * its length and morphs to the next chapter's over the final stretch.
 *
 * Reads chapter geometry straight from the DOM ([data-chapter]) and
 * window.scrollY — the same scroll value Lenis writes and ScrollTrigger reads —
 * so pinned sections, which change chapter heights, are handled for free.
 */

export interface SignalKeyframe {
  /** 0 Core · 1 Architecture · 2 Timeline · 3 Grid · 4 Pulse (fractional = mid-morph). */
  stage: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  /** Overall opacity, so content-heavy chapters can push the field back. */
  dim: number;
}

type KeyframeFn = (wide: boolean) => SignalKeyframe;

const keyframes: Record<string, KeyframeFn> = {
  boot: (wide) => ({ stage: 0, offsetX: wide ? 3.4 : 0, offsetY: wide ? 0.5 : 1.2, scale: wide ? 1 : 0.85, dim: 1 }),
  about: (wide) => ({ stage: 0, offsetX: wide ? 5.2 : 1.8, offsetY: wide ? -0.6 : 2.6, scale: 0.7, dim: 0.45 }),
  stack: () => ({ stage: 1, offsetX: 0, offsetY: 0, scale: 1, dim: 0.95 }),
  experience: () => ({ stage: 2, offsetX: 0, offsetY: -1.2, scale: 1, dim: 0.6 }),
  work: () => ({ stage: 3, offsetX: 0, offsetY: 0, scale: 1, dim: 0.32 }),
  proof: () => ({ stage: 3, offsetX: 0, offsetY: 0, scale: 1.05, dim: 0.22 }),
  connect: (wide) => ({ stage: 4, offsetX: wide ? 3.2 : 0, offsetY: wide ? 0 : -1.4, scale: 1, dim: 1 }),
};

export interface SignalTarget extends SignalKeyframe {
  /** 0–1 progress through the Experience chapter (slides the helix). */
  travel: number;
}

const MORPH_START = 0.62;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

let cachedChapters: HTMLElement[] = [];
let cacheFrame = 0;

export function sampleSignalTarget(frame: number): SignalTarget {
  // Chapter elements rarely change; re-query about once a second.
  if (frame - cacheFrame > 60 || cachedChapters.length === 0) {
    cachedChapters = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
    cacheFrame = frame;
  }
  const wide = window.innerWidth >= 1024;
  const probe = window.innerHeight * 0.55;
  const fallback = { ...keyframes.boot!(wide), travel: 0 };
  if (cachedChapters.length === 0) return fallback;

  let index = 0;
  let local = 0;
  let travel = 0;
  for (let i = 0; i < cachedChapters.length; i++) {
    const rect = cachedChapters[i]!.getBoundingClientRect();
    if (rect.top <= probe) {
      index = i;
      local = rect.height > 0 ? Math.min(1, Math.max(0, (probe - rect.top) / rect.height)) : 0;
    }
    if (cachedChapters[i]!.dataset.chapter === 'experience') {
      travel = rect.height > 0 ? Math.min(1, Math.max(0, (probe - rect.top) / rect.height)) : 0;
    }
  }

  const current = keyframes[cachedChapters[index]!.dataset.chapter ?? 'boot'] ?? keyframes.boot!;
  const nextEl = cachedChapters[index + 1];
  const next = nextEl ? (keyframes[nextEl.dataset.chapter ?? ''] ?? current) : current;
  const a = current(wide);
  const b = next(wide);
  const t = smooth(Math.min(1, Math.max(0, (local - MORPH_START) / (1 - MORPH_START))));

  return {
    stage: lerp(a.stage, b.stage, t),
    offsetX: lerp(a.offsetX, b.offsetX, t),
    offsetY: lerp(a.offsetY, b.offsetY, t),
    scale: lerp(a.scale, b.scale, t),
    dim: lerp(a.dim, b.dim, t),
    travel,
  };
}
