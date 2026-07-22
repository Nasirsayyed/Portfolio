import { motion } from 'framer-motion';
import type { Skill } from '@/types';
import { skillCategoryIcons } from '@/data/skillCategoryIcons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  const Icon = skillCategoryIcons[skill.category];
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layout
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.3) }}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-6 text-center shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-250 group-hover:scale-110">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-foreground">{skill.name}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{skill.category}</span>
    </motion.div>
  );
}
