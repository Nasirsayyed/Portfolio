import { useEffect, useState } from 'react';

/**
 * Becomes true once web fonts have loaded and the browser has an idle
 * moment. Heavy, non-essential work (the WebGL field, smooth scrolling) waits
 * for it so it never competes with the first paint for bandwidth or CPU.
 */
export function useIdleReady(timeout = 1500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let handle = 0;
    const idle = () => {
      if (cancelled) return;
      if ('requestIdleCallback' in window) {
        handle = window.requestIdleCallback(() => !cancelled && setReady(true), { timeout });
      } else {
        // Safari has no requestIdleCallback.
        handle = setTimeout(() => !cancelled && setReady(true), 200) as unknown as number;
      }
    };
    void document.fonts.ready.then(idle, idle);
    return () => {
      cancelled = true;
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(handle);
      window.clearTimeout(handle);
    };
  }, [timeout]);

  return ready;
}
