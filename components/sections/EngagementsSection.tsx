"use client";

import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

export function EngagementsSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  return (
    <section id="engagements" className="px-3 md:px-6 py-12">
      <div className="w-full max-w-[1280px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-extrabold tracking-tight text-balance mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {lang === 'en' ? 'Taking Action, My Way' : 'Agir, à ma façon.'}
          </h2>
          <p className="text-secondary mb-8" style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}>
            {lang === 'en' ? 'Sincere commitments, on a human scale.' : 'Des engagements sincères, à échelle humaine.'}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion
            items={profile.engagements.map((e) => ({
              title: e.title,
              period: e.period,
              content: e.description,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
