import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getPublicProjects } from "@/lib/projects";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Meri Pehchan Welfare Foundation's projects: free healthcare, women empowerment, orphan and widow care, and community services.",
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Projects built around real, everyday needs"
        description="From emergency relief to long-term skill building, each project closes a specific gap families in our communities face."
        image={unsplash("1543269865-cbf427effbad", 1600, 900)}
        imageAlt="Meri Pehchan project activities"
      />

      <section className="py-20">
        <Container>
          {projects.length === 0 ? (
            <p className="text-center text-sm text-ink-soft">
              No projects to show yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBanner
        title="Help us reach more families"
        description="Your contribution directly funds these projects — from a single health camp to a child's full year of schooling."
        primary={{ label: "Donate Now", href: "/donate" }}
      />
    </>
  );
}
