import { useRef } from 'react';
import { Badge } from '@/components/ui/Badge';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const split = SplitText.create('[data-heading-title]', { type: 'words', mask: 'words', wordsClass: 'split-word' });

      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
        .from('[data-heading-eyebrow]', { y: 20, autoAlpha: 0, scale: 0.9, duration: 0.7 })
        .from(split.words, { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.07, ease: 'expo.out' }, '-=0.45')
        .from('[data-heading-line]', { scaleX: 0, duration: 1, ease: 'expo.inOut' }, '-=0.9')
        .from('[data-heading-desc]', { y: 24, autoAlpha: 0, duration: 0.9 }, '-=0.8');
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion, title] },
  );

  return (
    <div
      ref={rootRef}
      className={`mb-12 flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
    >
      <span data-heading-eyebrow className="inline-block">
        <Badge variant="outline">{eyebrow}</Badge>
      </span>
      <h2 data-heading-title className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <span
        data-heading-line
        className={`h-[2px] w-16 rounded-full bg-gradient-brand ${align === 'center' ? 'origin-center' : 'origin-left'}`}
        aria-hidden="true"
      />
      {description ? (
        <p data-heading-desc className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
