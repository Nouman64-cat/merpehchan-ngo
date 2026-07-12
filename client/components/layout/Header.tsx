"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HiBars3, HiChevronDown, HiXMark } from "react-icons/hi2";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { navLinks } from "@/lib/data/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const pathname = usePathname();

  function isLinkActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function closeMobileMenu() {
    setIsOpen(false);
    setExpandedHref(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) =>
            "children" in link ? (
              <NavDropdown
                key={link.href}
                label={link.label}
                href={link.href}
                items={link.children}
                isActive={
                  isLinkActive(link.href) ||
                  link.children.some((child) => isLinkActive(child.href))
                }
              />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  isLinkActive(link.href) ? "text-primary-500" : "text-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
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
          onClick={() => (isOpen ? closeMobileMenu() : setIsOpen(true))}
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
            {navLinks.map((link) =>
              "children" in link ? (
                <div key={link.href}>
                  <div className="flex items-center rounded-md hover:bg-paper-muted">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex-1 px-2 py-2.5 text-sm font-medium text-ink-soft hover:text-primary-500"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedHref((current) =>
                          current === link.href ? null : link.href
                        )
                      }
                      aria-label={`${expandedHref === link.href ? "Collapse" : "Expand"} ${link.label} menu`}
                      aria-expanded={expandedHref === link.href}
                      className="p-2.5 text-ink-soft hover:text-primary-500"
                    >
                      <HiChevronDown
                        size={18}
                        className={`transition-transform ${
                          expandedHref === link.href ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {expandedHref === link.href ? (
                    <div className="flex flex-col gap-1 pb-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className="block rounded-md px-6 py-2 text-sm font-medium text-ink-soft/80 hover:bg-paper-muted hover:text-primary-500"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-muted hover:text-primary-500"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/donate"
              onClick={closeMobileMenu}
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
