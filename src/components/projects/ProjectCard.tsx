import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { useUiStore } from '@/store/uiStore';
import { useTilt } from '@/hooks/useTilt';
import { ProjectCover } from '@/components/projects/ProjectCover';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, featured ? 4 : 7);

  return (
    <div data-reveal="clip" className={`h-full ${featured ? 'sm:col-span-2' : ''}`}>
      <div
        ref={cardRef}
        className="tilt-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-glow"
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.06]">
            <ProjectCover project={project} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
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
            className="focus-ring mt-1 flex items-center gap-1.5 self-start text-sm font-semibold text-primary after:absolute after:inset-0 after:content-['']"
          >
            View Details
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
