import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { programs, getProgramBySlug } from "@/lib/data/programs";

type ProgramPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    return { title: "Program Not Found" };
  }

  return {
    title: program.title,
    description: program.summary,
  };
}

export default async function ProgramDetailPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const otherPrograms = programs.filter((item) => item.slug !== program.slug);

  return (
    <>
      <PageHero
        eyebrow="Our Programs"
        title={program.title}
        description={program.summary}
        image={program.image}
        imageAlt={program.imageAlt}
      />

      <section className="py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-5 text-base leading-relaxed text-ink-soft">
              {program.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src={program.image}
                alt={program.imageAlt}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <aside className="rounded-2xl border border-black/5 bg-paper-muted p-8">
            <h3 className="font-display text-lg font-bold text-ink">
              What this includes
            </h3>
            <ul className="mt-4 space-y-3">
              {program.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm text-ink-soft">
                  <FaCheck className="mt-1 shrink-0 text-primary-500" size={13} />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/donate"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-primary-900 transition-colors hover:bg-accent-600"
            >
              Support This Program
            </Link>
          </aside>
        </Container>
      </section>

      <section className="bg-paper-muted py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold text-ink">
            Explore other programs
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherPrograms.map((item) => (
              <ProgramCard key={item.slug} program={item} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Your support keeps this program running"
        description="Every donation goes directly toward delivering this program to more families."
        primary={{ label: "Donate Now", href: "/donate" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
