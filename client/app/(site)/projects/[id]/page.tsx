import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { getPublicProject, getPublicProjects } from "@/lib/projects";
import { getPublicTeam } from "@/lib/team";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { unsplash } from "@/lib/images";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublicProject(id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

function formatProjectDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, allProjects, team] = await Promise.all([
    getPublicProject(id),
    getPublicProjects(),
    getPublicTeam(),
  ]);

  if (!project) {
    notFound();
  }

  const heroImage = project.images[0]?.url ?? unsplash("1543269865-cbf427effbad", 1600, 900);
  const otherProjects = allProjects.filter((item) => item._id !== project._id);
  const projectTeam = team.filter((member) => project.team_member_ids.includes(member._id));
  const embedUrl = project.youtube_url ? getYoutubeEmbedUrl(project.youtube_url) : null;

  return (
    <>
      <PageHero
        eyebrow="Our Projects"
        title={project.title}
        description={formatProjectDate(project.date)}
        image={heroImage}
        imageAlt={project.title}
      />

      <section className="py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">
              {project.description}
            </div>

            {embedUrl ? (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
                <iframe
                  src={embedUrl}
                  title={`${project.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : null}

            {project.images.length > 0 ? (
              <div className="mt-8">
                <h3 className="font-display text-lg font-bold text-ink">Photos</h3>
                <div className="mt-4">
                  <GalleryLightbox
                    images={project.images.map((image) => ({
                      id: image.key,
                      src: image.url,
                      alt: project.title,
                    }))}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            {project.areas.length > 0 ? (
              <div className="rounded-2xl border border-black/5 bg-paper-muted p-8">
                <h3 className="font-display text-lg font-bold text-ink">
                  Focus Areas
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.areas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-500"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {projectTeam.length > 0 ? (
              <div className="rounded-2xl border border-black/5 bg-paper-muted p-8">
                <h3 className="font-display text-lg font-bold text-ink">
                  Project Team
                </h3>
                <ul className="mt-4 space-y-3">
                  {projectTeam.map((member) => (
                    <li key={member._id} className="flex items-center gap-3">
                      {member.photo_url ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={member.photo_url}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-500">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-ink">{member.name}</p>
                        <p className="text-xs text-ink-soft">{member.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href="/donate"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-primary-900 transition-colors hover:bg-accent-600"
            >
              Support This Project
            </Link>
          </aside>
        </Container>
      </section>

      {otherProjects.length > 0 ? (
        <section className="bg-paper-muted py-20">
          <Container>
            <h2 className="font-display text-2xl font-bold text-ink">
              Explore other projects
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.slice(0, 3).map((item) => (
                <ProjectCard key={item._id} project={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBanner
        title="Your support keeps this project running"
        description="Every donation goes directly toward delivering this project to more families."
        primary={{ label: "Donate Now", href: "/donate" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
