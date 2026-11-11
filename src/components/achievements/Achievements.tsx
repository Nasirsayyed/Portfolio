import { useRef } from 'react';
import { achievements } from '@/data/portfolio';
import { achievementIcons } from '@/data/achievementIcons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Achievements() {
  const gridRef = useRef<HTMLDivElement>(null);
  useScrollReveal(gridRef);

  return (
    <section id="achievements" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Highlights"
          title="Professional Highlights"
          description="What stands out across the roles and platforms above."
        />

        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = achievementIcons[achievement.icon];
            return (
              <div key={achievement.title} data-reveal="tilt">
              <div
                className="group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{achievement.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{achievement.description}</p>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
