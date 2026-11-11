import * as THREE from 'three';
import { createRenderer, disposeObject, disposeRenderer } from '@/three/renderer';
import type { SceneColors, SceneFactory, SceneInput } from '@/three/types';

export interface GlobeLabel {
  text: string;
  group: string;
}

export interface GlobeInput extends SceneInput {
  labels: GlobeLabel[];
  /** Group currently selected outside the globe (highlighted in brand colour). */
  activeGroup: string | null;
  onSelect: ((label: GlobeLabel) => void) | null;
}

const LABEL_HEIGHT_PX = 88;
const LABEL_FONT = '700 56px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';
const RADIUS = 3.1;

function drawLabel(canvas: HTMLCanvasElement, text: string): number {
  const ctx = canvas.getContext('2d')!;
  ctx.font = LABEL_FONT;
  const width = Math.ceil(ctx.measureText(text).width) + 32;
  canvas.width = width;
  canvas.height = LABEL_HEIGHT_PX;
  ctx.font = LABEL_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff'; // drawn white, tinted per-frame via material.color
  ctx.fillText(text, width / 2, LABEL_HEIGHT_PX / 2 + 2);
  return width / LABEL_HEIGHT_PX;
}

/**
 * A drag-to-spin sphere of skill labels. Labels face the camera, fade with
 * depth, light up on hover, and clicking one reports it via `onSelect`.
 */
export const createScene: SceneFactory<GlobeInput> = (canvas, input, colors) => {
  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0, 10);

  const group = new THREE.Group();
  scene.add(group);

  // Faint guide sphere + equator ring give the cloud a sense of volume.
  const shellMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.06 });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 0.92, 24, 16), shellMaterial));

  const count = input.labels.length;
  const sprites = input.labels.map((label, i) => {
    // Fibonacci sphere: an even spread of points over the surface.
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    const labelCanvas = document.createElement('canvas');
    const aspect = drawLabel(labelCanvas, label.text);
    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(Math.cos(theta) * r * RADIUS, y * RADIUS, Math.sin(theta) * r * RADIUS);
    sprite.userData = { label, aspect, canvas: labelCanvas, hover: 0 };
    sprite.scale.set(0.36 * aspect, 0.36, 1);
    group.add(sprite);
    return sprite;
  });

  // Redraw once the web font is ready so labels don't keep the fallback face.
  document.fonts?.ready.then(() => {
    sprites.forEach((sprite) => {
      sprite.userData.aspect = drawLabel(sprite.userData.canvas, sprite.userData.label.text);
      (sprite.material.map as THREE.Texture).needsUpdate = true;
    });
  });

  const base = new THREE.Color();
  const accent = new THREE.Color();
  const tint = new THREE.Color();
  const applyColors = (c: SceneColors) => {
    base.set(c.foreground);
    accent.set(c.primary);
    shellMaterial.color.set(c.primary);
  };
  applyColors(colors);

  // --- Drag-to-rotate with inertia ------------------------------------------
  const yAxis = new THREE.Vector3(0, 1, 0);
  const xAxis = new THREE.Vector3(1, 0, 0);
  const spin = new THREE.Quaternion();
  let velocityX = 0;
  let velocityY = 0;
  let dragging = false;
  let dragDistance = 0;
  let lastX = 0;
  let lastY = 0;
  let hovered: THREE.Sprite | null = null;

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    dragDistance = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.pointerType === 'touch' ? 0 : e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragDistance += Math.abs(dx) + Math.abs(dy);
    velocityY = dx * 0.006;
    velocityX = dy * 0.006;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = hovered ? 'pointer' : 'grab';
    if (dragDistance < 6 && hovered) input.onSelect?.(hovered.userData.label as GlobeLabel);
  };
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.style.cursor = 'grab';

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const worldPos = new THREE.Vector3();

  return {
    resize(width, height, pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Keep the whole globe in frame on narrow screens.
      camera.position.z = width < 420 ? 13.5 : 11.5;
      camera.updateProjectionMatrix();
    },

    render(time, delta) {
      const intro = input.intro;

      if (!dragging) {
        // Ease back to a slow idle spin.
        velocityY += (0.0025 - velocityY) * Math.min(1, delta * 1.5);
        velocityX += (0 - velocityX) * Math.min(1, delta * 1.5);
      }
      const introSpin = (1 - intro) * 0.12;
      spin.setFromAxisAngle(yAxis, velocityY + introSpin);
      group.quaternion.premultiply(spin);
      spin.setFromAxisAngle(xAxis, velocityX);
      group.quaternion.premultiply(spin);
      group.scale.setScalar(0.2 + intro * 0.8);
      shellMaterial.opacity = 0.06 * intro;

      // Hover picking — frozen while a press/drag is in progress so a click
      // still knows which label it started on.
      if (!dragging) {
        let nextHovered: THREE.Sprite | null = null;
        if (input.pointerInside) {
          ndc.set(input.pointer.x, input.pointer.y);
          raycaster.setFromCamera(ndc, camera);
          const hits = raycaster.intersectObjects(sprites, false);
          const front = hits.find((h) => h.object.getWorldPosition(worldPos).z > -0.5);
          nextHovered = (front?.object as THREE.Sprite) ?? null;
        }
        if (nextHovered !== hovered) {
          hovered = nextHovered;
          canvas.style.cursor = hovered ? 'pointer' : 'grab';
        }
      }

      const ease = Math.min(1, delta * 8);
      sprites.forEach((sprite) => {
        const data = sprite.userData as { label: GlobeLabel; aspect: number; hover: number };
        data.hover += ((sprite === hovered ? 1 : 0) - data.hover) * ease;
        sprite.getWorldPosition(worldPos);
        const depth = THREE.MathUtils.clamp((worldPos.z / RADIUS + 1) / 2, 0, 1); // 0 back → 1 front
        const active = input.activeGroup !== null && data.label.group === input.activeGroup;

        const size = (0.22 + depth * 0.12 + data.hover * 0.12) * (active ? 1.12 : 1);
        sprite.scale.set(size * data.aspect, size, 1);

        tint.copy(base).lerp(accent, Math.max(data.hover, active ? 1 : 0));
        sprite.material.color.copy(tint);
        const dim = input.activeGroup !== null && !active ? 0.45 : 1;
        sprite.material.opacity = (0.15 + depth * 0.85) * intro * dim;
      });

      renderer.render(scene, camera);
      void time;
    },

    setColors: applyColors,

    dispose() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      disposeObject(scene);
      disposeRenderer(renderer);
    },
  };
};
