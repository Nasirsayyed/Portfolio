import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Film grain + vignette over everything (pointer-events: none). Grain holds still under reduced motion. */
export function Atmosphere() {
  const reduceMotion = useReducedMotion();
  return (
    <div aria-hidden="true">
      <div className={`grain ${reduceMotion ? '' : 'animate-grain'}`} />
      <div className="vignette" />
    </div>
  );
}

/** Stand-in for the particle field when WebGL is off or unavailable. */
export function FallbackBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(60% 50% at 75% 30%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%), radial-gradient(40% 40% at 10% 90%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)',
      }}
    />
  );
}
