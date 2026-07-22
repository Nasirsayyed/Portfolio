import { projects } from '@/data/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectModal } from '@/components/projects/ProjectModal';

export function ProjectsGrid() {
  return (
    <section id="projects" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Featured Projects"
          title="8 Projects Shipped"
          description="Production platforms delivered across logistics, healthcare, agriculture, and government domains."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} featured={index === 0} />
          ))}
        </div>
      </div>

      <ProjectModal />
    </section>
  );
}
