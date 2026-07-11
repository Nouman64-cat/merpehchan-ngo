import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { programs } from "@/lib/data/programs";

export function ProgramsPreview() {
  return (
    <section className="bg-paper-muted py-20">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Programs built around real, everyday needs"
          description="From emergency relief to long-term skill building, every program exists to close a specific gap families in our communities face."
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </Container>
    </section>
  );
}
