import type { Skill } from '@/types';
import { skillCategoryIcons } from '@/data/skillCategoryIcons';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const Icon = skillCategoryIcons[skill.category];

  return (
    <div className="group flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-foreground">{skill.name}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{skill.category}</span>
    </div>
  );
}
