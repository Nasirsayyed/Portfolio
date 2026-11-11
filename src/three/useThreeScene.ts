import { useEffect, useState, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import type { SceneColors, SceneFactory, SceneInput } from '@/three/types';

export type SceneStatus = 'idle' | 'ready' | 'failed';

function readColors(): SceneColors {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    primary: v('--primary', '#2563eb'),
    start: v('--gradient-start', '#2563eb'),
    end: v('--gradient-end', '#22d3ee'),
    foreground: v('--foreground', '#0f172a'),
    background: v('--background', '#f7fafc'),
    dark: root.classList.contains('dark'),
  };
}

/**
 * Lazily loads a three.js scene module (so three.js lives in its own chunk,
 * off the critical path), mounts it on `canvasRef`, and wires up:
 * sizing, GSAP-ticker rendering (paused while off-screen), pointer tracking,
 * live theme colours, and full GPU-resource disposal on unmount.
 *
 * Returns 'ready' once the scene is running, or 'failed' if WebGL is unavailable.
 */
export function useThreeScene<T extends SceneInput>(
  canvasRef: RefObject<HTMLCanvasElement>,
  load: () => Promise<{ createScene: SceneFactory<T> }>,
  input: T,
  enabled: boolean,
): SceneStatus {
  const [status, setStatus] = useState<SceneStatus>('idle');

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];

    load()
      .then(({ createScene }) => {
        if (disposed) return;

        let scene: ReturnType<SceneFactory<T>>;
        try {
          scene = createScene(canvas, input, readColors());
        } catch (error) {
          console.warn('[three] WebGL unavailable, skipping 3D scene.', error);
          setStatus('failed');
          return;
        }
        cleanups.push(() => scene.dispose());

        const host = canvas.parentElement ?? canvas;
        const resize = () => {
          const rect = host.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          scene.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 1.75));
        };
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        cleanups.push(() => resizeObserver.disconnect());

        let visible = true;
        const intersection = new IntersectionObserver(([entry]) => {
          visible = entry?.isIntersecting ?? true;
        }, { rootMargin: '120px' });
        intersection.observe(canvas);
        cleanups.push(() => intersection.disconnect());

        const tick = (time: number, deltaMs: number) => {
          if (visible) scene.render(time, Math.min(deltaMs, 64) / 1000);
        };
        gsap.ticker.add(tick);
        cleanups.push(() => gsap.ticker.remove(tick));

        const toNdc = (e: PointerEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
          return { x, y, inside: Math.abs(x) <= 1 && Math.abs(y) <= 1 };
        };
        const onMove = (e: PointerEvent) => {
          const p = toNdc(e);
          input.pointer.x = p.x;
          input.pointer.y = p.y;
          input.pointerInside = p.inside;
        };
        const onDown = (e: PointerEvent) => {
          const p = toNdc(e);
          if (p.inside) scene.pointerDown?.(p.x, p.y);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerdown', onDown, { passive: true });
        cleanups.push(() => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerdown', onDown);
        });

        // Theme customizer / dark mode write to <html>: re-read colours.
        const themeObserver = new MutationObserver(() => scene.setColors(readColors()));
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
        cleanups.push(() => themeObserver.disconnect());

        setStatus('ready');
      })
      .catch((error) => {
        console.warn('[three] failed to load scene', error);
        if (!disposed) setStatus('failed');
      });

    return () => {
      disposed = true;
      cleanups.reverse().forEach((fn) => fn());
      setStatus('idle');
    };
  }, [enabled, canvasRef, load, input]);

  return status;
}
