"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { navLinks } from "@/lib/data/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  isActive ? "text-primary-500" : "text-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-primary-900 transition-colors hover:bg-accent-600"
          >
            Donate Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-md p-2 text-ink lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <HiXMark size={26} /> : <HiBars3 size={26} />}
        </button>
      </Container>

      {isOpen ? (
        <div className="border-t border-black/5 bg-paper lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-muted hover:text-primary-500"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-primary-900"
            >
              Donate Now
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
