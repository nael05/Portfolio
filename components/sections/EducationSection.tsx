"use client";

import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { GraduationCap, BookOpen } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
};

export function EducationSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  return (
    <section className="px-3 md:px-6 py-12">
      <div className="w-full max-w-[1280px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-extrabold tracking-tight text-balance mb-8"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {lang === 'en' ? 'Education' : 'Formation'}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.education.map((edu, i) => {
            const Icon = ICONS[edu.icon] || GraduationCap;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <SpotlightCard className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 flex items-center justify-center shrink-0">
                      <Icon size={24} className="text-accent-blue" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-lg">
                        {edu.title}
                      </h3>
                      <p className="text-secondary mt-1">{edu.institution}</p>
                      <span className="pill text-xs mt-3 inline-flex">
                        {edu.period}
                      </span>
                      {edu.details && (
                        <p className="text-secondary text-sm mt-2">
                          {edu.details}
                        </p>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
