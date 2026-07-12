import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { getPublicProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/team",
    "/events",
    "/contact",
    "/donate",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const projects = await getPublicProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${site.url}/projects/${project._id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
