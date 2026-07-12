import { API_BASE_URL } from "@/lib/config";

export type PublicTeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
};

/** Fetches the active team roster from the backend for public display. */
export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/team`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    // Backend unreachable — degrade to an empty roster rather than a 500.
    return [];
  }
}
