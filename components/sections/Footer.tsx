"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-3 md:px-6 py-8">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="glass rounded-[28px] px-6 py-4 flex items-center justify-between">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} Naël Morellon
          </p>

          <div className="flex items-center gap-4">
            {/* Live time */}
            <div className="flex items-center gap-2 text-secondary text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
              <span className="font-mono">{time}</span>
            </div>

            {/* Scroll to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-accent-cyan/50 transition-colors"
              aria-label="Remonter en haut"
            >
              <ArrowUp size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
