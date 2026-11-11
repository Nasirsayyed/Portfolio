import { useRef } from 'react';
import { experience } from '@/data/experience';
import { gsap, useGSAP } from '@/lib/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/experience/ExperienceCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ExperienceTimeline() {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  useScrollReveal(listRef);

  useGSAP(
    () => {
      if (reduceMotion) return;

      // The glowing rail draws itself as you scroll through the roles.
      gsap.fromTo(
        '[data-timeline-progress]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: listRef.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
        },
      );

      // Each node pops when the rail reaches it.
      gsap.utils.toArray<HTMLElement>('[data-timeline-dot]').forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.6,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: dot, start: 'top 70%', toggleActions: 'play none none reverse' },
        });
      });
    },
    { scope: listRef, revertOnUpdate: true, dependencies: [reduceMotion] },
  );

  return (
    <section id="experience" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Career Journey"
          title="Experience"
          description="4+ years shipping production software — from SaaS platforms to enterprise dashboards."
        />

        <div ref={listRef} className="relative mx-auto max-w-3xl">
          <div className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-border sm:block" aria-hidden="true">
            <div
              data-timeline-progress
              className="absolute inset-0 origin-top bg-gradient-to-b from-gradient-start to-gradient-end shadow-[0_0_12px_var(--glow)]"
            />
          </div>
          <div className="flex flex-col gap-8 sm:pl-8">
            {experience.map((entry) => (
              <div key={entry.id} className="relative">
                <span
                  data-timeline-dot
                  className={`absolute -left-8 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 sm:block ${
                    entry.current ? 'border-primary bg-primary shadow-glow' : 'border-primary/60 bg-background'
                  }`}
                  aria-hidden="true"
                />
                <div data-reveal="right">
                  <ExperienceCard entry={entry} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
