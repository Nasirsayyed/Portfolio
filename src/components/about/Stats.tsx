import { stats } from '@/data/portfolio';
import { useCountUp } from '@/hooks/useCountUp';

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const { value: animated, ref } = useCountUp(value);

  return (
    <div ref={ref} className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
      <div className="text-gradient-brand text-4xl font-extrabold tabular-nums sm:text-5xl">
        {animated}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
