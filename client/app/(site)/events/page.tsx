import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { getPublicEvents } from "@/lib/events";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Events",
  description:
    "A look at Meri Pehchan Welfare Foundation's health camps, education programs, women empowerment classes, and community relief work.",
};

function formatEventDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function EventsPage() {
  const events = await getPublicEvents();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Our work, in pictures"
        description="A glimpse into the health camps, classrooms, and relief drives happening across our communities."
        image={unsplash("1600880292203-757bb62b4baf", 1600, 900)}
        imageAlt="Meri Pehchan community program"
      />

      <section className="py-20">
        <Container className="space-y-16">
          {events.length === 0 ? (
            <p className="text-center text-sm text-ink-soft">
              No events to show yet — check back soon.
            </p>
          ) : (
            events.map((event) => (
              <div key={event._id}>
                <h2 className="font-display text-2xl font-bold text-ink">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-primary-500">
                  {formatEventDate(event.date)}
                </p>
                {event.description ? (
                  <p className="mt-3 max-w-3xl text-ink-soft">{event.description}</p>
                ) : null}
                {event.photos.length > 0 ? (
                  <div className="mt-6">
                    <GalleryLightbox
                      images={event.photos.map((photo) => ({
                        id: photo.key,
                        src: photo.url,
                        alt: event.title,
                      }))}
                    />
                  </div>
                ) : null}
              </div>
            ))
          )}
        </Container>
      </section>

      <CtaBanner
        title="Be part of the next chapter"
        description="Your support helps us reach more families and add more stories to this page."
        primary={{ label: "Donate Now", href: "/donate" }}
      />
    </>
  );
}
