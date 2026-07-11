import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { galleryCategories, galleryImages } from "@/lib/data/gallery";
import { unsplash } from "@/lib/images";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A look at Meri Pehchan Welfare Foundation's health camps, education programs, women empowerment classes, and community relief work.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our work, in pictures"
        description="A glimpse into the health camps, classrooms, and relief drives happening across our communities."
        image={unsplash("1600880292203-757bb62b4baf", 1600, 900)}
        imageAlt="Meri Pehchan community program"
      />

      <section className="py-20">
        <Container className="space-y-16">
          {galleryCategories.map((category) => (
            <div key={category}>
              <h2 className="font-display text-2xl font-bold text-ink">
                {category}
              </h2>
              <div className="mt-6">
                <GalleryLightbox
                  images={galleryImages.filter(
                    (image) => image.category === category
                  )}
                />
              </div>
            </div>
          ))}
        </Container>
      </section>

      <CtaBanner
        title="Be part of the next chapter"
        description="Your support helps us reach more families and add more stories to this gallery."
        primary={{ label: "Donate Now", href: "/donate" }}
      />
    </>
  );
}
