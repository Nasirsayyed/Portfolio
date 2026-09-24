let cachedSupport: boolean | null = null;

/** CPU rasterisers Chrome/Firefox fall back to on blocklisted or GPU-less machines. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;
/** Set to '1' to run the field even on a software renderer (testing in headless browsers). */
export const FORCE_WEBGL_KEY = 'signal:force-webgl';

function forced(): boolean {
  try {
    return localStorage.getItem(FORCE_WEBGL_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * True when a hardware-accelerated WebGL context is available. A software
 * renderer can draw the field, but at hundreds of milliseconds per frame on
 * the main thread, so those visitors get the static backdrop instead.
 */
export function isWebGLAvailable(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) {
      cachedSupport = false;
    } else {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      cachedSupport = forced() || !SOFTWARE_RENDERER.test(renderer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

/** Normalized (-1..1) window-level pointer, read inside render loops. */
export const pointer = { x: 0, y: 0 };

let tracking = false;

export function ensurePointerTracking(): void {
  if (tracking || typeof window === 'undefined') return;
  tracking = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}
