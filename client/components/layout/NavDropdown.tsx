"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiChevronDown } from "react-icons/hi2";

type NavChild = { label: string; href: string };

export function NavDropdown({
  label,
  href,
  items,
  isActive,
}: {
  label: string;
  href: string;
  items: readonly NavChild[];
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-500 ${
          isActive ? "text-primary-500" : "text-ink-soft"
        }`}
      >
        {label}
        <HiChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-10 mt-3 w-48 overflow-hidden rounded-xl border border-black/5 bg-white py-2 shadow-lg">
          <Link
            href={href}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper-muted hover:text-primary-500"
          >
            Overview
          </Link>
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper-muted hover:text-primary-500"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
