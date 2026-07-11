import { FaLocationDot } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { offices } from "@/lib/data/site";

export function GlobalPresence() {
  return (
    <section className="bg-primary-900 py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Reach"
          title="A local foundation with a global support network"
          description="Rooted in Lahore, with offices supporting our mission across Pakistan, Australia, Europe, the UK, and the US."
          align="center"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {offices.map((office) => (
            <div
              key={office.city}
              className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
            >
              <FaLocationDot className="mx-auto text-accent-400" size={18} />
              <p className="mt-2 font-display text-sm font-bold text-white">
                {office.city}
              </p>
              <p className="text-xs text-white/60">{office.country}</p>
              {office.isHeadOffice ? (
                <span className="mt-2 inline-block rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-semibold text-primary-900">
                  Head Office
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
