import { useEffect, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_';
const KEEP = /[\s·.]/;

function scrambled(text: string): string {
  return text.replace(/[^\s·.]/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!);
}

interface ScrambleOptions {
  /** Begin resolving once true. */
  start: boolean;
  /** When false the final text is returned as-is (reduced motion). */
  enabled: boolean;
  delay?: number;
  duration?: number;
}

/**
 * Decodes a line from random glyphs into its final text, left to right.
 * Meant for monospace text so the width never changes while it resolves.
 */
export function useScramble(text: string, { start, enabled, delay = 0, duration = 1100 }: ScrambleOptions): string {
  const [output, setOutput] = useState(() => (enabled ? scrambled(text) : text));

  useEffect(() => {
    if (!enabled) {
      setOutput(text);
      return;
    }
    if (!start) return;
    let raf = 0;
    let last = 0;
    const begin = performance.now() + delay;
    // Each character settles at its own moment, loosely left to right.
    const settleAt = Array.from(text, (_, i) => (i / text.length) * duration * 0.75 + Math.random() * duration * 0.25);

    const tick = (now: number) => {
      const t = now - begin;
      if (t >= duration) {
        setOutput(text);
        return;
      }
      if (now - last > 40) {
        last = now;
        setOutput(
          Array.from(text, (ch, i) =>
            KEEP.test(ch) || t >= settleAt[i]! ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!,
          ).join(''),
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, start, enabled, delay, duration]);

  return output;
}
