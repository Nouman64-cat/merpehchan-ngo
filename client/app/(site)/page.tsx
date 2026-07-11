import { Hero } from "@/components/home/Hero";
import { ImpactStats } from "@/components/home/ImpactStats";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { CtaBanner } from "@/components/ui/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <AboutPreview />
      <ProgramsPreview />
      <TestimonialsSection />
      <GlobalPresence />
      <CtaBanner
        title="Your support keeps these programs running"
        description="Every donation goes directly toward free healthcare, education, and relief for families who need it most."
        primary={{ label: "Donate Now", href: "/donate" }}
        secondary={{ label: "Get in Touch", href: "/contact" }}
      />
    </>
  );
}
