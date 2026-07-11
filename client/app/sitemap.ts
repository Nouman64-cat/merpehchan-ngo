import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { programs } from "@/lib/data/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/programs",
    "/team",
    "/gallery",
    "/contact",
    "/donate",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const programRoutes = programs.map((program) => ({
    url: `${site.url}/programs/${program.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...programRoutes];
}
