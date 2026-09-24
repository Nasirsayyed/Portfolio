import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Move3d } from 'lucide-react';
import { skills } from '@/data/portfolio';
import type { SkillCategory } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal3D } from '@/components/ui/Reveal3D';
import { SkillCard } from '@/components/skills/SkillCard';
import { SkillSphere } from '@/components/skills/SkillSphere';
import { useThemeStore } from '@/store/themeStore';

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
  // Recruiter Mode trades the sphere for a flat, scannable grid.
  const recruiterMode = useThemeStore((s) => s.recruiterMode);

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
          description={
            recruiterMode
              ? 'Organized by category — filter to focus on what matters most to you.'
              : 'Drag the sphere to explore — pick a category to bring it forward.'
          }
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
                  : 'border-border bg-card/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {recruiterMode ? (
          <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <AnimatePresence>
              {filtered.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Reveal3D>
            <SkillSphere skills={skills} active={filter} />
            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
              <Move3d className="h-4 w-4" aria-hidden="true" />
              {filter === 'All' ? `${skills.length} technologies` : `${filtered.length} in ${filter}`} · drag to rotate
            </p>
            {/* The sphere is decorative; this is the same content for assistive tech. */}
            <ul className="sr-only">
              {filtered.map((skill) => (
                <li key={skill.name}>
                  {skill.name} ({skill.category})
                </li>
              ))}
            </ul>
          </Reveal3D>
        )}
      </div>
    </section>
  );
}
