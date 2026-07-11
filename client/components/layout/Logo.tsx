import Link from "next/link";
import { site } from "@/lib/data/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 font-display text-base font-bold text-white">
        MP
      </span>
      <span
        className={`font-display text-base font-bold leading-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {site.shortName}
        <span className="block text-xs font-medium tracking-wide text-accent-500">
          Welfare Foundation
        </span>
      </span>
    </Link>
  );
}
