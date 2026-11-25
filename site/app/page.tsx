import { ArtShowcase } from "@/components/home/ArtShowcase";
import { Hero } from "@/components/home/Hero";
import { LaunchShowcase } from "@/components/home/LaunchShowcase";
import { LogoShowcase } from "@/components/home/LogoShowcase";
import { SetupSection } from "@/components/home/SetupSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ArtShowcase />
      <LaunchShowcase />
      <LogoShowcase />
      <SetupSection />
    </>
  );
}
