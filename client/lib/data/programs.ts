import { unsplash } from "@/lib/images";

export type Program = {
  slug: string;
  title: string;
  icon: "healthcare" | "women" | "orphan" | "community";
  summary: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  highlights: string[];
};

export const programs: Program[] = [
  {
    slug: "healthcare",
    title: "Free Healthcare",
    icon: "healthcare",
    summary:
      "Free medical camps, mobile clinics, and community health services for families who would otherwise go without care.",
    image: unsplash("1584515933487-779824d29309", 1200, 800),
    imageAlt: "A volunteer doctor examining a patient at a free health camp",
    paragraphs: [
      "Access to a doctor shouldn't depend on income. Meri Pehchan runs free health camps and mobile clinics in underserved neighborhoods, bringing basic diagnostics, consultations, and medicine directly to people who can't afford private care.",
      "Our community clinics focus on the everyday health needs that get postponed the longest — maternal and child health checks, chronic disease management, and preventive screenings — because a small delay in treatment can turn into a much larger crisis for a low-income family.",
    ],
    highlights: [
      "Free medical camps in underserved communities",
      "Mobile clinics reaching remote and low-income areas",
      "Community clinics for ongoing, everyday care",
      "Wheelchairs and mobility aid distribution",
    ],
  },
  {
    slug: "women-empowerment",
    title: "Women Empowerment",
    icon: "women",
    summary:
      "Sewing and tailoring skill-share classes that give women a path to their own income and independence.",
    image: unsplash("1520006403909-838d6b92c22e", 1200, 800),
    imageAlt: "A woman learning tailoring skills at a sewing machine",
    paragraphs: [
      "In many of the communities we work in, women face real barriers to earning an independent income. Our skill-share classes teach sewing and tailoring — practical, marketable trades that women can turn into steady work from home or in a local shop.",
      "Beyond the skill itself, these classes create a space where women build confidence, support each other, and start to see a future that isn't entirely dependent on someone else's income.",
    ],
    highlights: [
      "Free sewing and tailoring classes",
      "Take-home vocational skills",
      "A supportive peer community for women",
      "A first step toward financial independence",
    ],
  },
  {
    slug: "orphan-and-widow-care",
    title: "Widows, Divorced Women & Orphan Care",
    icon: "orphan",
    summary:
      "Education, healthcare, food, and everyday care for orphaned children and the women raising them.",
    image: unsplash("1488521787991-ed7bbaae773c", 1200, 800),
    imageAlt: "A caregiver spending time with children",
    paragraphs: [
      "Losing a parent, a spouse, or a marriage often means losing a household's only income at the same time. Meri Pehchan supports widows, divorced women, and orphaned children with the essentials that keep a family from falling further behind — school fees and supplies, healthcare, nutritious food, clothing, and, for children, the toys and small comforts of a normal childhood.",
      "To date, this program has reached over 2,000 children with consistent, ongoing support rather than one-off aid, because rebuilding stability takes more than a single donation.",
    ],
    highlights: [
      "Quality education support for orphaned children",
      "Healthcare and nutrition for children and caregivers",
      "Clothing and essential supplies",
      "Ongoing, long-term support, not one-time aid",
    ],
  },
  {
    slug: "community-services",
    title: "Community Services",
    icon: "community",
    summary:
      "Food packages, Ramadan and holiday support, wheelchairs, and counseling for families in crisis.",
    image: unsplash("1593113630400-ea4288922497", 1200, 800),
    imageAlt: "Volunteers packing food donation boxes",
    paragraphs: [
      "Some needs are seasonal, some are urgent, and some are just about being there. We distribute food packages and Ramadan relief to families facing food insecurity, organize holiday gifts for children who would otherwise go without, and provide wheelchairs and mobility aids to people who need them.",
      "We also offer counseling support, recognizing that poverty and hardship take a toll that goes beyond the physical, and that people navigating a crisis need more than material aid to get through it.",
    ],
    highlights: [
      "Food packages for families in need",
      "Ramadan and holiday relief drives",
      "Wheelchairs and mobility aid",
      "Counseling and emotional support",
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
