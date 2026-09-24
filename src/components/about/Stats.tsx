import { stats } from '@/data/portfolio';
import { useCountUp } from '@/hooks/useCountUp';
import { Reveal3D } from '@/components/ui/Reveal3D';
import { TiltCard } from '@/components/ui/TiltCard';

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const { value: animated, ref } = useCountUp(value);

  return (
    <TiltCard maxTilt={14} className="h-full rounded-xl border border-border bg-card shadow-card">
      <div ref={ref} className="depth-2 p-6 text-center">
        <div className="text-gradient-brand text-3d-glow text-4xl font-extrabold tabular-nums sm:text-5xl">
          {animated}
          {suffix}
        </div>
        <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
      </div>
    </TiltCard>
  );
}

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Reveal3D key={stat.label} delay={index * 0.08}>
          <StatCard {...stat} />
        </Reveal3D>
      ))}
    </div>
  );
}
