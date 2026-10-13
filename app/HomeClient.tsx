"use client";

import { GitHubRepo } from "@/lib/github";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { EngagementsSection } from "@/components/sections/EngagementsSection";
import { InterestsSection } from "@/components/sections/InterestsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

interface HomeClientProps {
  repos: GitHubRepo[];
}

export function HomeClient({ repos }: HomeClientProps) {
  return (
    <>
      <AuroraBackground />
      <Navigation />

      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection repos={repos} />
      <EngagementsSection />
      <InterestsSection />
      <ContactSection />
      <Footer />

      {/* Bottom spacer for mobile nav */}
      <div className="h-24 md:h-0" />
    </>
  );
}
