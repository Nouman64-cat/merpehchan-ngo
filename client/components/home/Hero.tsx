import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { unsplash } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-primary-900">
      <Image
        src={unsplash("1576091160399-112ba8d25d1d", 1920, 1080)}
        alt="Meri Pehchan volunteers supporting the community"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/80 to-primary-900/30" />

      <Container className="relative py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
          Meri Pehchan Welfare Foundation
        </p>
        <h1 className="balance mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
          Restoring dignity. Rebuilding lives.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
          A non-political, non-governmental, non-profit organization
          delivering free healthcare, education, and humanitarian support to
          Pakistan&apos;s most vulnerable communities.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/donate" variant="secondary">
            Support Our Work
          </Button>
          <Button href="/about" variant="outline">
            Learn About Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
