import { Container } from "@/components/ui/Container";
import { stats } from "@/lib/data/stats";

export function ImpactStats() {
  return (
    <section className="border-b border-black/5 bg-white">
      <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="font-display text-3xl font-bold text-primary-500 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
