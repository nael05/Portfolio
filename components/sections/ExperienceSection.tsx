"use client";

import { useRef } from "react";
import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Briefcase } from "lucide-react";

export function ExperienceSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="px-3 md:px-6 py-24 overflow-hidden">
      <div className="w-full max-w-[1000px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-extrabold tracking-tight text-balance mb-16 text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {lang === 'en' ? 'Experience' : 'Parcours'}
          </h2>
        </Reveal>

        <div ref={containerRef} className="relative">
          {/* Animated SVG Path (Desktop & Mobile) */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-border">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet origin-top"
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-8 md:gap-24 relative z-10"
          >
            {profile.experiences.map((exp, i) => {
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className={`flex flex-col md:flex-row items-start md:items-center w-full ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Empty space for desktop layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Timeline dot */}
                  <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-surface border-4 border-background z-20 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center">
                      <Briefcase size={14} className={exp.highlight ? "text-accent-cyan" : "text-secondary"} />
                    </div>
                  </div>

                  {/* Card content */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                    <SpotlightCard
                      className={`h-full ${
                        exp.highlight
                          ? "!border-transparent relative before:!bg-transparent"
                          : ""
                      }`}
                    >
                      {/* Animated gradient border for highlighted card */}
                      {exp.highlight && (
                        <div
                          className="absolute inset-0 rounded-4xl -z-10 p-[1px]"
                          style={{
                            background:
                              "conic-gradient(from 0deg, #22D3EE, #4F7CFF, #8B5CF6, #F472B6, #22D3EE)",
                            animation: "border-rotate 4s linear infinite",
                            borderRadius: "32px",
                          }}
                        >
                          <div className="w-full h-full rounded-4xl bg-surface" />
                        </div>
                      )}

                      <div className="flex flex-col gap-4 relative z-10">
                        <div>
                          <span className="font-mono text-xs text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-full mb-3 inline-block">
                            {exp.period}
                          </span>
                          <h3 className="font-display font-bold text-xl md:text-2xl mt-1">
                            {exp.title}
                          </h3>
                          <p className="text-secondary font-medium mt-1">
                            {exp.company} · {exp.location}
                          </p>
                        </div>
                        
                        {exp.description && (
                          <p className="text-secondary text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                        
                        {exp.current && (
                          <div className="mt-2">
                            <span className="pill text-xs !py-1 !px-3 !bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft" />
                              {lang === 'en' ? 'Current' : 'En cours'}
                            </span>
                          </div>
                        )}
                      </div>
                    </SpotlightCard>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
