import type { Project } from '@/types';
import { projectInitials } from '@/utils/text';

interface ProjectCoverProps {
  project: Project;
}

export function ProjectCover({ project }: ProjectCoverProps) {
  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-t-xl"
      style={{ backgroundImage: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})` }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-black/10" />
      <span className="relative text-5xl font-extrabold text-white/90 drop-shadow-sm">
        {projectInitials(project.title)}
      </span>
    </div>
  );
}
