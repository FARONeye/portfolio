"use client";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import GlobeIntro from "@/components/GlobeIntro";
import ParallaxBand from "@/components/ParallaxBand";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />

      {/* Intro 3D verrouillée */}
      <GlobeIntro />

      {/* Ancre cible quand l’intro est terminée */}
      <div id="after-intro" className="pt-[220px] -mt-[220px]" />

      {/* Portfolio */}
      <ParallaxBand />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />

      <footer className="py-10 text-center text-[#666] text-sm border-t border-[#4B0D1A]/40">
        © {new Date().getFullYear()} Mathis Truong — Art, Code & Emotion.
      </footer>
    </main>
  );
}
