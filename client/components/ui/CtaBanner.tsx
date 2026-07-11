import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CtaBanner({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="bg-primary-500">
      <Container className="flex flex-col items-center gap-6 py-16 text-center">
        <h2 className="balance max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-white/85">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={primary.href} variant="secondary">
            {primary.label}
          </Button>
          {secondary ? (
            <Button href={secondary.href} variant="outline">
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
