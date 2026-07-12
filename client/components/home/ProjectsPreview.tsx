import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getPublicProjects } from "@/lib/projects";

export async function ProjectsPreview() {
  const projects = (await getPublicProjects()).slice(0, 4);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-paper-muted py-20">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Projects built around real, everyday needs"
          description="From emergency relief to long-term skill building, every project exists to close a specific gap families in our communities face."
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
