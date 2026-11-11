import { useRef } from 'react';
import { personalInfo } from '@/data/portfolio';
import { gsap, useGSAP } from '@/lib/gsap';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { PortraitOrb } from '@/components/three/PortraitOrb';
import profileJpg from '@/assets/images/profile.jpg';
import profileWebp from '@/assets/images/profile.webp';

const chips = [
  { label: 'C#', style: { top: '4%', right: '0%' }, depth: 40 },
  { label: 'React', style: { bottom: '10%', left: '-4%' }, depth: -30 },
  { label: '.NET', style: { bottom: '2%', right: '10%' }, depth: 24 },
];

export function ProfileImage() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;

      gsap.to('[data-profile-glow]', { scale: 1.1, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('[data-profile-float]', { y: -12, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('[data-ring-outer]', { rotate: 360, duration: 30, ease: 'none', repeat: -1 });
      gsap.to('[data-ring-inner]', { rotate: -360, duration: 38, ease: 'none', repeat: -1 });
      gsap.utils.toArray<HTMLElement>('[data-chip-float]').forEach((chip, i) => {
        gsap.to(chip, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2 + i * 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });
      });

      if (!finePointer) return;

      // Pointer parallax: portrait, rings and chips move at different depths.
      const root = rootRef.current!;
      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]').map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
        depth: Number(el.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const nx = (e.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
        const ny = (e.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
        layers.forEach((layer) => {
          layer.x(nx * layer.depth);
          layer.y(ny * layer.depth);
        });
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      return () => window.removeEventListener('pointermove', onMove);
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion, finePointer, recruiterMode] },
  );

  return (
    <div ref={rootRef} className="relative mx-auto aspect-square w-full max-w-[380px]">
      <div
        data-profile-glow
        className="absolute -inset-6 rounded-full bg-gradient-brand opacity-30 blur-3xl"
        aria-hidden="true"
      />

      {!reduceMotion && <PortraitOrb />}

      {!recruiterMode && (
        <div data-depth="-16" className="absolute inset-0" aria-hidden="true">
          <div data-ring-outer className="absolute inset-0 rounded-full border border-dashed border-border/60" />
          <div data-ring-inner className="absolute inset-4 rounded-full border border-primary/30">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
          </div>
        </div>
      )}

      <div data-depth="14" className="absolute inset-8">
        <div data-profile-float className="h-full w-full overflow-hidden rounded-full bg-gradient-brand p-[3px] shadow-glow">
          <div className="h-full w-full overflow-hidden rounded-full bg-card">
            <picture>
              <source srcSet={profileWebp} type="image/webp" />
              <img
                src={profileJpg}
                alt={`${personalInfo.name}, ${personalInfo.title}`}
                width={900}
                height={1352}
                className="h-full w-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>

      {!recruiterMode &&
        chips.map((chip) => (
          <span key={chip.label} data-depth={chip.depth} className="absolute" style={chip.style}>
            <span data-hero-chip className="block">
              <span
                data-chip-float
                className="glass block rounded-full border border-border px-3 py-1.5 text-xs font-semibold shadow-card"
              >
                {chip.label}
              </span>
            </span>
          </span>
        ))}
    </div>
  );
}
