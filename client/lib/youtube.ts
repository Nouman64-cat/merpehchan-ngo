/** Parses a pasted YouTube URL into an embeddable youtube-nocookie.com URL, or null if unparseable. */
export function getYoutubeEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  let videoId: string | null = null;

  if (parsed.hostname === "youtu.be") {
    videoId = parsed.pathname.slice(1);
  } else if (parsed.hostname.includes("youtube.com")) {
    if (parsed.pathname === "/watch") {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.slice("/embed/".length);
    } else if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.slice("/shorts/".length);
    }
  }

  if (!videoId) return null;

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
