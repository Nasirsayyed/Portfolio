import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { ContactForm } from '@/components/contact/ContactForm';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Build Something Great Together"
          description="Open to new full-stack opportunities — reach out directly or send a message below."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, x: -20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <a
              href={`mailto:${personalInfo.email}`}
              className="focus-ring flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="text-sm font-semibold text-foreground">{personalInfo.email}</p>
              </div>
            </a>

            <a
              href={`tel:${personalInfo.phone}`}
              className="focus-ring flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</p>
                <p className="text-sm font-semibold text-foreground">{personalInfo.phone}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground">{personalInfo.location}</p>
              </div>
            </div>

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
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, x: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
