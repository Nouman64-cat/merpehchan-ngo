import { Container } from "@/components/ui/Container";

const YOUTUBE_VIDEO_ID = "Qo_xWXTvoOM";

export function VideoSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
            See Our Work
          </p>
          <h2 className="balance mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            A closer look at the impact we&apos;re making
          </h2>
        </div>

        <div className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg shadow-black/10">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`}
            title="Meri Pehchan Welfare Foundation video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </Container>
    </section>
  );
}
