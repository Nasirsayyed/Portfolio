import { useEffect, useState } from 'react';

export interface ThemeColors {
  accent: string;
  foreground: string;
  muted: string;
  background: string;
  surface: string;
  isDark: boolean;
}

function readColors(): ThemeColors {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    accent: read('--accent', '#c6ff3d'),
    foreground: read('--foreground', '#ededed'),
    muted: read('--muted-foreground', '#8a8a8f'),
    background: read('--background', '#0a0a0b'),
    surface: read('--card', '#111113'),
    isDark: root.classList.contains('dark'),
  };
}

function sameColors(a: ThemeColors, b: ThemeColors): boolean {
  return (Object.keys(a) as (keyof ThemeColors)[]).every((key) => a[key] === b[key]);
}

/**
 * Bridges the CSS-variable theme into WebGL uniforms. Observes the <html>
 * attributes the theme engine writes rather than the store, because the
 * store changes before applyThemeToDocument has written the new variables
 * (child effects run before the parent's), so a store subscription would
 * read stale colours.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const sync = () =>
      setColors((prev) => {
        const next = readColors();
        return sameColors(prev, next) ? prev : next;
      });
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class', 'data-preset', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
