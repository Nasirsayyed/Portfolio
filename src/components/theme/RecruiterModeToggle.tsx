import { useThemeStore } from '@/store/themeStore';

interface RecruiterModeToggleProps {
  /** `compact` drops the text label to fit the top bar on small screens. */
  variant?: 'full' | 'compact';
  className?: string;
}

export function RecruiterModeToggle({ variant = 'full', className = '' }: RecruiterModeToggleProps) {
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const toggleRecruiterMode = useThemeStore((s) => s.toggleRecruiterMode);

  return (
    <button
      type="button"
      onClick={toggleRecruiterMode}
      role="switch"
      aria-checked={recruiterMode}
      aria-label={variant === 'compact' ? 'Recruiter Mode' : undefined}
      title="Recruiter Mode: a flat, fast, résumé-first view with no 3D or motion."
      className={`label group inline-flex h-9 items-center gap-2.5 rounded-full border px-3 transition-colors ${
        recruiterMode ? 'border-accent/60 text-accent' : 'border-foreground/15 text-muted-foreground hover:text-foreground'
      } ${className}`}
    >
      {variant === 'full' ? <span>Recruiter mode</span> : null}
      <span
        aria-hidden="true"
        className={`relative h-3.5 w-6 rounded-full transition-colors ${recruiterMode ? 'bg-accent' : 'bg-foreground/25'}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-2.5 w-2.5 rounded-full transition-transform duration-300 ease-signal ${
            recruiterMode ? 'translate-x-2.5 bg-accent-foreground' : 'translate-x-0 bg-background'
          }`}
        />
      </span>
    </button>
  );
}
