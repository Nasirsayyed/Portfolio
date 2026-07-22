import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';

/** True when the user's theme setting, Recruiter Mode, or OS preference asks for reduced motion. */
export function useReducedMotion(): boolean {
  const motionSetting = useThemeStore((s) => s.motion);
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const [systemReduced, setSystemReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => setSystemReduced(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return motionSetting === 'reduced' || recruiterMode || systemReduced;
}
