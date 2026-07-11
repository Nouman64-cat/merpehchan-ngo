import type { Metadata } from "next";
import { FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { headOffice, offices } from "@/lib/data/site";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Meri Pehchan Welfare Foundation. Head office in Lahore, Pakistan, with offices across Pakistan, Australia, Europe, the UK, and the US.",
};

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  headOffice.mapEmbedQuery
)}&output=embed`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We'd like to hear from you"
        description="Questions about our programs, volunteering, or how to help? Reach out and our team will respond soon."
        image={unsplash("1531983412531-1f49a365ffed", 1600, 900)}
        imageAlt="Meri Pehchan team ready to help"
      />

      <section className="py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeading eyebrow="Send a Message" title="Get in touch" />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-black/5 bg-paper-muted p-8">
              <h3 className="font-display text-lg font-bold text-ink">
                {headOffice.label}
              </h3>
              <ul className="mt-5 space-y-4 text-sm text-ink-soft">
                <li className="flex gap-3">
                  <FaLocationDot className="mt-0.5 shrink-0 text-primary-500" />
                  <span>{headOffice.address}</span>
                </li>
                <li className="flex gap-3">
                  <FaPhone className="mt-0.5 shrink-0 text-primary-500" />
                  <span>{headOffice.phones.join(" · ")}</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="flex gap-3">
                    <FaEnvelope className="mt-0.5 shrink-0 text-primary-500" />
                    <span className="break-all">{headOffice.emails[0]}</span>
                  </span>
                  <span className="break-all pl-7">{headOffice.emails[1]}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-black/5">
              <iframe
                title="Meri Pehchan head office location"
                src={mapSrc}
                loading="lazy"
                className="h-72 w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper-muted py-20">
        <Container>
          <SectionHeading
            eyebrow="Our Offices"
            title="Reach us wherever you are"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div
                key={office.city}
                className="rounded-2xl border border-black/5 bg-white p-6"
              >
                <h3 className="font-display text-base font-bold text-ink">
                  {office.city}, {office.country}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{office.address}</p>
                {office.isHeadOffice ? (
                  <span className="mt-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500">
                    Head Office
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
