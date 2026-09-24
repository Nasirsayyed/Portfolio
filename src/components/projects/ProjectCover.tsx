import type { Project } from '@/types';
import { projectInitials } from '@/utils/text';

interface ProjectCoverProps {
  project: Project;
  /** `feature` is the wide lead card; `modal` the details dialog. */
  size?: 'card' | 'feature' | 'modal';
}

// backface-hidden: through glass you'd otherwise read the far faces' labels mirrored.
const faceBase =
  'backface-hidden absolute inset-0 flex items-center justify-center rounded-md border border-white/60 bg-white/20 font-extrabold text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.3)]';

const sizes = {
  card: { cube: 84, aspect: 'aspect-[16/10]' },
  feature: { cube: 120, aspect: 'aspect-[16/10] sm:aspect-[16/7]' },
  modal: { cube: 112, aspect: 'aspect-[16/8]' },
};

/**
 * Abstract project art: a glassy cube carrying the project's initials and
 * top technologies, sitting at an isometric angle and turning over when its
 * card is hovered (via the parent `group`).
 */
export function ProjectCover({ project, size = 'card' }: ProjectCoverProps) {
  const initials = projectInitials(project.title);
  const [techA = '', techB = '', techC = ''] = project.technologies;
  const { cube, aspect } = sizes[size];
  const half = cube / 2;

  const faces = [
    { transform: `rotateY(0deg) translateZ(${half}px)`, content: initials, className: cube > 100 ? 'text-5xl' : 'text-3xl' },
    { transform: `rotateY(90deg) translateZ(${half}px)`, content: techA, className: 'px-1 text-center text-[11px] leading-tight' },
    { transform: `rotateY(180deg) translateZ(${half}px)`, content: techB, className: 'px-1 text-center text-[11px] leading-tight' },
    { transform: `rotateY(-90deg) translateZ(${half}px)`, content: techC || initials, className: 'px-1 text-center text-[11px] leading-tight' },
    { transform: `rotateX(90deg) translateZ(${half}px)`, content: '', className: '' },
    { transform: `rotateX(-90deg) translateZ(${half}px)`, content: '', className: '' },
  ];

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-t-xl ${aspect}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})` }}
      aria-hidden="true"
    >
      {/* Receding floor grid adds a vanishing point behind the cube */}
      <div
        className="absolute inset-x-[-20%] bottom-[-10%] h-[70%] opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          transform: 'perspective(300px) rotateX(62deg)',
          transformOrigin: 'center bottom',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

      <div style={{ perspective: 700 }} className="relative">
        <div
          className="preserve-3d relative transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform:rotateX(-22deg)_rotateY(-34deg)] group-hover:[transform:rotateX(-22deg)_rotateY(146deg)]"
          style={{ width: cube, height: cube }}
        >
          {faces.map((face, i) => (
            <div key={i} className={`${faceBase} ${face.className}`} style={{ transform: face.transform }}>
              {face.content}
            </div>
          ))}
        </div>
        {/* Contact shadow */}
        <div className="absolute left-1/2 top-full h-4 w-[120%] -translate-x-1/2 translate-y-4 rounded-full bg-black/25 blur-md" />
      </div>
    </div>
  );
}
