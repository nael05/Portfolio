"use client";

import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Brain, Code2, Wrench, Languages, UserCheck } from "lucide-react";

export function SkillsSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  return (
    <section id="skills" className="px-3 md:px-6 py-12">
      <div className="w-full max-w-[1280px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-extrabold tracking-tight text-balance mb-12"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {lang === 'en' ? 'Skills' : 'Compétences'}
          </h2>
        </Reveal>

        <Reveal>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-4 before:content-[''] before:w-8 before:h-1 before:bg-accent-blue before:rounded-full">
            Hard Skills
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {/* Programming Card */}
          <Reveal delay={0}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center">
                  <Code2 size={20} className="text-accent-blue" />
                </div>
                <h3 className="font-display font-bold">{lang === 'en' ? 'Programming' : 'Programmation'}</h3>
              </div>
              <div className="mb-4">
                <p className="text-secondary text-xs mb-2 font-mono uppercase tracking-wider">
                  {lang === 'en' ? 'Solid' : 'Solide'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.hard_skills.programming.solid.map((skill) => (
                    <span
                      key={skill}
                      className="pill text-sm font-medium !px-5 !py-2.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-secondary text-xs mb-2 font-mono uppercase tracking-wider">
                  {lang === 'en' ? 'Basics' : 'Bases'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.hard_skills.programming.basics.map((skill) => (
                    <span key={skill} className="pill text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* AI Card */}
          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
                  <Brain size={20} className="text-accent-cyan" />
                </div>
                <h3 className="font-display font-bold">
                  {lang === 'en' ? 'Artificial Intelligence' : 'Intelligence Artificielle'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.hard_skills.ai.map((skill) => (
                  <span key={skill} className="pill text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Tools Card */}
          <Reveal delay={0.2}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-accent-violet/10 flex items-center justify-center">
                  <Wrench size={20} className="text-accent-violet" />
                </div>
                <h3 className="font-display font-bold">{lang === 'en' ? 'Tools' : 'Outils'}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.hard_skills.tools.map((tool) => (
                  <span key={tool} className="pill text-xs">
                    {tool}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-4 before:content-[''] before:w-8 before:h-1 before:bg-accent-pink before:rounded-full">
            Soft Skills
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Soft Skills Card */}
          <Reveal delay={0.3}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-accent-purple/10 flex items-center justify-center">
                  <UserCheck size={20} className="text-accent-purple" />
                </div>
                <h3 className="font-display font-bold">{lang === 'en' ? 'Soft Skills' : 'Savoir-être'}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.soft_skills.map((skill) => (
                  <span key={skill} className="pill text-sm font-medium !px-5 !py-2.5">
                    {skill}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Languages Card */}
          <Reveal delay={0.4}>
            <SpotlightCard className="h-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-accent-pink/10 flex items-center justify-center">
                  <Languages size={20} className="text-accent-pink" />
                </div>
                <h3 className="font-display font-bold">{lang === 'en' ? 'Languages' : 'Langues'}</h3>
              </div>
              <div className="flex justify-center gap-8">
                {profile.languages.map((lang) => (
                  <ProgressRing
                    key={lang.language}
                    percentage={lang.percentage}
                    label={lang.level}
                    sublabel={lang.language}
                    size={100}
                    strokeWidth={6}
                  />
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
