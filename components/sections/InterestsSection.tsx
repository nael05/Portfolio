"use client";

import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Swords,
  Mountain,
  Plane,
  Watch,
  Printer,
  Rocket,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Dumbbell,
  Swords,
  Mountain,
  Plane,
  Watch,
  Printer,
  Rocket,
};

export function InterestsSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  return (
    <section className="px-3 md:px-6 py-24 relative">
      <div className="w-full max-w-[1000px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-extrabold tracking-tight text-balance mb-16 text-center"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            {lang === 'en' ? 'Beyond Code' : 'Au-delà du code'}
          </h2>
        </Reveal>

        {/* Liste Typographique Minimaliste */}
        <div className="flex flex-col border-t border-foreground/10">
          {profile.interests.map((interest, i) => {
            const Icon = ICONS[interest.icon] || Dumbbell;
            
            return (
              <Reveal key={interest.name} delay={i * 0.05}>
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  className="group relative flex items-center justify-between py-6 md:py-10 border-b border-foreground/10 cursor-pointer overflow-hidden"
                >
                  {/* Effet de fond au survol */}
                  <motion.div 
                    variants={{
                      initial: { height: "0%" },
                      hover: { height: "100%" }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 bg-foreground/5 z-0"
                  />

                  <div className="relative z-10 flex items-center gap-4 md:gap-10 px-2 md:px-8">
                    <span className="text-secondary/40 font-mono text-xs md:text-sm">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <motion.h3 
                      variants={{
                        initial: { x: 0 },
                        hover: { x: 15 }
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="font-display font-bold text-2xl md:text-5xl text-foreground"
                    >
                      {interest.name}
                    </motion.h3>
                  </div>

                  <div className="relative z-10 flex items-center gap-6 px-2 md:px-8">
                    {interest.detail && (
                      <span className="hidden md:block text-secondary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {interest.detail}
                      </span>
                    )}
                    <motion.div
                      variants={{
                        initial: { scale: 0.8, opacity: 0.3, rotate: -15 },
                        hover: { scale: 1.1, opacity: 1, rotate: 0 }
                      }}
                      transition={{ duration: 0.4, ease: "easeOut", type: "spring" }}
                      className="text-accent-cyan"
                    >
                      <Icon size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />
                    </motion.div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
