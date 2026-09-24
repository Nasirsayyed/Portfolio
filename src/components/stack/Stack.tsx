import { useEffect, useState } from 'react';
import { skills } from '@/data/portfolio';
import { use3DEnabled } from '@/hooks/use3DEnabled';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { Chapter, ChapterLabel } from '@/components/ui/Chapter';
import type { StackLayer } from '@/types';

type Layer = Exclude<StackLayer, 'tooling'>;

/**
 * The three bands sit where the Signal's architecture planes land on screen.
 * Plane heights (±2.1 world units, tilted 0.42 rad) project to ~27% / 50% /
 * 73% of the viewport for any size, since the camera's vertical FOV is fixed.
 */
const LAYERS: {
  id: Layer;
  index: string;
  name: string;
  blurb: string;
  top: string;
}[] = [
  {
    id: 'client',
    index: 'L1',
    name: 'Client',
    blurb: 'Interfaces, dashboards and maps',
    top: '27%',
  },
  {
    id: 'api',
    index: 'L2',
    name: 'API',
    blurb: 'Services, integrations and payments',
    top: '50%',
  },
  {
    id: 'data',
    index: 'L3',
    name: 'Data',
    blurb: 'Schemas, queries and sync',
    top: '73%',
  },
];

const FILTERS: { id: Layer | null; label: string }[] = [
  { id: null, label: 'All' },
  { id: 'client', label: 'Client' },
  { id: 'api', label: 'API' },
  { id: 'data', label: 'Data' },
];

const byLayer = (layer: StackLayer) => skills.filter((s) => s.layer === layer).map((s) => s.name);

function Marquee({ items, reverse = false, still = false }: { items: string[]; reverse?: boolean; still?: boolean }) {
  // Two copies so translating by -50% loops seamlessly.
  const run = [...items, ...items];
  return (
    <div className="flex overflow-clip py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className={`flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 ${
          still ? '' : reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {run.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-[clamp(2rem,4.5vw,3.75rem)] italic leading-none text-foreground/85">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  const [selected, setSelected] = useState<Layer | null>(null);
  const [hovered, setHovered] = useState<Layer | null>(null);
  const setStackFocus = useUiStore((s) => s.setStackFocus);
  const focus = hovered ?? selected;
  // The pinned stage exists to line the bands up with the Signal's planes; with no field, lay them out flat.
  const pinned = use3DEnabled();
  const reduceMotion = useReducedMotion();

  // Drives which Signal plane glows in the accent colour.
  useEffect(() => {
    setStackFocus(focus);
  }, [focus, setStackFocus]);
  useEffect(() => () => setStackFocus(null), [setStackFocus]);

  return (
    <Chapter id="stack">
      <div className={pinned ? 'h-[180svh]' : ''}>
        <div className={pinned ? 'sticky top-0 h-[100svh] overflow-clip' : 'pb-16 pt-24 sm:pt-32'}>
          <div className="container relative z-10 flex items-end justify-between gap-6 pt-20 sm:pt-24">
            <div>
              <ChapterLabel id="stack" />
              <h2 className="mt-4 font-display text-display-sm leading-none text-foreground">
                The stack, <em className="italic text-accent">layer by layer.</em>
              </h2>
            </div>
          </div>

          {LAYERS.map((layer) => {
            const dimmed = focus !== null && focus !== layer.id;
            const names = byLayer(layer.id);
            return (
              <div
                key={layer.id}
                className={`transition-opacity duration-500 ease-signal ${
                  pinned ? 'absolute inset-x-0 -translate-y-1/2' : 'mt-10 border-t border-foreground/10 pt-8 sm:mt-12'
                }`}
                style={{ top: pinned ? layer.top : undefined, opacity: dimmed ? 0.25 : 1 }}
                onPointerEnter={() => setHovered(layer.id)}
                onPointerLeave={() => setHovered(null)}
              >
                <div className="container grid gap-3 lg:grid-cols-12 lg:items-center lg:gap-6">
                  <div className="lg:col-span-4">
                    <div className="flex items-baseline gap-4">
                      <span className="label text-accent">{layer.index}</span>
                      <span className="font-display text-3xl leading-none text-foreground sm:text-4xl">
                        {layer.name}
                      </span>
                    </div>
                    <p className="label mt-2 hidden pl-9 text-muted-foreground lg:block">{layer.blurb}</p>
                  </div>
                  <ul
                    aria-label={`${layer.name} layer`}
                    className="flex flex-wrap gap-1.5 sm:gap-2 lg:col-span-8 lg:justify-end"
                  >
                    {names.map((name) => (
                      <li
                        key={name}
                        className="rounded-full border border-foreground/15 bg-background/80 px-2.5 py-1 font-mono text-[11px] tracking-wide text-foreground sm:px-3 sm:text-xs"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <div
            className={`container z-10 flex flex-wrap items-center justify-between gap-4 ${
              pinned ? 'absolute inset-x-0 bottom-6 sm:bottom-8' : 'mt-12'
            }`}
          >
            <div role="group" aria-label="Highlight a layer" className="flex flex-wrap gap-1.5">
              {FILTERS.map((filter) => {
                const active = selected === filter.id;
                return (
                  <button
                    key={filter.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(filter.id)}
                    className={`label h-9 rounded-full border px-4 transition-colors ${
                      active
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-foreground/15 bg-background/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
            <p className="label hidden text-muted-foreground md:block">
              {skills.length} technologies{pinned ? ' · hover a layer to trace it' : ''}
            </p>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="border-y border-foreground/10 py-6">
        <Marquee items={[...byLayer('client'), ...byLayer('api'), ...byLayer('data')].slice(0, 14)} still={reduceMotion} />
        <Marquee items={byLayer('tooling')} reverse still={reduceMotion} />
      </div>

      {/* The bands above are real lists; tooling only appears in the decorative marquee, so list it here. */}
      <ul className="sr-only" aria-label="Tooling and practices">
        {byLayer('tooling').map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </Chapter>
  );
}
