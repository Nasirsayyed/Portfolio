import { useEffect, useRef, useState, type FocusEvent } from "react";
import { ArrowRight } from "lucide-react";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStickyProgress } from "@/hooks/useStickyProgress";
import { scrollToTarget } from "@/motion/lenis";
import { scrollToSection } from "@/utils/scroll";
import { Chapter, ChapterLabel } from "@/components/ui/Chapter";
import type { ExperienceEntry } from "@/types";

/** "RB Dashboard: Architected…" → "RB Dashboard" */
const platformName = (highlight: string) => highlight.split(":")[0]!.trim();

const YEARS = ["2021", "2022", "2023", "2024", "2025", "2026"];

function NowBadge() {
  return (
    <span className="label inline-flex items-center gap-2 rounded-full border border-accent/50 px-2.5 py-1 text-accent">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-accent" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      Now
    </span>
  );
}

function RoleHeader({ entry }: { entry: ExperienceEntry }) {
  return (
    <header>
      <div className="label flex flex-wrap items-center gap-3 text-muted-foreground">
        {entry.current && <NowBadge />}
        <span>{entry.period}</span>
        <span aria-hidden="true">·</span>
        <span>{entry.location}</span>
      </div>
      <h3 className="mt-5 font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.02] text-foreground">
        {entry.company}
      </h3>
      <p className="label mt-3 text-accent">{entry.role}</p>
    </header>
  );
}

function Impact({ entry }: { entry: ExperienceEntry }) {
  return (
    <ol className="mt-6 space-y-3">
      {entry.impact.map((line, i) => (
        <li key={line} className="flex gap-4 text-foreground/90">
          <span className="label mt-1 shrink-0 text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="leading-relaxed">{line}</span>
        </li>
      ))}
    </ol>
  );
}

function Tags({ entry }: { entry: ExperienceEntry }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
      {entry.technologies.map((t) => (
        <li
          key={t}
          className="rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function Platforms({ entry }: { entry: ExperienceEntry }) {
  if (entry.current) return null;
  return (
    <div>
      <p className="label text-muted-foreground">
        {entry.highlights.length} production platforms
      </p>
      <ul className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10">
        {entry.highlights.map((h, i) => (
          <li key={h} className="flex items-baseline gap-4 py-2.5">
            <span className="label text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl leading-tight text-foreground">
              {platformName(h)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Outro({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      <p className="label text-muted-foreground">Next</p>
      <p className="mt-4 font-display text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.05] text-foreground">
        The next chapter <em className="italic text-accent">could be yours.</em>
      </p>
      <a
        href="#connect"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("connect", reduceMotion);
        }}
        className="label group mt-8 inline-flex items-center gap-3 text-foreground"
      >
        Start a conversation
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 ease-signal group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}

const intro = (
  <>
    <ChapterLabel id="experience" />
    <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] text-foreground">
      Four years, <em className="italic">two</em> companies, {projects.length}{" "}
      products shipped.
    </h2>
  </>
);

/** Desktop: the chapter pins and its panels slide sideways as you scroll — the helix travels with them. */
function HorizontalTrack({ reduceMotion }: { reduceMotion: boolean }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  // Scroll length = how far the track has to travel, plus one viewport to sit in.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () =>
      setHeight(
        Math.max(0, el.scrollWidth - window.innerWidth) + window.innerHeight,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useStickyProgress(section, (progress) => {
    const el = track.current;
    if (!el) return;
    const distance = Math.max(0, el.scrollWidth - window.innerWidth);
    el.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
    if (fill.current) fill.current.style.transform = `scaleX(${progress})`;
  });

  // Keyboard users tabbing into an off-screen panel: scroll the page so it slides into view.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const sec = section.current;
    const el = track.current;
    if (!sec || !el) return;
    const panel = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-panel]",
    );
    if (!panel) return;
    const distance = Math.max(1, el.scrollWidth - window.innerWidth);
    const progress = Math.min(1, panel.offsetLeft / distance);
    const top = sec.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + progress * (sec.offsetHeight - window.innerHeight), {
      immediate: true,
    });
  };

  // Oldest → newest, so panels travel the same way as the year ruler and the helix.
  const chronological = [...experience].reverse();

  return (
    <div ref={section} style={{ height: height ?? "300svh" }} onFocus={onFocus}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-clip">
        <div className="flex flex-1 [mask-image:linear-gradient(90deg,transparent,#000_3rem,#000_calc(100%-3rem),transparent)] min-[1440px]:[mask-image:linear-gradient(90deg,transparent_9rem,#000_14rem,#000_calc(100%-4rem),transparent)]">
          <div
            ref={track}
            className="flex flex-1 items-start gap-[7vw] pl-[max(3rem,calc((100vw-1280px)/2+3rem))] pr-[12vw] pt-[17svh] will-change-transform"
          >
            <section
              data-panel
              className="w-[30rem] shrink-0"
              aria-label="Overview"
            >
              {intro}
              <p className="label mt-10 flex items-center gap-3 text-muted-foreground">
                Scroll <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </p>
            </section>

            {chronological.map((entry) =>
              entry.current ? (
                <article
                  key={entry.id}
                  data-panel
                  className="w-[38rem] shrink-0"
                >
                  <RoleHeader entry={entry} />
                  <p className="mt-6 max-w-xl text-lead text-muted-foreground">
                    {entry.summary}
                  </p>
                  <Impact entry={entry} />
                  <Tags entry={entry} />
                </article>
              ) : (
                <article
                  key={entry.id}
                  data-panel
                  className="grid w-[64rem] shrink-0 grid-cols-[1.15fr_1fr] gap-14"
                >
                  <div>
                    <RoleHeader entry={entry} />
                    <Impact entry={entry} />
                    <Tags entry={entry} />
                  </div>
                  <div className="pt-2">
                    <Platforms entry={entry} />
                  </div>
                </article>
              ),
            )}

            <section
              data-panel
              className="w-[26rem] shrink-0 self-center"
              aria-label="What's next"
            >
              <Outro reduceMotion={reduceMotion} />
            </section>
          </div>
        </div>

        {/* Year ruler: reads as the time axis the helix is travelling along. */}
        <div className="container pb-8" aria-hidden="true">
          <div className="label flex justify-between text-muted-foreground">
            {YEARS.map((y) => (
              <span key={y}>{y}</span>
            ))}
            <span className="text-accent">Now</span>
          </div>
          <div className="mt-3 h-px bg-foreground/10">
            <div
              ref={fill}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile and reduced motion: a plain vertical timeline, nothing hijacks the scroll. */
function VerticalTimeline({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="container py-24 sm:py-32">
      {intro}
      <ol className="relative mt-14 space-y-16 border-l border-foreground/15 pl-6 sm:pl-10">
        {experience.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[calc(1.5rem+4.5px)] top-1 h-2 w-2 rounded-full sm:-left-[calc(2.5rem+4.5px)] ${
                entry.current ? "bg-accent" : "bg-foreground/40"
              }`}
            />
            <article>
              <RoleHeader entry={entry} />
              <p className="mt-5 text-muted-foreground">{entry.summary}</p>
              <Impact entry={entry} />
              <Tags entry={entry} />
              {!entry.current && (
                <div className="mt-10">
                  <Platforms entry={entry} />
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>
      <div className="mt-20">
        <Outro reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}

export function Experience() {
  const reduceMotion = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");

  return (
    <Chapter id="experience">
      {wide && !reduceMotion ? (
        <HorizontalTrack reduceMotion={reduceMotion} />
      ) : (
        <VerticalTimeline reduceMotion={reduceMotion} />
      )}
    </Chapter>
  );
}
