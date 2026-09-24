import { LAYER_TILT, LAYER_Y } from '@/components/signal/shapes';

// Ashima Arts / Stefan Gustavson 3D simplex noise (MIT).
const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const f = (n: number) => n.toFixed(4);

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uStage;
uniform float uSize;
uniform float uPixelRatio;
uniform float uDim;
uniform float uTravel;
uniform float uFocus;
uniform float uScale;
uniform float uPointerStrength;
uniform vec2 uOffset;
uniform vec2 uPointer;

attribute vec3 aPos1;
attribute vec3 aPos2;
attribute vec3 aPos3;
attribute vec3 aPos4;
attribute float aRandom;
attribute float aTone;
attribute float aLayer;

varying float vAlpha;
varying float vAccent;

${simplex}

const float TILT = ${f(LAYER_TILT)};
const float LAYER_TOP = ${f(LAYER_Y[0])};
const float LAYER_BOTTOM = ${f(LAYER_Y[2])};

// Eased weight for the k-th morph segment.
float seg(float s, float k) { return smoothstep(0.0, 1.0, clamp(s - k, 0.0, 1.0)); }

void main() {
  // Stagger particles only mid-morph, so every settled shape stays crisp.
  float mid = sin(3.14159265 * fract(uStage));
  float s = clamp(uStage + (aRandom - 0.5) * 0.55 * mid, 0.0, 4.0);
  float w1 = seg(s, 0.0);
  float w2 = seg(s, 1.0);
  float w3 = seg(s, 2.0);
  float w4 = seg(s, 3.0);

  vec3 p = position;
  p = mix(p, aPos1, w1);
  p = mix(p, aPos2, w2);
  p = mix(p, aPos3, w3);
  p = mix(p, aPos4, w4);

  float inCore = 1.0 - w1;
  float inArch = w1 * (1.0 - w2);
  float inTime = w2 * (1.0 - w3);
  float inGrid = w3 * (1.0 - w4);
  float inPulse = w4;

  // Core: slow curl-ish surface noise, breathing, and a bulge toward the cursor.
  if (inCore > 0.001) {
    vec3 n = normalize(position + 1e-4);
    float noise = snoise(position * 0.55 + vec3(uTime * 0.12));
    vec3 core = position * (1.0 + sin(uTime * 0.7) * 0.035) + n * noise * 0.32;
    vec3 toward = normalize(vec3(uPointer - uOffset, 2.2));
    float align = max(dot(n, toward), 0.0);
    core += n * pow(align, 6.0) * 0.6 * uPointerStrength;
    p = mix(p, core, inCore);
  }

  // Architecture: stream particles travel between layers like requests (up) and responses (down).
  if (inArch > 0.001 && aLayer > 2.5) {
    float c = cos(TILT);
    float sn = sin(TILT);
    vec3 flat_ = vec3(aPos1.x, aPos1.y * c + aPos1.z * sn, -aPos1.y * sn + aPos1.z * c);
    float flow = fract(uTime * (0.14 + aRandom * 0.08) + aRandom * 7.0);
    flat_.y = aRandom > 0.5 ? mix(LAYER_BOTTOM, LAYER_TOP, flow) : mix(LAYER_TOP, LAYER_BOTTOM, flow);
    vec3 stream = vec3(flat_.x, flat_.y * c - flat_.z * sn, flat_.y * sn + flat_.z * c);
    p = mix(p, stream, inArch);
  }

  // Timeline: the helix spins slowly and slides past as Experience scrolls.
  if (inTime > 0.001) {
    float a = uTime * 0.25;
    float y = p.y + 0.4;
    vec2 yz = vec2(y * cos(a) - p.z * sin(a), y * sin(a) + p.z * cos(a));
    vec3 helix = vec3(p.x + 6.0 - uTravel * 12.0, yz.x - 0.4, yz.y);
    p = mix(p, helix, inTime);
  }

  // Grid: a gentle standing wave.
  if (inGrid > 0.001) {
    p.z += sin(p.x * 0.55 + uTime * 0.5) * cos(p.y * 0.5 + uTime * 0.4) * 0.3 * inGrid;
  }

  // Pulse: ring emitters expand outward in three staggered waves and fade.
  float ringFade = 1.0;
  if (inPulse > 0.001 && aRandom < 0.25) {
    float phase = fract(uTime * 0.16 + floor(aRandom * 12.0) / 3.0);
    vec3 ring = vec3(aPos4.xy * (1.25 + phase * 5.5), aPos4.z);
    p = mix(p, ring, inPulse);
    ringFade = mix(1.0, 1.0 - phase, inPulse);
  }

  p *= uScale;
  p.xy += uOffset;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.55 + aRandom * 0.9) * (1.0 + aTone * 0.7);
  gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

  // Accent: the sparse tone particles always; in Stack, also the focused layer.
  float focused = (uFocus >= 0.0 && abs(aLayer - uFocus) < 0.5) ? 1.0 : 0.0;
  vAccent = max(aTone, focused * inArch);
  float unfocused = (uFocus >= 0.0 && aLayer < 2.5 && focused < 0.5) ? mix(1.0, 0.3, inArch) : 1.0;
  float depthFade = clamp(1.0 - (-mv.z - 9.0) / 18.0, 0.25, 1.0);
  vAlpha = uDim * unfocused * ringFade * depthFade;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uAccent;
uniform vec3 uMuted;

varying float vAlpha;
varying float vAccent;

void main() {
  // Soft round sprite, computed — no texture.
  float d = length(gl_PointCoord - 0.5);
  float soft = smoothstep(0.5, 0.05, d);
  if (soft < 0.01) discard;
  vec3 color = mix(uMuted, uAccent, vAccent);
  gl_FragColor = vec4(color, soft * vAlpha * mix(0.6, 1.0, vAccent));
  #include <colorspace_fragment>
}
`;
