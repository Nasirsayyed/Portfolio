import { CheckCircle2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { useUiStore } from '@/store/uiStore';
import { Modal } from '@/components/ui/Modal';
import { ProjectCover } from '@/components/projects/ProjectCover';

export function ProjectModal() {
  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  const project = projects.find((p) => p.id === activeProjectId) ?? null;

  return (
    <Modal open={project !== null} onClose={() => setActiveProjectId(null)} labelledBy="project-modal-title">
      {project ? (
        <div>
          <ProjectCover project={project} />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {project.company} &middot; {project.period}
            </p>
            <h2 id="project-modal-title" className="mt-1 text-2xl font-bold text-foreground">
              {project.title}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{project.description}</p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">My Role</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{project.role}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Key Features</h3>
              <ul className="mt-2 space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Technologies</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
