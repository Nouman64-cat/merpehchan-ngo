const QUALITY_PARAMS = "auto=format&fit=crop&q=80";

/** Builds a sized Unsplash CDN URL for a known photo id. */
export function unsplash(id: string, width: number, height: number): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&${QUALITY_PARAMS}`;
}
