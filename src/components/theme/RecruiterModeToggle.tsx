import { Briefcase } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export function RecruiterModeToggle() {
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const toggleRecruiterMode = useThemeStore((s) => s.toggleRecruiterMode);

  return (
    <button
      type="button"
      onClick={toggleRecruiterMode}
      role="switch"
      aria-checked={recruiterMode}
      className={`focus-ring flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-colors ${
        recruiterMode
          ? 'border-primary/50 bg-secondary text-primary'
          : 'border-border text-muted-foreground hover:text-foreground'
      }`}
      title="Recruiter Mode reorganizes the site around Experience, Skills, Projects, Resume, and Contact, and reduces decorative animation."
    >
      <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
      Recruiter Mode
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${recruiterMode ? 'bg-primary' : 'bg-border'}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
            recruiterMode ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}
