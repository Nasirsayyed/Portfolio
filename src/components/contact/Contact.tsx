import type { ReactNode } from 'react';
import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { Reveal3D } from '@/components/ui/Reveal3D';
import { TiltCard } from '@/components/ui/TiltCard';
import { ContactForm } from '@/components/contact/ContactForm';

function ContactTile({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <>
      <span className="depth-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="depth-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{children}</p>
      </div>
    </>
  );
}

const tileClass =
  'rounded-xl border border-border bg-card shadow-card transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-glow';
const tileInner = 'focus-ring preserve-3d flex items-center gap-4 rounded-xl p-5';

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Build Something Great Together"
          description="Open to new full-stack opportunities — reach out directly or send a message below."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal3D from="left" className="flex flex-col gap-4">
            <TiltCard maxTilt={12} className={tileClass}>
              <a href={`mailto:${personalInfo.email}`} className={tileInner}>
                <ContactTile icon={Mail} label="Email">
                  {personalInfo.email}
                </ContactTile>
              </a>
            </TiltCard>

            <TiltCard maxTilt={12} className={tileClass}>
              <a href={`tel:${personalInfo.phone}`} className={tileInner}>
                <ContactTile icon={Phone} label="Phone">
                  {personalInfo.phone}
                </ContactTile>
              </a>
            </TiltCard>

            <TiltCard maxTilt={12} className={tileClass}>
              <div className={tileInner}>
                <ContactTile icon={MapPin} label="Location">
                  {personalInfo.location}
                </ContactTile>
              </div>
            </TiltCard>

            <div className="flex gap-3 pt-2">
              {personalInfo.socials
                .filter((s) => s.icon === 'github' || s.icon === 'linkedin' || s.icon === 'code')
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                ))}
            </div>
          </Reveal3D>

          {/* The form swings in but doesn't tilt — a moving target is miserable to type into. */}
          <Reveal3D from="right" delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              <ContactForm />
            </div>
          </Reveal3D>
        </div>
      </div>
    </section>
  );
}
