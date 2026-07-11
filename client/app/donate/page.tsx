import type { Metadata } from "next";
import Link from "next/link";
import {
  FaHandHoldingHeart,
  FaChildren,
  FaBoxesPacking,
  FaHandshake,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { headOffice } from "@/lib/data/site";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Meri Pehchan Welfare Foundation's healthcare, education, and community programs. Contact our team for bank transfer details or ways to give.",
};

const waysToGive = [
  {
    icon: FaHandHoldingHeart,
    title: "General Donation",
    description:
      "Unrestricted gifts let us respond where the need is greatest, from a health camp running low on supplies to an emergency food package.",
  },
  {
    icon: FaChildren,
    title: "Sponsor a Child",
    description:
      "Provide ongoing support for a child's education, healthcare, and everyday needs through our orphan care program.",
  },
  {
    icon: FaBoxesPacking,
    title: "In-Kind Donations",
    description:
      "Contribute food packages, clothing, wheelchairs, or school supplies directly to families who need them.",
  },
  {
    icon: FaHandshake,
    title: "Corporate & Volunteer Partnerships",
    description:
      "Partner with us as an organization, or contribute your time and skills to our programs on the ground.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Your support keeps our programs running"
        description="Every contribution, large or small, goes directly toward free healthcare, education, and relief for families who need it most."
        image={unsplash("1454165804606-c3d57bc86b40", 1600, 900)}
        imageAlt="Meri Pehchan community relief work"
      />

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Ways To Give"
            title="Choose how you'd like to help"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {waysToGive.map((way) => (
              <div
                key={way.title}
                className="flex gap-5 rounded-2xl border border-black/5 bg-white p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <way.icon size={18} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {way.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {way.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary-900 py-20">
        <Container className="mx-auto max-w-2xl text-center">
          <h2 className="balance font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to donate?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            For bank transfers, international donations, or to set up
            recurring support, please contact our head office directly. Our
            team will confirm current, verified account details and help you
            choose the program that matches your goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${headOffice.emails[0]}?subject=${encodeURIComponent(
                "Donation Inquiry"
              )}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-primary-900 transition-colors hover:bg-accent-600"
            >
              <FaEnvelope size={14} />
              Email Us
            </a>
            <a
              href={`tel:${headOffice.phones[1].replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <FaPhone size={14} />
              Call {headOffice.phones[1]}
            </a>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Prefer to fill out a form instead?{" "}
            <Link href="/contact" className="font-semibold text-accent-400 hover:underline">
              Contact us here
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
