import { experience } from '@/data/experience';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/experience/ExperienceCard';

export function ExperienceTimeline() {
  return (
    <section id="experience" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Career Journey"
          title="Experience"
          description="4+ years shipping production software — from SaaS platforms to enterprise dashboards."
        />

        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-border sm:block"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-8 sm:pl-8">
            {experience.map((entry, index) => (
              <div key={entry.id} className="relative">
                <span
                  className={`absolute -left-8 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 sm:block ${
                    entry.current ? 'border-primary bg-primary' : 'border-border bg-background'
                  }`}
                  aria-hidden="true"
                />
                <ExperienceCard entry={entry} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
