import { useEffect, useState } from 'react';

export interface ThemeColors {
  primary: string;
  accent: string;
  gradientStart: string;
  gradientEnd: string;
  foreground: string;
  background: string;
  isDark: boolean;
}

function readColors(): ThemeColors {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    primary: read('--primary', '#2563eb'),
    accent: read('--accent', '#0891b2'),
    gradientStart: read('--gradient-start', '#2563eb'),
    gradientEnd: read('--gradient-end', '#22d3ee'),
    foreground: read('--foreground', '#0f172a'),
    background: read('--background', '#f7fafc'),
    isDark: root.classList.contains('dark'),
  };
}

function sameColors(a: ThemeColors, b: ThemeColors): boolean {
  return (Object.keys(a) as (keyof ThemeColors)[]).every((key) => a[key] === b[key]);
}

/**
 * Bridges the CSS-variable theme into WebGL materials. Observes the <html>
 * attributes the theme engine writes rather than the store, because the
 * store changes before applyThemeToDocument has written the new variables.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const sync = () => setColors((prev) => {
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
