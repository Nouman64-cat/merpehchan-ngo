import Link from "next/link";
import Image from "next/image";
import { HiOutlineFolderOpen } from "react-icons/hi2";
import type { PublicProject } from "@/lib/projects";

export function ProjectCard({ project }: { project: PublicProject }) {
  const thumbnail = project.images[0];

  return (
    <Link
      href={`/projects/${project._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow hover:shadow-lg hover:shadow-primary-900/10"
    >
      <div className="relative h-48 w-full overflow-hidden bg-paper-muted">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-200">
            <HiOutlineFolderOpen size={40} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {project.areas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.areas.slice(0, 3).map((area) => (
              <span
                key={area}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500"
              >
                {area}
              </span>
            ))}
          </div>
        ) : null}
        <h3 className="mt-4 font-display text-lg font-bold text-ink">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">
          {project.description}
        </p>
        <span className="mt-4 text-sm font-semibold text-primary-500 group-hover:underline">
          Learn more →
        </span>
      </div>
    </Link>
  );
}
