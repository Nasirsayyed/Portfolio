import * as THREE from 'three';
import { createRenderer, disposeObject, disposeRenderer } from '@/three/renderer';
import { simplexNoise3D } from '@/three/glsl';
import type { SceneColors, SceneFactory } from '@/three/types';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistort;
  uniform float uPulse;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  ${simplexNoise3D}

  void main() {
    float n = snoise(normal * 1.6 + vec3(uTime * 0.35));
    float n2 = snoise(normal * 3.2 - vec3(uTime * 0.2)) * 0.5;
    float displacement = (n + n2) * uDistort + uPulse * 0.25 * sin(uTime * 10.0 + n * 6.0);
    vec3 p = position + normal * displacement;

    vNoise = n;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), vViewDir), 0.0), 2.2);
    vec3 color = mix(uColorA, uColorB, smoothstep(-0.6, 0.6, vNoise));
    color += fresnel * 0.35;
    float alpha = (0.35 + fresnel * 0.65) * uOpacity;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

/**
 * A liquid, noise-displaced orb that glows around the portrait. It leans
 * toward the pointer, churns harder while hovered, and pulses on click.
 */
export const createScene: SceneFactory = (canvas, input, colors) => {
  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const uniforms = {
    uTime: { value: 0 },
    uDistort: { value: 0.18 },
    uPulse: { value: 0 },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
    uOpacity: { value: 1 },
  };

  const orbMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 48), orbMaterial);

  const wireMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.1 });
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 2), wireMaterial);

  const group = new THREE.Group();
  group.add(orb, wire);
  scene.add(group);

  const applyColors = (c: SceneColors) => {
    uniforms.uColorA.value.set(c.start);
    uniforms.uColorB.value.set(c.end);
    wireMaterial.color.set(c.primary);
  };
  applyColors(colors);
  let colorsDark = colors.dark;

  let hover = 0;
  let pulse = 0;

  return {
    resize(width, height, pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },

    render(time, delta) {
      const ease = Math.min(1, delta * 3);
      hover += ((input.pointerInside ? 1 : 0) - hover) * ease;
      pulse = Math.max(0, pulse - delta * 1.2);

      uniforms.uTime.value = time;
      uniforms.uDistort.value = 0.16 + hover * 0.14 + pulse * 0.2;
      uniforms.uPulse.value = pulse;

      const intro = input.intro;
      group.scale.setScalar(0.4 + intro * 0.6 + pulse * 0.08);
      uniforms.uOpacity.value = (colorsDark ? 0.95 : 0.8) * intro;
      wireMaterial.opacity = (colorsDark ? 0.14 : 0.1) * intro;

      // Lean toward the pointer (global, so it reacts from across the hero).
      const tx = THREE.MathUtils.clamp(input.pointer.y, -1.5, 1.5) * 0.35;
      const ty = THREE.MathUtils.clamp(input.pointer.x, -1.5, 1.5) * 0.45;
      group.rotation.x += (tx - group.rotation.x) * ease;
      group.rotation.y += (ty + time * 0.15 - group.rotation.y) * ease;
      wire.rotation.z = time * 0.08;

      renderer.render(scene, camera);
    },

    setColors(c) {
      colorsDark = c.dark;
      applyColors(c);
    },

    pointerDown() {
      pulse = 1;
    },

    dispose() {
      disposeObject(scene);
      disposeRenderer(renderer);
    },
  };
};
