import { useEffect } from 'react';
import { getLenis } from '@/lib/smoothScroll';

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = original;
      getLenis()?.start();
    };
  }, [locked]);
}
