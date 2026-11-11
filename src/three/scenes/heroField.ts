import * as THREE from 'three';
import { createRenderer, disposeObject, disposeRenderer } from '@/three/renderer';
import type { SceneColors, SceneFactory } from '@/three/types';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uRippleOrigin;
  uniform float uRippleAge;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uHalfWidth;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  attribute float aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;

    float wave = sin(p.x * 0.32 + uTime * 0.8) * 0.55
               + cos(p.z * 0.42 + uTime * 0.6) * 0.45
               + sin((p.x + p.z) * 0.18 + uTime * 0.35) * 0.4;
    wave *= 0.7 + uScroll * 1.6;

    // Soft hill that follows the pointer across the field.
    float md = distance(p.xz, uMouse.xz);
    float hill = exp(-md * md * 0.07) * uMouseStrength * 2.4;

    // Click shockwave: an expanding, decaying ring.
    float rd = distance(p.xz, uRippleOrigin.xz);
    float ring = exp(-pow(rd - uRippleAge * 11.0, 2.0) * 0.5) * max(0.0, 1.0 - uRippleAge * 0.55) * 1.8;

    // Intro: the field unrolls from the camera outward.
    float reveal = smoothstep(0.0, 1.0, uIntro * 1.6 - (-p.z / 40.0));
    p.y = (wave + hill + ring) * reveal - (1.0 - reveal) * 3.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float energy = hill * 0.5 + ring * 0.6;
    gl_PointSize = uSize * uPixelRatio * (0.75 + aRandom * 0.5 + energy) * (12.0 / -mv.z);

    float t = clamp(p.x / (uHalfWidth * 2.0) + 0.5, 0.0, 1.0);
    vColor = mix(uColorA, uColorB, t) + vec3(energy * 0.35);
    vAlpha = smoothstep(55.0, 12.0, -mv.z) * reveal * (0.45 + 0.55 * aRandom);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(vColor, alpha);
    #include <colorspace_fragment>
  }
`;

/**
 * An undulating field of glowing particles behind the hero. The pointer
 * raises a hill under itself, clicks send out a shockwave, and scroll
 * progress (fed by a GSAP ScrollTrigger) swings the camera down into it.
 */
export const createScene: SceneFactory = (canvas, input, colors) => {
  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

  const compact = window.innerWidth < 768;
  const cols = compact ? 80 : 150;
  const rows = compact ? 46 : 70;
  const spacing = compact ? 0.55 : 0.42;
  const halfWidth = (cols * spacing) / 2;

  const positions = new Float32Array(cols * rows * 3);
  const randoms = new Float32Array(cols * rows);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions[i * 3] = c * spacing - halfWidth;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -r * spacing + 6;
      randoms[i] = Math.random();
      i++;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

  const uniforms = {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, -200) },
    uMouseStrength: { value: 0 },
    uRippleOrigin: { value: new THREE.Vector3() },
    uRippleAge: { value: 10 },
    uSize: { value: 2.2 },
    uPixelRatio: { value: 1 },
    uHalfWidth: { value: halfWidth },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
    uOpacity: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const applyColors = (c: SceneColors) => {
    uniforms.uColorA.value.set(c.start);
    uniforms.uColorB.value.set(c.end);
    // Additive glow reads beautifully on dark; on light it washes out.
    material.blending = c.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    uniforms.uOpacity.value = c.dark ? 0.9 : 0.85;
    uniforms.uSize.value = c.dark ? 2.2 : 2.7;
    material.needsUpdate = true;
  };
  applyColors(colors);

  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  const projectPointer = (x: number, y: number, out: THREE.Vector3) => {
    ndc.set(x, y);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(ground, out);
  };

  let mouseStrength = 0;

  return {
    resize(width, height, pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      uniforms.uPixelRatio.value = pixelRatio;
    },

    render(time, delta) {
      uniforms.uTime.value = time;
      uniforms.uIntro.value = input.intro;
      uniforms.uScroll.value += (input.scroll - uniforms.uScroll.value) * Math.min(1, delta * 6);
      uniforms.uRippleAge.value += delta;

      // Camera: gentle pointer parallax + a scroll-driven dive toward the field.
      const s = uniforms.uScroll.value;
      const px = input.pointerInside ? input.pointer.x : 0;
      const py = input.pointerInside ? input.pointer.y : 0;
      camera.position.x += (px * 1.6 - camera.position.x) * Math.min(1, delta * 2);
      camera.position.y += (5.2 - s * 2.8 + py * 0.6 - camera.position.y) * Math.min(1, delta * 2);
      camera.position.z = 14 - s * 4;
      lookTarget.set(camera.position.x * 0.3, -1.5 - s * 1.5, -6);
      camera.lookAt(lookTarget);

      const target = input.pointerInside && projectPointer(input.pointer.x, input.pointer.y, hit) ? 1 : 0;
      if (target) uniforms.uMouse.value.lerp(hit, Math.min(1, delta * 8));
      mouseStrength += (target - mouseStrength) * Math.min(1, delta * 3);
      uniforms.uMouseStrength.value = mouseStrength;

      renderer.render(scene, camera);
    },

    setColors: applyColors,

    pointerDown(x, y) {
      if (projectPointer(x, y, hit)) {
        uniforms.uRippleOrigin.value.copy(hit);
        uniforms.uRippleAge.value = 0;
      }
    },

    dispose() {
      disposeObject(scene);
      disposeRenderer(renderer);
    },
  };
};
