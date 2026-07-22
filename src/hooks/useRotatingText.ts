import { useEffect, useState } from 'react';

export function useRotatingText(items: string[], intervalMs = 2600, paused = false): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, intervalMs, paused]);

  return items[index] ?? items[0] ?? '';
}
