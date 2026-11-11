import { useEffect, useState } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

/** True on devices with a precise, hover-capable pointer (mouse / trackpad). */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const listener = () => setFine(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return fine;
}
