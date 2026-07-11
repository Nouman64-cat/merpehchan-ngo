import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { unsplash } from "@/lib/images";

export function AboutPreview() {
  return (
    <section className="py-20">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={unsplash("1519389950473-47ba0277781c", 900, 700)}
            alt="Meri Pehchan team working with the community"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Who We Are
          </p>
          <h2 className="balance mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            A Lahore-based foundation serving Pakistan&apos;s most vulnerable
            communities
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Meri Pehchan Welfare Foundation was created to operate at a
            national level, providing humanitarian assistance to people who
            are too often overlooked. Rising inflation and poverty have made
            everyday essentials, healthcare, and education harder to reach
            for millions of families, and we work to close that gap directly
            — through free medical care, vocational training, and consistent
            support for widows, divorced women, and orphaned children.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            We operate from our head office in Lahore with a presence across
            Pakistan and abroad, driven by a simple belief: real change comes
            from showing up consistently for the people who need it most.
          </p>
          <div className="mt-8">
            <Button href="/about" variant="primary">
              More About Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
