import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Footer() {
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="text-sm font-semibold text-foreground">{personalInfo.name}</span>
          <span className="text-xs text-muted-foreground">
            &copy; {year} {personalInfo.name}. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={personalInfo.socials.find((s) => s.icon === 'github')?.url}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={personalInfo.socials.find((s) => s.icon === 'linkedin')?.url}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            aria-label="Send email"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
          className="focus-ring flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Designed &amp; built with React + TypeScript
      </div>
    </footer>
  );
}
