import { useEffect } from 'react';
import { getLenis } from '@/motion/lenis';

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Lenis scrolls programmatically, which overflow:hidden doesn't stop.
    const lenis = getLenis();
    lenis?.stop();
    return () => {
      document.body.style.overflow = original;
      lenis?.start();
    };
  }, [locked]);
}
