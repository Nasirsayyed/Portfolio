import { Award, ExternalLink, GraduationCap } from 'lucide-react';
import { certifications, education } from '@/data/portfolio';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal3D } from '@/components/ui/Reveal3D';
import { TiltCard } from '@/components/ui/TiltCard';

const cardClass =
  'rounded-xl border border-border bg-card shadow-card transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-glow';

export function Education() {
  return (
    <section id="education" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow="Background" title="Education & Certifications" />

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          <Reveal3D from="left">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Education
            </h3>
            <div className="flex flex-col gap-4">
              {education.map((entry) => (
                <TiltCard key={entry.institution} className={`${cardClass} p-6`}>
                  <p className="depth-2 text-base font-bold text-foreground">
                    {entry.degree}, {entry.field}
                  </p>
                  <p className="text-gradient-brand depth-1 mt-1 text-sm font-semibold">{entry.institution}</p>
                  <div className="depth-1 mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{entry.period}</span>
                    {entry.detail ? (
                      <span className="depth-2 rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground">
                        {entry.detail}
                      </span>
                    ) : null}
                  </div>
                </TiltCard>
              ))}
            </div>
          </Reveal3D>

          <Reveal3D from="right" delay={0.1}>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Award className="h-4 w-4" aria-hidden="true" />
              Certifications
            </h3>
            <div className="flex flex-col gap-4">
              {certifications.map((cert) => {
                const content = (
                  <>
                    <p className="depth-2 flex items-center justify-between gap-2 text-base font-bold text-foreground">
                      {cert.name}
                      {cert.url ? <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : null}
                    </p>
                    <p className="text-gradient-brand depth-1 mt-1 text-sm font-semibold">{cert.issuer}</p>
                  </>
                );
                return (
                  <TiltCard key={cert.name} className={cardClass}>
                    {cert.url ? (
                      <a href={cert.url} target="_blank" rel="noreferrer" className="focus-ring preserve-3d block rounded-xl p-6">
                        {content}
                      </a>
                    ) : (
                      <div className="preserve-3d p-6">{content}</div>
                    )}
                  </TiltCard>
                );
              })}
            </div>
          </Reveal3D>
        </div>
      </div>
    </section>
  );
}
