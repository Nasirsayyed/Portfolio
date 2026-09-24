import { useEffect, useState } from 'react';

/** True on devices with a hover-capable, precise pointer (mouse/trackpad), false on touch. */
export function useFinePointer(): boolean {
  const query = '(hover: hover) and (pointer: fine)';
  const [fine, setFine] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const listener = () => setFine(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return fine;
}
