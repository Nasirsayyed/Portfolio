import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { applyThemeToDocument } from '@/utils/applyTheme';

export function useApplyTheme(): void {
  const appearance = useThemeStore((s) => s.appearance);
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const motion = useThemeStore((s) => s.motion);
  const fontSize = useThemeStore((s) => s.fontSize);

  useEffect(() => {
    applyThemeToDocument({ appearance, preset, radius, motion, fontSize });
  }, [appearance, preset, radius, motion, fontSize]);

  useEffect(() => {
    if (appearance !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyThemeToDocument({ appearance, preset, radius, motion, fontSize });
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [appearance, preset, radius, motion, fontSize]);
}
