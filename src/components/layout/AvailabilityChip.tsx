import { personalInfo } from '@/data/portfolio';
import { useLocalTime } from '@/hooks/useLocalTime';

/** "● Available for work · Sangli · IST 20:18" with a live clock. */
export function AvailabilityChip({ className = '' }: { className?: string }) {
  const time = useLocalTime(personalInfo.timeZone);

  return (
    <p className={`label inline-flex items-center gap-2 text-muted-foreground ${className}`}>
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-accent" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="text-foreground">{personalInfo.availability}</span>
      <span aria-hidden="true">·</span>
      <span>{personalInfo.city}</span>
      <span aria-hidden="true">·</span>
      <span>
        {personalInfo.timeZoneLabel}{' '}
        <time className="tabular-nums" aria-label={`Local time ${time}`}>
          {time}
        </time>
      </span>
    </p>
  );
}
