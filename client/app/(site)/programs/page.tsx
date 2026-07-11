import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { programs } from "@/lib/data/programs";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Programs",
  description:
    "Explore Meri Pehchan Welfare Foundation's core programs: free healthcare, women empowerment, orphan and widow care, and community services.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Programs built around real, everyday needs"
        description="From emergency relief to long-term skill building, each program closes a specific gap families in our communities face."
        image={unsplash("1543269865-cbf427effbad", 1600, 900)}
        imageAlt="Meri Pehchan program activities"
      />

      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Help us reach more families"
        description="Your contribution directly funds these programs — from a single health camp to a child's full year of schooling."
        primary={{ label: "Donate Now", href: "/donate" }}
      />
    </>
  );
}
