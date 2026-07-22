import { motion } from 'framer-motion';
import { Award, GraduationCap } from 'lucide-react';
import { certifications, education } from '@/data/portfolio';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Education() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="education" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow="Background" title="Education & Certifications" />

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Education
            </h3>
            <div className="flex flex-col gap-4">
              {education.map((entry) => (
                <div
                  key={entry.institution}
                  className="rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                >
                  <p className="text-base font-bold text-foreground">
                    {entry.degree}, {entry.field}
                  </p>
                  <p className="text-gradient-brand mt-1 text-sm font-semibold">{entry.institution}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{entry.period}</span>
                    {entry.detail ? <span className="font-semibold text-foreground">{entry.detail}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Award className="h-4 w-4" aria-hidden="true" />
              Certifications
            </h3>
            <div className="flex flex-col gap-4">
              {certifications.map((cert) => {
                const content = (
                  <>
                    <p className="text-base font-bold text-foreground">{cert.name}</p>
                    <p className="text-gradient-brand mt-1 text-sm font-semibold">{cert.issuer}</p>
                  </>
                );
                return cert.url ? (
                  <a
                    key={cert.name}
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={cert.name} className="rounded-xl border border-border bg-card p-6 shadow-card">
                    {content}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
