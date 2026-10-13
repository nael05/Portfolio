"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { MapPin, Navigation, Maximize2, X, Compass, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import the Leaflet map with SSR disabled to prevent window is not defined errors
const InterventionMapInner = dynamic(
  () => import("@/components/ui/InterventionMapInner"),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);

function MapLoadingSkeleton() {
  const { lang } = useLanguage();
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 bg-surface/40 backdrop-blur-sm rounded-2xl relative overflow-hidden">
      {/* Radar pulse effect */}
      <div className="absolute w-36 h-36 rounded-full bg-accent-blue/10 animate-ping" />
      <div className="absolute w-20 h-20 rounded-full bg-accent-cyan/15 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-2xl bg-accent-blue/15 text-accent-blue flex items-center justify-center shadow-lg shadow-accent-blue/20">
          <Loader2 size={20} className="animate-spin text-accent-cyan" />
        </div>
        <div>
          <p className="font-semibold text-xs text-foreground">
            {lang === "en" ? "Loading interactive map…" : "Chargement de la carte interactive…"}
          </p>
          <p className="text-[11px] text-secondary mt-0.5">
            {lang === "en" ? "Île-de-France intervention zone" : "Zone d'intervention Île-de-France"}
          </p>
        </div>
      </div>
    </div>
  );
}

interface InterventionMapProps {
  className?: string;
}

export function InterventionMap({ className = "" }: InterventionMapProps) {
  const { lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <>
      {/* In-Card Interactive Map */}
      <div
        className={`w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-border bg-surface relative flex flex-col shadow-inner ${className}`}
      >
        <InterventionMapInner
          isModal={false}
          onToggleModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Fullscreen Map Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full max-w-5xl h-[85vh] max-h-[780px] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                    <Compass size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
                      {lang === "en"
                        ? "Interactive Intervention Map — Île-de-France"
                        : "Carte Interactive — Zone d'Intervention Île-de-France"}
                    </h3>
                    <p className="text-xs text-secondary hidden sm:block">
                      {lang === "en"
                        ? "Explore departments and accessibility across the Parisian region"
                        : "Explorez les départements et la mobilité sur toute la région francilienne"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-surface hover:bg-foreground/5 border border-border flex items-center justify-center transition-colors text-foreground"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Map */}
              <div className="flex-1 w-full h-full relative overflow-hidden">
                <InterventionMapInner
                  isModal={true}
                  onToggleModal={() => setIsModalOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
