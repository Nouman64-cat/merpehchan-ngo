import { API_BASE_URL } from "@/lib/config";

export type PublicProjectImage = {
  url: string;
  key: string;
};

export type PublicProject = {
  _id: string;
  title: string;
  description: string;
  date: string;
  areas: string[];
  team_member_ids: string[];
  youtube_url: string | null;
  images: PublicProjectImage[];
  display_order: number;
};

/** Fetches active projects, newest first, from the backend for public display. */
export async function getPublicProjects(): Promise<PublicProject[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    // Backend unreachable — degrade to an empty list rather than a 500.
    return [];
  }
}

/** Fetches a single active project by id. Returns null if missing, inactive, or unreachable. */
export async function getPublicProject(id: string): Promise<PublicProject | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
