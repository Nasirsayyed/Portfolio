const KEY = 'v3-booted';

/**
 * Whether this page load gets the preloader + hero intro. Skipped when motion
 * is reduced (which includes Recruiter Mode) and on repeat visits within the
 * session — index.html marks those with `data-booted` before first paint.
 */
export function wantsIntro(reduceMotion: boolean): boolean {
  return !reduceMotion && !document.documentElement.hasAttribute('data-booted');
}

export function markBooted(): void {
  document.documentElement.setAttribute('data-booted', '');
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Storage blocked: the intro simply plays again next load.
  }
}
