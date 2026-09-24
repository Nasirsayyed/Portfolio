import { ArrowUp, TerminalSquare } from 'lucide-react';
import { chapters } from '@/data/navigation';
import { personalInfo } from '@/data/portfolio';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { scrollToSection } from '@/utils/scroll';

export function Footer() {
  const reduceMotion = useReducedMotion();
  const time = useLocalTime(personalInfo.timeZone);
  const setTerminalOpen = useUiStore((s) => s.setTerminalOpen);
  const year = new Date().getFullYear();
  const external = personalInfo.socials.filter((s) => s.url.startsWith('http'));

  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-4xl leading-none text-foreground">
            {personalInfo.name.split(' ')[0]} <em className="italic">{personalInfo.name.split(' ').slice(1).join(' ')}</em>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{personalInfo.valueProposition}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <p className="label text-muted-foreground">Index</p>
          <ol className="mt-3 grid grid-cols-2 gap-x-6">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(chapter.id, reduceMotion);
                  }}
                  className="label flex min-h-8 items-center gap-2 text-foreground transition-colors hover:text-accent"
                >
                  <span className="text-muted-foreground">{chapter.number}</span>
                  {chapter.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end lg:text-right">
          <div>
            <p className="label text-muted-foreground">Local time</p>
            <p className="mt-2 font-mono text-2xl tabular-nums text-foreground">
              <time aria-label={`${personalInfo.city} local time ${time}`}>{time}</time>{' '}
              <span className="label text-muted-foreground">
                {personalInfo.city} · {personalInfo.timeZoneLabel}
              </span>
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            {external.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="label text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-foreground/10">
        <div className="container label flex flex-wrap items-center justify-between gap-4 py-6 text-muted-foreground">
          <span>
            © {year} {personalInfo.name}
          </span>
          <button
            type="button"
            onClick={() => setTerminalOpen(true)}
            className="label inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" />
            Open dev terminal
          </button>
          <span className="hidden md:inline">React · three.js · GLSL — press ⌘K</span>
          <a
            href="#boot"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('boot', reduceMotion);
            }}
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
