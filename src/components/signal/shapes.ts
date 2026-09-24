/**
 * Morph targets for the Signal field, generated once per particle count.
 * Each target is a Float32Array of xyz positions in the same particle order,
 * so the vertex shader can blend between them index-for-index.
 *
 *   0 Core         dense breathing sphere            (Boot, About)
 *   1 Architecture three layers + request streams    (Stack)
 *   2 Timeline     a long helix the view slides along (Experience)
 *   3 Grid         a loose field that recedes        (Work, Proof)
 *   4 Pulse        a small core emitting rings       (Connect)
 */

export const STAGE_COUNT = 5;

/** World-space heights of the Client / API / Data layers (see Stack chapter alignment). */
export const LAYER_Y = [2.1, 0, -2.1] as const;
/** Tilt of the architecture layers toward the camera so they read as planes, not lines. */
export const LAYER_TILT = 0.42;

export interface SignalGeometry {
  count: number;
  targets: Float32Array[];
  /** Per-particle random in [0, 1): staggers morphs, drives streams and rings. */
  random: Float32Array;
  /** 1 for the sparse accent particles, else 0. */
  tone: Float32Array;
  /** Architecture role: 0/1/2 = layer index, 3 = request stream between layers. */
  layer: Float32Array;
}

/** Small deterministic PRNG so the field is identical on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomOnSphere(rand: () => number): [number, number, number] {
  const u = rand() * 2 - 1;
  const theta = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(theta), u, r * Math.sin(theta)];
}

export function buildSignalGeometry(count: number): SignalGeometry {
  const rand = mulberry32(20_26);
  const targets = Array.from({ length: STAGE_COUNT }, () => new Float32Array(count * 3));
  const random = new Float32Array(count);
  const tone = new Float32Array(count);
  const layer = new Float32Array(count);

  const cosT = Math.cos(LAYER_TILT);
  const sinT = Math.sin(LAYER_TILT);
  const gridCols = Math.ceil(Math.sqrt(count * 1.8));
  const gridRows = Math.ceil(count / gridCols);
  const helixTurns = 9;

  for (let i = 0; i < count; i++) {
    const o = i * 3;
    const r = rand();
    random[i] = r;
    tone[i] = rand() < 0.1 ? 1 : 0;

    // 0 — Core: most particles hug the surface, the rest fill the volume.
    {
      const [x, y, z] = randomOnSphere(rand);
      const radius = rand() < 0.72 ? 2.05 + (rand() - 0.5) * 0.28 : Math.cbrt(rand()) * 1.9;
      targets[0]![o] = x * radius;
      targets[0]![o + 1] = y * radius;
      targets[0]![o + 2] = z * radius;
    }

    // 1 — Architecture: three tilted planes, plus streams running between them.
    {
      const role = i % 4; // 0,1,2 planes; 3 = stream
      layer[i] = role;
      const px = (rand() - 0.5) * 11;
      const pz = (rand() - 0.5) * 4.2;
      const baseY = role < 3 ? LAYER_Y[role]! : LAYER_Y[2] + rand() * (LAYER_Y[0] - LAYER_Y[2]);
      const jitter = role < 3 ? (rand() - 0.5) * 0.06 : 0;
      // Streams collapse onto a handful of "service" columns so they read as requests.
      const sx = role < 3 ? px : (Math.floor(rand() * 7) - 3) * 1.55 + (rand() - 0.5) * 0.12;
      const sz = role < 3 ? pz : (rand() - 0.5) * 0.5;
      const y = baseY + jitter;
      // Tilt the whole assembly about X toward the camera.
      targets[1]![o] = sx;
      targets[1]![o + 1] = y * cosT - sz * sinT;
      targets[1]![o + 2] = y * sinT + sz * cosT;
    }

    // 2 — Timeline: a long helix along X; the shader slides it as Experience scrolls.
    {
      const t = i / count;
      const angle = t * Math.PI * 2 * helixTurns + (rand() - 0.5) * 0.35;
      const radius = 0.95 + (rand() - 0.5) * 0.3;
      targets[2]![o] = (t - 0.5) * 30;
      targets[2]![o + 1] = Math.cos(angle) * radius - 0.4;
      targets[2]![o + 2] = Math.sin(angle) * radius;
    }

    // 3 — Grid: loose lattice with depth jitter.
    {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      targets[3]![o] = (col / (gridCols - 1) - 0.5) * 17 + (rand() - 0.5) * 0.09;
      targets[3]![o + 1] = (row / Math.max(1, gridRows - 1) - 0.5) * 9.5 + (rand() - 0.5) * 0.09;
      targets[3]![o + 2] = (rand() - 0.5) * 1.6 - 1.5;
    }

    // 4 — Pulse: a compact core; a quarter become ring emitters (radius set in the shader).
    {
      if (r < 0.25) {
        const theta = rand() * Math.PI * 2;
        targets[4]![o] = Math.cos(theta);
        targets[4]![o + 1] = Math.sin(theta);
        targets[4]![o + 2] = (rand() - 0.5) * 0.08;
      } else {
        const [x, y, z] = randomOnSphere(rand);
        const radius = Math.cbrt(rand()) * 1.05;
        targets[4]![o] = x * radius;
        targets[4]![o + 1] = y * radius;
        targets[4]![o + 2] = z * radius;
      }
    }
  }

  return { count, targets, random, tone, layer };
}
