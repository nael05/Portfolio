"use client";

import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { WordReveal } from "@/components/ui/WordReveal";
import { TechIcon } from "@/components/ui/TechIcon";
import { InterventionMap } from "@/components/ui/InterventionMap";
import {
  MapPin,
  Target,
  Car,
  Code2,
  Compass,
  Bus,
  ShieldCheck,
} from "lucide-react";

export function AboutSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  return (
    <section id="about" className="px-3 md:px-6 py-12">
      <div className="w-full max-w-[1280px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-extrabold tracking-tight text-balance mb-8"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {lang === 'en' ? 'About' : 'À propos'}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large bio card */}
          <SpotlightCard className="md:col-span-2 lg:col-span-2">
            <WordReveal
              className="text-secondary leading-relaxed"
              gradientWord="Data"
            >
              {profile.bio}
            </WordReveal>
          </SpotlightCard>

          {/* Objective card */}
          <SpotlightCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
                <Target size={20} className="text-accent-cyan" />
              </div>
              <h3 className="font-display font-bold">{lang === 'en' ? 'Objective' : 'Objectif'}</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                <div className="w-8 h-8 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <p className="text-sm font-medium text-foreground">{lang === 'en' ? '3rd Year Work-Study Bachelor' : 'Bachelor 3 en alternance'}</p>
              </div>
              
              <div className="flex justify-center -my-1 relative z-10">
                <div className="w-1 h-4 bg-gradient-to-b from-accent-cyan/50 to-accent-blue/50 rounded-full"></div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <p className="text-sm font-medium text-foreground">{lang === 'en' ? 'Master in Data' : 'Bac + 5 en Data'}</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Interactive Intervention Map card */}
          <SpotlightCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                  <Compass size={20} className="text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-display font-bold">
                    {lang === 'en' ? 'Intervention Area' : "Zone d'intervention"}
                  </h3>
                  <p className="text-secondary text-xs">
                    {profile.identity.location} · {lang === 'en' ? 'Active across all Île-de-France' : 'Actif sur toute l’Île-de-France'}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>{lang === 'en' ? 'Available for internship' : 'Disponible en stage'}</span>
              </div>
            </div>

            {/* Simple Île-de-France map */}
            <div className="flex-1 min-h-[310px] w-full rounded-2xl overflow-hidden">
              <InterventionMap />
            </div>
          </SpotlightCard>

          {/* Driving license & Mobility card */}
          <SpotlightCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-accent-violet/10 flex items-center justify-center shrink-0">
                  <Car size={20} className="text-accent-violet" />
                </div>
                <div>
                  <h3 className="font-display font-bold">
                    {lang === 'en' ? 'Mobility' : 'Mobilité'}
                  </h3>
                  <p className="text-secondary text-xs">
                    {lang === 'en' ? 'Autonomous & Flexible' : 'Autonome & Flexible'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                  <div className="w-8 h-8 rounded-full bg-accent-violet/20 text-accent-violet flex items-center justify-center font-bold text-sm shrink-0">
                    <Car size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lang === 'en' ? 'B License (Car)' : 'Permis B'}
                    </p>
                    <p className="text-xs text-secondary">
                      {lang === 'en' ? 'Vehicle owner · Easy commuting' : 'Véhiculé · Déplacements rapides'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-sm shrink-0">
                    <Bus size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lang === 'en' ? 'Transit Pass' : 'Transports en commun'}
                    </p>
                    <p className="text-xs text-secondary">
                      {lang === 'en' ? 'Navigo Pass (RER, Metro, Train)' : 'Pass Navigo (RER, Métro, Transilien)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-secondary">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent-cyan" />
                {lang === 'en' ? 'On-site & Remote' : 'Présentiel & Télétravail'}
              </span>
              <span className="font-mono text-[11px] text-accent-blue font-semibold">
                IDF / 100%
              </span>
            </div>
          </SpotlightCard>

          {/* Stack card */}
          <SpotlightCard className="md:col-span-2 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-pink/10 flex items-center justify-center shrink-0">
                  <Code2 size={20} className="text-accent-pink" />
                </div>
                <div>
                  <h3 className="font-display font-bold">{lang === 'en' ? 'Current Stack' : 'Stack du moment'}</h3>
                  <p className="text-secondary text-xs">
                    {lang === 'en' ? 'Core tools & technologies used daily' : 'Technologies et outils principaux pratiqués'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Python", "SQL", "React", "Next.js", "TypeScript", "TailwindCSS", "Git"].map((tech) => (
                <TechIcon key={tech} name={tech} />
              ))}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
