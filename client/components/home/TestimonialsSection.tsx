import { FaQuoteLeft } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Voices From The Community"
          title="The people behind the numbers"
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.attribution}
              className="flex flex-col rounded-2xl border border-black/5 bg-white p-6"
            >
              <FaQuoteLeft className="text-2xl text-primary-100" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {testimonial.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
