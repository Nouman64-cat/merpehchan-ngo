import { API_BASE_URL } from "@/lib/config";

export type PublicEventPhoto = {
  url: string;
  key: string;
};

export type PublicEvent = {
  _id: string;
  title: string;
  description: string | null;
  date: string;
  photos: PublicEventPhoto[];
  display_order: number;
};

/** Fetches active events, newest first, from the backend for public display. */
export async function getPublicEvents(): Promise<PublicEvent[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    // Backend unreachable — degrade to an empty list rather than a 500.
    return [];
  }
}
