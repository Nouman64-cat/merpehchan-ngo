import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden bg-primary-900">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900/20" />
      <Container className="relative py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
          {eyebrow}
        </p>
        <h1 className="balance mt-2 max-w-2xl font-display text-4xl font-bold text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
