import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { ProjectCover } from '@/components/projects/ProjectCover';

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : (index % 4) * 0.08 }}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      <ProjectCover project={project} />

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
          className="focus-ring mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          View Details
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
