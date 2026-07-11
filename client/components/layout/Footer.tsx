import Link from "next/link";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
  FaPinterestP,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { navLinks, headOffice, socialLinks, site } from "@/lib/data/site";
import { programs } from "@/lib/data/programs";

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  pinterest: FaPinterestP,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-primary-900 text-white">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {site.description}
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent-500 hover:text-primary-900"
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent-400">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/donate"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Donate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent-400">
            Our Programs
          </h3>
          <ul className="mt-4 space-y-2.5">
            {programs.map((program) => (
              <li key={program.slug}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {program.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent-400">
            Head Office
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <FaLocationDot className="mt-0.5 shrink-0 text-accent-400" />
              <span>{headOffice.address}</span>
            </li>
            <li className="flex gap-3">
              <FaPhone className="mt-0.5 shrink-0 text-accent-400" />
              <span>{headOffice.phones.join(" · ")}</span>
            </li>
            <li className="flex gap-3">
              <FaEnvelope className="mt-0.5 shrink-0 text-accent-400" />
              <span className="break-all">{headOffice.emails[0]}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>A non-political, non-governmental, non-profit organization</p>
        </Container>
      </div>
    </footer>
  );
}
