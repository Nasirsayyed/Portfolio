import { useRef, type PointerEvent, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { achievements, certifications, education } from '@/data/portfolio';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Chapter, ChapterLabel } from '@/components/ui/Chapter';
import type { Achievement } from '@/types';

/** Bento placement, in achievement order; the first tile is the feature. */
const LAYOUT = [
  'sm:col-span-2 lg:col-span-7 lg:row-span-2',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
];

function Tile({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`spotlight flex flex-col justify-between gap-8 rounded-[var(--radius)] border border-foreground/10 bg-card/85 p-6 transition-colors duration-300 hover:border-foreground/20 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function AchievementTile({ item, index, className }: { item: Achievement; index: number; className: string }) {
  const feature = index === 0;
  return (
    <Tile className={className}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="label text-foreground">{item.title}</h3>
        <span className="label text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div>
        <p
          className={`font-display leading-[0.9] ${
            feature ? 'text-[clamp(5rem,12vw,11rem)] text-accent' : 'text-[clamp(3rem,5vw,4.5rem)] text-foreground'
          }`}
        >
          {item.figure}
        </p>
        <p className="label mt-3 text-muted-foreground">{item.figureLabel}</p>
        <p className={`mt-5 leading-relaxed text-muted-foreground ${feature ? 'max-w-md text-lead' : 'text-sm'}`}>
          {item.description}
        </p>
      </div>
    </Tile>
  );
}

export function Proof() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const grid = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const glow = finePointer && !reduceMotion;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!glow || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      grid.current?.querySelectorAll<HTMLElement>('.spotlight').forEach((tile) => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty('--x', `${clientX - rect.left}px`);
        tile.style.setProperty('--y', `${clientY - rect.top}px`);
      });
    });
  };

  const degree = education[0];

  return (
    <Chapter id="proof">
      <div className="container py-28 sm:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel id="proof" />
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] text-foreground">
              Proof, <em className="italic">in numbers.</em>
            </h2>
          </div>
          <p className="label max-w-xs text-muted-foreground">Outcomes from production work, straight from the résumé.</p>
        </div>

        <div
          ref={grid}
          onPointerMove={onPointerMove}
          className={`mt-14 grid auto-rows-[minmax(15rem,auto)] gap-3 sm:grid-cols-2 lg:grid-cols-12 ${glow ? 'spotlight-grid' : ''}`}
        >
          {achievements.map((item, i) => (
            <AchievementTile key={item.title} item={item} index={i} className={LAYOUT[i] ?? 'lg:col-span-4'} />
          ))}

          {degree && (
            <Tile className="sm:col-span-2 lg:col-span-7">
              <h3 className="label text-foreground">Education</h3>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="font-display text-[clamp(2rem,3.5vw,3rem)] leading-[1.02] text-foreground">
                    {degree.degree}, <em className="italic">{degree.field}</em>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{degree.institution}</p>
                  <p className="label mt-2 text-muted-foreground">{degree.period}</p>
                </div>
                {degree.detail && (
                  <p>
                    <span className="block font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-accent">
                      {degree.detail}
                    </span>
                    <span className="label mt-2 block text-muted-foreground">Aggregate</span>
                  </p>
                )}
              </div>
            </Tile>
          )}

          <Tile className="sm:col-span-2 lg:col-span-5">
            <h3 className="label text-foreground">Certifications</h3>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {certifications.map((cert) => (
                <li key={cert.name} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-display text-2xl leading-tight text-foreground">{cert.name}</p>
                    <p className="label mt-1 text-muted-foreground">{cert.issuer}</p>
                  </div>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="label inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
                      aria-label={`Verify ${cert.name} certificate on ${cert.issuer}`}
                    >
                      Verify <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Tile>
        </div>
      </div>
    </Chapter>
  );
}
