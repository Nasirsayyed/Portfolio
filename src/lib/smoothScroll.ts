import type Lenis from 'lenis';

/** Holds the active Lenis instance (null when smooth scrolling is disabled). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
