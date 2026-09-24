import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { projects } from "@/data/projects";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useUiStore } from "@/store/uiStore";
import { Cover } from "@/components/work/Cover";
import type { Project } from "@/types";

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

interface PanelProps {
  project: Project;
  index: number;
  /** Carry the shared-element name only for the project the dialog was opened from. */
  shared: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  onStep: (delta: number) => void;
}

function Panel({
  project,
  index,
  shared,
  reduceMotion,
  onClose,
  onStep,
}: PanelProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  useFocusTrap(dialog, true);
  useLockBodyScroll(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Arrow keys page between projects unless the reader is in a form control.
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  // Paging to another project starts it from the top.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project.id]);

  const prev = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;
  const fade = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
    transition: {
      duration: reduceMotion ? 0 : 0.7,
      ease,
      delay: reduceMotion ? 0 : 0.3,
    },
  };

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-[60]"
    >
      {/* Curtain: its own layer, so its clip never cuts the flying title. */}
      <m.div
        aria-hidden="true"
        className="absolute inset-0 bg-background"
        initial={{
          clipPath: reduceMotion
            ? "inset(0% 0% 0% 0%)"
            : "inset(100% 0% 0% 0%)",
        }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{
          clipPath: reduceMotion
            ? "inset(0% 0% 0% 0%)"
            : "inset(0% 0% 100% 0%)",
          opacity: reduceMotion ? 0 : 1,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.75, ease }}
      />

      <div
        ref={scroller}
        data-lenis-prevent
        className="relative h-full overflow-y-auto overscroll-contain"
      >
        <m.div
          {...fade}
          transition={{ ...fade.transition, delay: reduceMotion ? 0 : 0.2 }}
          className="sticky top-0 z-10 border-b border-foreground/10 bg-background/85 backdrop-blur-md"
        >
          <div className="container flex h-16 items-center justify-between">
            <p className="label text-muted-foreground">
              Case study <span className="text-accent">{pad(index + 1)}</span> /{" "}
              {pad(projects.length)}
            </p>
            <div className="flex items-center gap-2">
              <span className="label hidden text-muted-foreground sm:inline">
                Esc to close
              </span>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-foreground/50"
                aria-label="Close case study"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </m.div>

        {/* Paging swaps the article inside its own presence, so remounts never hold up the dialog's exit. */}
        <AnimatePresence mode="wait" initial={false}>
          <m.article
            key={project.id}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.15 },
            }}
            className="container pb-16 pt-14 sm:pt-20"
          >
            <m.p {...fade} className="label text-accent">
              {project.tagline}
            </m.p>
            <m.h2
              id="case-study-title"
              layoutId={shared ? `work-name-${project.id}` : undefined}
              initial={
                shared ? undefined : { opacity: 0, y: reduceMotion ? 0 : 30 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease }}
              className="mt-5 inline-block font-display text-[clamp(3.25rem,10vw,9rem)] leading-[0.92] tracking-[-0.02em] text-foreground"
            >
              {project.name}
            </m.h2>

            <m.div {...fade}>
              <dl className="mt-12 grid gap-6 border-y border-foreground/10 py-6 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    ["Company", project.company],
                    ["Role", project.role],
                    ["When", project.period],
                    ["Stack", project.technologies.join(" · ")],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="label text-muted-foreground">{label}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Cover
                project={project}
                number={index + 1}
                size="lg"
                className="mt-12 aspect-[16/9] sm:aspect-[16/7]"
              />

              <div className="mt-20 space-y-14 sm:mt-28 sm:space-y-20">
                {(
                  [
                    ["01", "The problem", project.problem],
                    ["02", "The approach", project.approach],
                    ["03", "The result", project.result],
                  ] as const
                ).map(([n, label, text]) => (
                  <section
                    key={n}
                    className="grid gap-4 lg:grid-cols-12 lg:gap-6"
                  >
                    <h3 className="label flex gap-3 text-muted-foreground lg:col-span-3">
                      <span className="text-accent">{n}</span>
                      {label}
                    </h3>
                    <p className="text-balance font-display text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.15] text-foreground lg:col-span-8">
                      {text}
                    </p>
                  </section>
                ))}

                <section className="grid gap-4 lg:grid-cols-12 lg:gap-6">
                  <h3 className="label flex gap-3 text-muted-foreground lg:col-span-3">
                    <span className="text-accent">04</span>
                    What shipped
                  </h3>
                  <div className="lg:col-span-8">
                    <p className="text-lead text-muted-foreground">
                      {project.description}
                    </p>
                    <ul className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-4 py-4 text-foreground/90"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            </m.div>
          </m.article>
        </AnimatePresence>

        <m.nav
          {...fade}
          aria-label="More case studies"
          className="border-t border-foreground/10"
        >
          <div className="container grid sm:grid-cols-2">
            {(
              [
                [-1, "Previous", prev],
                [1, "Next", next],
              ] as const
            ).map(([delta, label, target]) => (
              <button
                key={label}
                type="button"
                onClick={() => onStep(delta)}
                className={`group flex flex-col gap-3 py-10 text-left sm:py-14 ${
                  delta === 1
                    ? "border-t border-foreground/10 sm:items-end sm:border-l sm:border-t-0 sm:pl-8 sm:text-right"
                    : "sm:pr-8"
                }`}
              >
                <span className="label flex items-center gap-2 text-muted-foreground">
                  {delta === -1 && (
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {label}
                  {delta === 1 && (
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </span>
                <span className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-none text-foreground transition-colors group-hover:text-accent">
                  {target.name}
                </span>
              </button>
            ))}
          </div>
        </m.nav>
      </div>
    </div>
  );
}

/** Full-screen case study for the Work index. Lazy-loaded; mounted once the index is near. */
export default function CaseStudy({ origin }: { origin: string | null }) {
  const reduceMotion = useReducedMotion();
  const activeId = useUiStore((s) => s.activeProjectId);
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  // Once the reader pages to another project, the title no longer belongs to a row on screen.
  const [paged, setPaged] = useState(false);
  const index = projects.findIndex((p) => p.id === activeId);
  const project = projects[index];

  useEffect(() => {
    if (!activeId) setPaged(false);
  }, [activeId]);

  const close = () => setActiveProjectId(null);
  const step = (delta: number) => {
    const target =
      projects[(index + delta + projects.length) % projects.length];
    if (!target) return;
    setPaged(true);
    setActiveProjectId(target.id);
  };

  return (
    <AnimatePresence>
      {project && (
        <Panel
          key="case-study"
          project={project}
          index={index}
          shared={!paged && origin === project.id && !reduceMotion}
          reduceMotion={reduceMotion}
          onClose={close}
          onStep={step}
        />
      )}
    </AnimatePresence>
  );
}
