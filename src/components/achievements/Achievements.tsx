import { achievements } from '@/data/portfolio';
import { achievementIcons } from '@/data/achievementIcons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal3D } from '@/components/ui/Reveal3D';
import { TiltCard } from '@/components/ui/TiltCard';

export function Achievements() {
  return (
    <section id="achievements" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Highlights"
          title="Professional Highlights"
          description="What stands out across the roles and platforms above."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => {
            const Icon = achievementIcons[achievement.icon];
            return (
              <Reveal3D key={achievement.title} delay={(index % 3) * 0.1} className="h-full">
                <TiltCard
                  maxTilt={12}
                  className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-glow"
                >
                  {/* Icon tile floats furthest forward, then title, then body copy. */}
                  <span className="depth-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="depth-2 mt-4 text-base font-bold text-foreground">{achievement.title}</h3>
                  <p className="depth-1 mt-2 text-sm leading-relaxed text-muted-foreground">{achievement.description}</p>
                </TiltCard>
              </Reveal3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
