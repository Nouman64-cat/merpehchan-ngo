import { unsplash } from "@/lib/images";

export type GalleryImage = {
  id: string;
  category: "Healthcare" | "Education & Orphan Care" | "Women Empowerment" | "Community Services";
  src: string;
  alt: string;
};

export const galleryImages: GalleryImage[] = [
  {
    id: "healthcare-1",
    category: "Healthcare",
    src: unsplash("1497486751825-1233686d5d80", 800, 600),
    alt: "Free health camp consultation",
  },
  {
    id: "healthcare-2",
    category: "Healthcare",
    src: unsplash("1544027993-37dbfe43562a", 800, 600),
    alt: "Community clinic in session",
  },
  {
    id: "healthcare-3",
    category: "Healthcare",
    src: unsplash("1576091160399-112ba8d25d1d", 800, 600),
    alt: "Volunteers preparing a medical camp",
  },
  {
    id: "education-1",
    category: "Education & Orphan Care",
    src: unsplash("1591123120675-6f7f1aae0e5b", 800, 600),
    alt: "Children in a classroom setting",
  },
  {
    id: "education-2",
    category: "Education & Orphan Care",
    src: unsplash("1531482615713-2afd69097998", 800, 600),
    alt: "Child reading a book",
  },
  {
    id: "education-3",
    category: "Education & Orphan Care",
    src: unsplash("1519791883288-dc8bd696e667", 800, 600),
    alt: "Children with school supplies",
  },
  {
    id: "women-1",
    category: "Women Empowerment",
    src: unsplash("1607748862156-7c548e7e98f4", 800, 600),
    alt: "Woman working at a sewing machine",
  },
  {
    id: "women-2",
    category: "Women Empowerment",
    src: unsplash("1509062522246-3755977927d7", 800, 600),
    alt: "Tailoring skills training session",
  },
  {
    id: "women-3",
    category: "Women Empowerment",
    src: unsplash("1560250097-0b93528c311a", 800, 600),
    alt: "Women in a vocational training group",
  },
  {
    id: "community-1",
    category: "Community Services",
    src: unsplash("1469571486292-0ba58a3f068b", 800, 600),
    alt: "Volunteers distributing supplies",
  },
  {
    id: "community-2",
    category: "Community Services",
    src: unsplash("1526976668912-1a811878dd37", 800, 600),
    alt: "Community food distribution drive",
  },
  {
    id: "community-3",
    category: "Community Services",
    src: unsplash("1508214751196-bcfd4ca60f91", 800, 600),
    alt: "Volunteers packing relief boxes",
  },
];

export const galleryCategories = [
  "Healthcare",
  "Education & Orphan Care",
  "Women Empowerment",
  "Community Services",
] as const;
