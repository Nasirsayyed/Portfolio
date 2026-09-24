import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { useUiStore } from '@/store/uiStore';
import { ProjectCover } from '@/components/projects/ProjectCover';
import { Reveal3D } from '@/components/ui/Reveal3D';
import { TiltCard } from '@/components/ui/TiltCard';

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);

  return (
    <Reveal3D delay={(index % 3) * 0.1} className={featured ? 'sm:col-span-2' : ''}>
      <TiltCard
        maxTilt={featured ? 6 : 10}
        // No overflow-hidden here: it would flatten the 3D context and kill the depth layers.
        className="group flex h-full flex-col rounded-xl border border-border bg-card shadow-card transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-glow"
      >
        <ProjectCover project={project} size={featured ? 'feature' : 'card'} />

        <div className="depth-2 flex flex-1 flex-col gap-3 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{project.company}</p>
            <h3 className="mt-1 text-lg font-bold text-foreground">{project.title}</h3>
          </div>

          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 ? (
              <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                +{project.technologies.length - 4}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setActiveProjectId(project.id)}
            className="focus-ring mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            View Details
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </TiltCard>
    </Reveal3D>
  );
}
