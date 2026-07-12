import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { TeamCard } from "@/components/team/TeamCard";
import { getPublicTeam } from "@/lib/team";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the leadership behind Meri Pehchan Welfare Foundation and the staff and volunteers who deliver our programs on the ground.",
};

export default async function TeamPage() {
  const team = await getPublicTeam();

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="The people driving our mission forward"
        description="Led by a small, committed leadership team and carried out by staff and volunteers on the ground."
        image={unsplash("1531983412531-1f49a365ffed", 1600, 900)}
        imageAlt="Meri Pehchan team at work"
      />

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="Executive team"
            align="center"
          />
          {team.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <TeamCard
                  key={member._id}
                  member={{
                    name: member.name,
                    role: member.role,
                    bio: member.bio,
                    photoUrl: member.photo_url,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-sm text-ink-soft">
              Team information is being updated. Please check back soon.
            </p>
          )}
        </Container>
      </section>

      <section className="bg-paper-muted py-20">
        <Container className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Beyond Leadership"
            title="Staff and volunteers on the ground"
            align="center"
          />
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Our health camps, tailoring classes, and relief drives are carried
            out by a dedicated group of staff and community volunteers across
            every city we work in. If you&apos;d like to volunteer your time
            or skills, we&apos;d love to hear from you.
          </p>
        </Container>
      </section>

      <CtaBanner
        title="Interested in volunteering?"
        description="Reach out to our team to learn about current volunteering opportunities near you."
        primary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
