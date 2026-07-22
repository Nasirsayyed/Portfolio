import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import type { ExperienceEntry } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ExperienceCardProps {
  entry: ExperienceEntry;
  index: number;
}

export function ExperienceCard({ entry, index }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(entry.current);
  const reduceMotion = useReducedMotion();
  const panelId = `experience-panel-${entry.id}`;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.08 }}
      className={`group relative rounded-xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-7 ${
        entry.current ? 'border-primary/40' : 'border-border hover:border-primary/30'
      }`}
    >
      {entry.current ? (
        <Badge variant="solid" className="absolute -top-3 left-6">
          Current Role
        </Badge>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-foreground sm:text-xl">{entry.role}</h3>
          <p className="text-gradient-brand text-sm font-semibold sm:text-base">{entry.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right text-xs text-muted-foreground sm:text-sm">
          <span>{entry.period}</span>
          {entry.location ? (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {entry.location}
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{entry.summary}</p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="focus-ring mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary"
      >
        {expanded ? 'Hide' : 'Show'} key contributions
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2.5 border-l-2 border-border pl-4">
            {entry.highlights.map((point) => (
              <li key={point} className="text-sm leading-relaxed text-muted-foreground">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {entry.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
