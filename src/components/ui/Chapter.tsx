import type { ReactNode } from 'react';
import { chapterById, chapterCount } from '@/data/navigation';

interface ChapterProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Visible title text; used to label the landmark for assistive tech. */
  title?: string;
}

/** A top-level page chapter: a labelled landmark carrying `data-chapter` for the Signal field. */
export function Chapter({ id, children, className = '', title }: ChapterProps) {
  const chapter = chapterById(id);
  return (
    <section
      id={id}
      data-chapter={id}
      aria-label={title ?? chapter?.label}
      className={`relative scroll-mt-16 outline-none ${className}`}
    >
      {children}
    </section>
  );
}

/** `[ 03 / 07 ]  STACK` */
export function ChapterLabel({ id, className = '' }: { id: string; className?: string }) {
  const chapter = chapterById(id);
  if (!chapter) return null;
  return (
    <p className={`label flex items-center gap-3 text-muted-foreground ${className}`}>
      <span>
        [ <span className="text-accent">{chapter.number}</span> / {chapterCount} ]
      </span>
      <span className="h-px w-8 bg-foreground/20" aria-hidden="true" />
      <span className="text-foreground">{chapter.label}</span>
    </p>
  );
}
