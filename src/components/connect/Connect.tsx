import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Copy, PenLine } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUiStore } from '@/store/uiStore';
import { Chapter, ChapterLabel } from '@/components/ui/Chapter';
import { Drawer } from '@/components/ui/Drawer';
import { Magnetic } from '@/components/ui/Magnetic';
import { ContactForm } from '@/components/connect/ContactForm';

const ease = [0.22, 1, 0.36, 1] as const;
const links = personalInfo.socials.filter((s) => s.icon !== 'mail');

export function Connect() {
  const reduceMotion = useReducedMotion();
  const contactOpen = useUiStore((s) => s.contactOpen);
  const setContactOpen = useUiStore((s) => s.setContactOpen);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2400);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      showToast('Email copied to clipboard');
    } catch {
      // Clipboard blocked (permissions, insecure context): fall back to the mail client.
      window.location.href = `mailto:${personalInfo.email}`;
    }
  };

  return (
    <Chapter id="connect" className="flex min-h-[100svh] flex-col">
      <div className="container flex flex-1 flex-col justify-center py-28 sm:py-36">
        <ChapterLabel id="connect" />
        <h2 className="mt-8 max-w-5xl font-display text-[clamp(3.25rem,8.5vw,8.5rem)] leading-[0.92] tracking-[-0.02em] text-foreground">
          Let&rsquo;s build something <em className="italic text-accent">solid.</em>
        </h2>

        <div className="mt-14 grid gap-12 border-t border-foreground/10 pt-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label text-muted-foreground">Write to me</p>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="link"
              className="group mt-4 flex max-w-full items-center gap-4 text-left"
              aria-label={`Copy email address ${personalInfo.email}`}
            >
              <span className="truncate font-mono text-[clamp(1.1rem,2.6vw,2rem)] tracking-tight text-foreground underline decoration-foreground/20 underline-offset-8 transition-colors group-hover:decoration-accent">
                {personalInfo.email}
              </span>
              <span className="label inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                <Copy className="h-3 w-3" aria-hidden="true" /> Copy
              </span>
            </button>
            <p className="mt-5 max-w-md text-muted-foreground">
              {personalInfo.availability} — full-time roles or freelance builds. Based in {personalInfo.city}, India,
              working with teams anywhere.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5 lg:items-end">
            <Magnetic>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                aria-haspopup="dialog"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-accent px-7 text-lg font-medium text-accent-foreground transition-[filter] hover:brightness-110"
              >
                <PenLine className="h-4 w-4" aria-hidden="true" />
                Send a message
              </button>
            </Magnetic>
            <ul className="flex flex-wrap gap-2 lg:justify-end" aria-label="Elsewhere">
              {links.map((social) => (
                <li key={social.label}>
                  <Magnetic strength={0.4}>
                    <a
                      href={social.url}
                      target={social.url.startsWith('http') ? '_blank' : undefined}
                      rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                      className="label inline-flex h-10 items-center gap-1.5 rounded-full border border-foreground/15 bg-background/70 px-4 text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {social.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Drawer
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Send a message"
        eyebrow="07 / Connect"
      >
        <ContactForm />
      </Drawer>

      <div role="status" aria-live="polite" className="sr-only">
        {toast}
      </div>
      <AnimatePresence>
        {toast && (
          <m.div
            aria-hidden="true"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
            className="label fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-foreground px-4 py-2.5 text-background shadow-lg"
          >
            {toast}
          </m.div>
        )}
      </AnimatePresence>
    </Chapter>
  );
}
