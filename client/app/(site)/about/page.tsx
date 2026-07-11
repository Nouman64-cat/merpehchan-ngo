import type { Metadata } from "next";
import Image from "next/image";
import { FaBookMedical, FaGraduationCap, FaHandsHoldingChild } from "react-icons/fa6";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { unsplash } from "@/lib/images";
import { offices } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meri Pehchan Welfare Foundation is a Lahore-based, non-political, non-governmental organization providing free healthcare, education, and humanitarian assistance.",
};

const focusAreas = [
  {
    icon: FaBookMedical,
    title: "Free Healthcare",
    description:
      "Health camps, mobile clinics, and community care for families who can't afford private treatment.",
  },
  {
    icon: FaGraduationCap,
    title: "Free Education",
    description:
      "School support and learning resources so a family's income never decides a child's schooling.",
  },
  {
    icon: FaHandsHoldingChild,
    title: "Skill Development",
    description:
      "Vocational training, starting with sewing and tailoring, that leads to real, sustainable income.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Humanitarian work built for the long term"
        description="A non-political, non-governmental, non-profit organization committed to serving vulnerable and marginalized communities."
        image={unsplash("1509099836639-18ba1795216d", 1600, 900)}
        imageAlt="Meri Pehchan community outreach"
      />

      <section className="py-20">
        <Container className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Our Story" title="Why Meri Pehchan exists" />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-soft">
            <p>
              Pakistan&apos;s rising inflation and poverty have made basic
              essentials — healthcare, education, and even a stable meal —
              harder to reach for millions of families. When political and
              civil institutions struggle to keep pace with these challenges,
              the gap is often filled by community-driven organizations
              willing to work directly with the people affected.
            </p>
            <p>
              Meri Pehchan Welfare Foundation was created to operate at a
              national level and provide humanitarian assistance to the most
              vulnerable and needy segments of society. We focus on practical,
              hands-on solutions — free medical care, vocational training, and
              consistent support for widows, divorced women, and orphaned
              children — rather than one-time gestures.
            </p>
            <p>
              We are headquartered in Lahore and supported by a network of
              offices across Pakistan and abroad, all working toward the same
              goal: helping people rebuild stability and dignity on their own
              terms.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-paper-muted py-20">
        <Container>
          <SectionHeading
            eyebrow="Our Approach"
            title="Three pillars, one mission"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {focusAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl border border-black/5 bg-white p-8 text-center"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <area.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Where We Work"
              title="Rooted in Lahore, supporting families beyond it"
            />
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              Our head office in Wapda Town, Lahore, coordinates programs
              delivered on the ground across Pakistan, with a supporting
              office network extending to Islamabad, Sydney, Lahr, London,
              and Texas.
            </p>
            <ul className="mt-6 space-y-2">
              {offices.map((office) => (
                <li
                  key={office.city}
                  className="flex items-center justify-between border-b border-black/5 py-2 text-sm"
                >
                  <span className="font-semibold text-ink">
                    {office.city}, {office.country}
                  </span>
                  {office.isHeadOffice ? (
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500">
                      Head Office
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={unsplash("1487412720507-e7ab37603c6f", 900, 700)}
              alt="Meri Pehchan office team"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Want to see our work up close?"
        description="Get in touch with our team to learn more about our programs or how you can get involved."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "View Programs", href: "/programs" }}
      />
    </>
  );
}
