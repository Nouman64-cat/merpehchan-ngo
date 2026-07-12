export const site = {
  name: "Meri Pehchan Welfare Foundation",
  shortName: "Meri Pehchan",
  tagline: "Restoring dignity. Rebuilding lives.",
  description:
    "Meri Pehchan Welfare Foundation is a non-political, non-governmental, non-profit organization based in Lahore, Pakistan, providing free healthcare, education, and humanitarian assistance to vulnerable and marginalized communities.",
  url: "https://meripehchanpk.com",
} as const;

export const headOffice = {
  label: "Head Office — Lahore",
  address: "19-N3, Wapda Town Phase 2, Lahore, Pakistan",
  phones: ["042-35245209", "0300-9682810"],
  emails: ["info@meripehchanpk.com", "shahidanaveed@meripehchanpk.com"],
  mapEmbedQuery: "19-N3 Wapda Town Phase 2 Lahore Pakistan",
} as const;

export const offices = [
  {
    city: "Lahore",
    country: "Pakistan",
    isHeadOffice: true,
    address: "19-N3, Wapda Town Phase 2, Lahore",
  },
  {
    city: "Islamabad",
    country: "Pakistan",
    isHeadOffice: false,
    address: "Islamabad, Pakistan",
  },
  {
    city: "Sydney",
    country: "Australia",
    isHeadOffice: false,
    address: "3-5 Ashburton, Blaxland Ave, Newington NSW 2127",
  },
  {
    city: "Lahr",
    country: "Germany",
    isHeadOffice: false,
    address: "Bertha-von-Suttner-Allee 4, 77933 Lahr",
  },
  {
    city: "London",
    country: "United Kingdom",
    isHeadOffice: false,
    address: "28 Newfield Road, Aldershot, GU12 5LG",
  },
  {
    city: "Texas",
    country: "United States",
    isHeadOffice: false,
    address: "Texas, USA",
  },
] as const;

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/pehchanmeripakistan99",
    icon: "facebook",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/PehchanMeriPak",
    icon: "twitter",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@meripehchanwelfarefoundati281",
    icon: "youtube",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mpw_foundation/",
    icon: "instagram",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/meripehchanpk/",
    icon: "pinterest",
  },
] as const;

export const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [{ label: "Our Team", href: "/team" }],
  },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;

/** Flat link list for the footer, which has no room for nested dropdowns. */
export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;
