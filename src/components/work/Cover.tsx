import type { Project } from '@/types';

interface CoverProps {
  project: Project;
  /** 1-based position in the index, printed large in the background. */
  number: number;
  className?: string;
  /** Larger type for the case-study hero. */
  size?: 'sm' | 'lg';
}

/**
 * Typographic project cover: blueprint grid, oversized index number and the
 * project's headline figure. No screenshots needed, and it follows the theme.
 */
export function Cover({ project, number, className = '', size = 'sm' }: CoverProps) {
  const lg = size === 'lg';
  return (
    <div
      className={`relative overflow-clip rounded-[var(--radius)] border border-foreground/10 bg-card ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_10%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)]" />
      <span
        className={`absolute right-0 top-0 translate-x-[6%] translate-y-[-18%] font-display leading-none text-foreground/[0.06] ${
          lg ? 'text-[clamp(10rem,28vw,24rem)]' : 'text-[11rem]'
        }`}
      >
        {String(number).padStart(2, '0')}
      </span>
      <p className={`label absolute text-muted-foreground ${lg ? 'left-8 top-8' : 'left-5 top-5'}`}>
        {project.tagline}
      </p>
      <div className={`absolute ${lg ? 'bottom-8 left-8' : 'bottom-5 left-5'}`}>
        <p
          className={`font-display leading-none text-accent ${lg ? 'text-[clamp(4rem,9vw,8rem)]' : 'text-6xl'}`}
        >
          {project.metric.value}
        </p>
        <p className="label mt-2 text-muted-foreground">{project.metric.label}</p>
      </div>
      <span className={`label absolute text-muted-foreground ${lg ? 'bottom-8 right-8' : 'bottom-5 right-5'}`}>
        {project.year}
      </span>
    </div>
  );
}
