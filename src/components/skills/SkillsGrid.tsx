import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { skills } from '@/data/portfolio';
import type { SkillCategory } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillCard } from '@/components/skills/SkillCard';

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

export function SkillsGrid() {
  const [filter, setFilter] = useState<SkillCategory | 'All'>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? skills : skills.filter((skill) => skill.category === filter)),
    [filter],
  );

  return (
    <section id="skills" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Technical Skills"
          title="Tools & Technologies"
          description="Organized by category — filter to focus on what matters most to you."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter skills by category">
          {(['All', ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={filter === category}
              onClick={() => setFilter(category)}
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

        <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <AnimatePresence>
            {filtered.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
