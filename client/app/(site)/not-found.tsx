import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-32">
      <Container className="mx-auto max-w-lg text-center">
        <p className="font-display text-6xl font-bold text-primary-500">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">
          Page not found
        </h1>
        <p className="mt-3 text-base text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or may have
          moved.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </Container>
    </section>
  );
}
