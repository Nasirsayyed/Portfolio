import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { projects } from '@/data/projects';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { Chapter, ChapterLabel } from '@/components/ui/Chapter';
import { Cover } from '@/components/work/Cover';
import type { Project } from '@/types';

const CaseStudy = lazy(() => import('@/components/work/CaseStudy'));

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');
const companyShort = (p: Project) => p.company.split(' ')[0];

/** Cover that trails the pointer over the index; slides between projects as rows change. */
function Preview({ index, visible }: { index: number; visible: boolean }) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 w-[22rem]"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8, rotate: visible ? -2 : 0 }}
      transition={{ duration: 0.45, ease }}
    >
      {/* overflow-hidden, not clip: only a scroll container stops aspect-ratio growing to fit the strip. */}
      <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius)] shadow-2xl">
        <div
          className="transition-transform duration-700 ease-signal"
          style={{ transform: `translateY(${(-index * 100) / projects.length}%)` }}
        >
          {projects.map((p, i) => (
            <Cover key={p.id} project={p} number={i + 1} className="aspect-[4/3]" />
          ))}
        </div>
      </div>
    </m.div>
  );
}

/** Mobile: a row opens its case study in place. */
function InlineDetails({ project, reduceMotion }: { project: Project; reduceMotion: boolean }) {
  return (
    <m.div
      id={`work-details-${project.id}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease }}
      className="overflow-clip"
    >
      <div className="space-y-6 pb-8 pl-10">
        <p className="text-muted-foreground">{project.tagline}</p>
        <p>
          <span className="block font-display text-5xl leading-none text-accent">{project.metric.value}</span>
          <span className="label mt-2 block text-muted-foreground">{project.metric.label}</span>
        </p>
        {(
          [
            ['Problem', project.problem],
            ['Approach', project.approach],
            ['Result', project.result],
          ] as const
        ).map(([label, text]) => (
          <div key={label}>
            <p className="label text-muted-foreground">{label}</p>
            <p className="mt-2 leading-relaxed text-foreground/90">{text}</p>
          </div>
        ))}
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((t) => (
            <li key={t} className="rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </m.div>
  );
}

export function Work() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  // Full-screen case studies from tablet up; phones expand rows inline instead.
  const overlay = useMediaQuery('(min-width: 768px)');
  const activeId = useUiStore((s) => s.activeProjectId);
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  const [origin, setOrigin] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [lastHovered, setLastHovered] = useState(0);
  const [wantCaseStudy, setWantCaseStudy] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const preview = overlay && finePointer && !reduceMotion;

  // Fetch the case-study chunk as the index approaches, so the first open is instant.
  useEffect(() => {
    const el = list.current;
    if (!overlay || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setWantCaseStudy(true);
        observer.disconnect();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [overlay]);

  // Opened from elsewhere (command palette) without a row click.
  useEffect(() => {
    if (activeId) setWantCaseStudy(true);
  }, [activeId]);

  const hover = (i: number | null) => {
    setHovered(i);
    if (i !== null) setLastHovered(i);
  };

  return (
    <Chapter id="work">
      <div className="container py-28 sm:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel id="work" />
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] text-foreground">
              Selected work, <em className="italic">2021 – 2026.</em>
            </h2>
          </div>
          <p className="label max-w-xs text-muted-foreground">
            {projects.length} products across logistics, healthcare, agriculture and government.
          </p>
        </div>

        <div className="label mt-14 hidden grid-cols-[3rem_minmax(0,1.3fr)_minmax(0,1fr)_7rem_7rem] gap-x-4 border-b border-foreground/10 pb-3 text-muted-foreground md:grid">
          <span>No.</span>
          <span>Project</span>
          <span>What it is</span>
          <span>Company</span>
          <span className="text-right">Year</span>
        </div>

        <ol ref={list} className="mt-6 border-t border-foreground/10 md:mt-0 md:border-t-0" onPointerLeave={() => hover(null)}>
          {projects.map((project, i) => {
            const isOpenHere = !overlay && expanded === project.id;
            const lifted = overlay && activeId === project.id && origin === project.id;
            const dim = preview && hovered !== null && hovered !== i;
            return (
              <li key={project.id} className="border-b border-foreground/10">
                <button
                  type="button"
                  data-cursor={overlay ? 'view' : undefined}
                  aria-haspopup={overlay ? 'dialog' : undefined}
                  aria-expanded={overlay ? undefined : isOpenHere}
                  aria-controls={overlay ? undefined : `work-details-${project.id}`}
                  onClick={() => {
                    if (overlay) {
                      setOrigin(project.id);
                      setActiveProjectId(project.id);
                    } else {
                      setExpanded((cur) => (cur === project.id ? null : project.id));
                    }
                  }}
                  onPointerEnter={() => hover(i)}
                  onFocus={() => {
                    hover(i);
                    setWantCaseStudy(true);
                  }}
                  onBlur={() => hover(null)}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-6 text-left transition-opacity duration-300 md:grid-cols-[3rem_minmax(0,1.3fr)_minmax(0,1fr)_7rem_7rem] md:py-7"
                  style={{ opacity: dim ? 0.3 : 1 }}
                >
                  <span className="label text-muted-foreground group-hover:text-accent">{pad(i + 1)}</span>
                  <span className="font-display text-[clamp(1.75rem,4vw,3.5rem)] leading-none text-foreground">
                    <span className="inline-block transition-transform duration-500 ease-signal group-hover:translate-x-3">
                      {lifted ? (
                        <span className="invisible">{project.name}</span>
                      ) : (
                        <m.span layoutId={`work-name-${project.id}`} className="inline-block">
                          {project.name}
                        </m.span>
                      )}
                    </span>
                  </span>
                  <span className="hidden truncate text-muted-foreground md:block">{project.tagline}</span>
                  <span className="label hidden text-muted-foreground md:block">{companyShort(project)}</span>
                  <span className="label flex items-center justify-end gap-3 whitespace-nowrap text-muted-foreground">
                    {project.year}
                    {overlay ? (
                      <ArrowUpRight
                        className="hidden h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:block"
                        aria-hidden="true"
                      />
                    ) : (
                      <Plus
                        className={`h-4 w-4 transition-transform duration-300 ${isOpenHere ? 'rotate-45 text-accent' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
                {!overlay && (
                  <AnimatePresence initial={false}>
                    {isOpenHere && <InlineDetails project={project} reduceMotion={reduceMotion} />}
                  </AnimatePresence>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {preview && <Preview index={hovered ?? lastHovered} visible={hovered !== null && !activeId} />}

      {overlay && wantCaseStudy && (
        <Suspense fallback={null}>
          <CaseStudy origin={origin} />
        </Suspense>
      )}
    </Chapter>
  );
}
