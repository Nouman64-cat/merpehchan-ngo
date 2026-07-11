import Link from "next/link";
import Image from "next/image";
import {
  FaStethoscope,
  FaScissors,
  FaChildren,
  FaBoxesPacking,
} from "react-icons/fa6";
import type { Program } from "@/lib/data/programs";

const iconMap = {
  healthcare: FaStethoscope,
  women: FaScissors,
  orphan: FaChildren,
  community: FaBoxesPacking,
} as const;

export function ProgramCard({ program }: { program: Program }) {
  const Icon = iconMap[program.icon];

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow hover:shadow-lg hover:shadow-primary-900/10"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={program.image}
          alt={program.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <Icon size={18} />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-ink">
          {program.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {program.summary}
        </p>
        <span className="mt-4 text-sm font-semibold text-primary-500 group-hover:underline">
          Learn more →
        </span>
      </div>
    </Link>
  );
}
