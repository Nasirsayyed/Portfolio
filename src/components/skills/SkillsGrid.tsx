import { useLayoutEffect, useRef, useState } from 'react';
import { skills } from '@/data/portfolio';
import type { SkillCategory } from '@/types';
import { Flip, gsap, useGSAP } from '@/lib/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillCard } from '@/components/skills/SkillCard';
import { Marquee } from '@/components/motion/Marquee';
import { SkillsGlobe } from '@/components/three/SkillsGlobe';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const categories: SkillCategory[] = [
  'Languages',
  'Frameworks',
  'Front-End',
  'APIs & Integration',
  'Databases',
  'Cloud',
  'Tools',
  'Practices',
];

const globeLabels = skills.map((s) => ({ text: s.name, group: s.category }));

const half = Math.ceil(skills.length / 2);
const marqueeTop = skills.slice(0, half).map((s) => s.name);
const marqueeBottom = skills.slice(half).map((s) => s.name);

export function SkillsGrid() {
  const [filter, setFilter] = useState<SkillCategory | 'All'>('All');
  const reduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const changeFilter = (next: SkillCategory | 'All') => {
    if (next === filter) return;
    if (!reduceMotion && gridRef.current) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll('[data-skill]'));
    }
    setFilter(next);
  };

  // Every card stays mounted (hidden ones get display:none) so Flip can
  // animate cards leaving as well as entering and reflowing.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !gridRef.current) return;
    flipState.current = null;

    Flip.from(state, {
      targets: gridRef.current.querySelectorAll('[data-skill]'),
      duration: 0.7,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.015,
      onEnter: (els) =>
        els.length > 0 &&
        gsap.fromTo(els, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.2 }),
      onLeave: (els) => els.length > 0 && gsap.to(els, { autoAlpha: 0, scale: 0.6, duration: 0.35 }),
    });
  }, [filter]);

  // First appearance: cards cascade in from below.
  useGSAP(
    () => {
      if (reduceMotion) return;
      gsap.from('[data-skill]', {
        y: 50,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: { each: 0.03, from: 'start' },
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
        clearProps: 'transform,opacity,visibility',
      });
    },
    { scope: gridRef, revertOnUpdate: true, dependencies: [reduceMotion] },
  );

  return (
    <section id="skills" className="scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Technical Skills"
          title="Tools & Technologies"
          description="Organized by category — filter to focus on what matters most to you."
        />
      </div>

      <div className="-mx-10 mb-14 flex -rotate-2 flex-col gap-2 border-y border-border bg-card/40 py-4">
        <Marquee items={marqueeTop} />
        <Marquee items={marqueeBottom} direction={-1} ghost />
      </div>

      <div className="container">
        {!reduceMotion && (
          <SkillsGlobe
            labels={globeLabels}
            activeGroup={filter === 'All' ? null : filter}
            onSelect={(label) => changeFilter(label.group === filter ? 'All' : (label.group as SkillCategory))}
          />
        )}

        <div
          className="mb-10 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filter skills by category"
        >
          {(['All', ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={filter === category}
              onClick={() => changeFilter(category)}
              className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === category
                  ? 'border-primary/50 bg-gradient-brand text-primary-foreground shadow-glow'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map((skill) => {
            const visible = filter === 'All' || skill.category === filter;
            return (
              <div key={skill.name} data-skill className={visible ? '' : 'hidden'}>
                <SkillCard skill={skill} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
