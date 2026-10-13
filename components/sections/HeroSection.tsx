"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RotatingText } from "@/components/ui/RotatingText";
import { Counter } from "@/components/ui/Counter";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MapPin, Building2 } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center px-3 md:px-6 py-24 md:py-32"
    >
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="section-panel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text content */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Status badge */}
              <Reveal delay={0.1}>
                <div className="pill w-fit">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                  <span className="font-mono text-xs">
                    {lang === 'en' ? 'Available · Internship → Work-Study Data' : 'Disponible · Stage → Alternance Data'}
                  </span>
                </div>
              </Reveal>

              {/* Main title */}
              <Reveal delay={0.2}>
                <h1
                  className="font-display font-extrabold leading-[1.05] tracking-tight text-balance"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  }}
                >
                  {lang === 'en' ? "Hi, I'm" : "Salut, je suis"}{" "}
                  <span className="gradient-text">Naël</span>
                  <br />
                  <span className="text-stroke opacity-60">Morellon</span>
                </h1>
              </Reveal>

              {/* Subtitle */}
              <Reveal delay={0.3}>
                <p
                  className="text-secondary leading-relaxed max-w-xl"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
                >
                  {lang === 'en' ? "IT Student. I transform" : "Étudiant en informatique. Je transforme les"}{" "}
                  <RotatingText words={profile.rotatingWords} />{" "}
                  {lang === 'en' ? "into decisions, and I love building visible products." : "en décisions, et j'aime construire des produits qui se voient."}
                </p>
              </Reveal>

              {/* CTA buttons */}
              <Reveal delay={0.4}>
                <div className="flex flex-wrap gap-4">
                  <MagneticButton
                    href="#projects"
                    className="btn-gradient"
                  >
                    {lang === 'en' ? 'View my projects' : 'Voir mes projets'}
                  </MagneticButton>
                  <MagneticButton
                    href="#contact"
                    className="btn-outline"
                  >
                    {lang === 'en' ? 'Contact me' : 'Me contacter'}
                  </MagneticButton>
                </div>
              </Reveal>

              {/* Stats row */}
              <Reveal delay={0.5}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <SpotlightCard className="!p-4 text-center" tilt={false}>
                    <div className="font-display font-bold text-2xl gradient-text-static">
                      B<Counter target={2} />
                    </div>
                    <p className="text-secondary text-xs mt-1">
                      {lang === 'en' ? 'CS Bachelor' : 'Bachelor Informatique'}
                    </p>
                  </SpotlightCard>
                  <SpotlightCard className="!p-4 text-center" tilt={false}>
                    <div className="font-display font-bold text-2xl gradient-text-static">
                      <Counter target={9} />
                    </div>
                    <p className="text-secondary text-xs mt-1">
                      {lang === 'en' ? 'Languages & Tech' : 'Langages et technologies'}
                    </p>
                  </SpotlightCard>
                  <SpotlightCard className="!p-4 text-center" tilt={false}>
                    <div className="font-display font-bold text-2xl gradient-text-static">
                      <Counter target={2018} duration={2.5} />
                    </div>
                    <p className="text-secondary text-xs mt-1">
                      {lang === 'en' ? 'First pro steps' : 'Premiers pas pros'}
                    </p>
                  </SpotlightCard>
                </div>
              </Reveal>
            </div>

            {/* Right: Photo + floating cards */}
            <Reveal delay={0.3}>
              <div className="relative flex flex-col gap-4">
                {/* Photo card with rotating gradient border */}
                <div className="relative rounded-squircle overflow-hidden aspect-[4/5] max-w-[400px] mx-auto w-full">
                  <div
                    className="absolute inset-0 rounded-squircle p-[3px]"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #22D3EE, #4F7CFF, #8B5CF6, #F472B6, #22D3EE)",
                      animation: "border-rotate 4s linear infinite",
                    }}
                  >
                    <div className="w-full h-full rounded-squircle bg-surface overflow-hidden">
                      <motion.div style={{ y: yImage, height: "120%" }} className="origin-top -mt-[10%]">
                        <Image
                          src="/images/nael.png"
                          alt="Naël Morellon"
                          width={400}
                          height={500}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating info cards */}
                <div className="grid grid-cols-2 gap-3">
                  <SpotlightCard className="!p-3 !rounded-2xl" tilt={false}>
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-accent-cyan shrink-0" />
                      <span className="text-xs font-medium truncate">
                        Ynov Campus Nanterre
                      </span>
                    </div>
                  </SpotlightCard>
                  <SpotlightCard className="!p-3 !rounded-2xl" tilt={false}>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-accent-violet shrink-0" />
                      <span className="text-xs font-medium truncate">
                        NM Web Studio
                      </span>
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Tech marquee */}
        <div className="mt-8">
          <Marquee items={profile.techMarquee} speed={25} />
        </div>
      </div>
    </section>
  );
}
