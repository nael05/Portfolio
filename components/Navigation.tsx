"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Home, User, Briefcase, Code2, Rocket, Heart, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useLenis } from "@/components/providers/LenisProvider";

const getNavItems = (lang: string) => [
  { label: lang === 'en' ? 'Home' : "Accueil", href: "#hero", icon: Home },
  { label: lang === 'en' ? 'About' : "À propos", href: "#about", icon: User },
  { label: lang === 'en' ? 'Experience' : "Parcours", href: "#experience", icon: Briefcase },
  { label: lang === 'en' ? 'Skills' : "Compétences", href: "#skills", icon: Code2 },
  { label: lang === 'en' ? 'Projects' : "Projets", href: "#projects", icon: Rocket },
  { label: lang === 'en' ? 'Commitments' : "Engagements", href: "#engagements", icon: Heart },
  { label: lang === 'en' ? 'Contact' : "Contact", href: "#contact", icon: Mail },
];

export function Navigation() {
  const { lang, setLang } = useLanguage();
  const lenis = useLenis();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navItems = useMemo(() => getNavItems(lang), [lang]);
  const [activeSection, setActiveSection] = useState("#hero");
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "down" : "up";
    if (direction === "down" && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const item = navItems.find((n) => n.href === `#${id}`);
            if (item) setActiveSection(item.href);
          }
        });
      },
      { threshold: 0.3 }
    );

    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const scrollTo = (href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -96, duration: 0.8 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setHidden(false);
    setIsMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: hidden ? -100 : 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed top-6 left-1/2 z-50 hidden md:block"
        aria-label="Navigation principale"
      >
        <div
          className="glass rounded-full flex items-center justify-between px-3 py-2 shadow-lg border border-foreground/5 bg-background/50 backdrop-blur-xl"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 1px var(--color-border)" }}
        >
          {/* Left: Monogram (fixed width to balance right side) */}
          <div className="w-[100px] flex items-center justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-violet flex items-center justify-center text-white font-display font-bold text-xs shadow-inner">
              NM
            </div>
          </div>

          {/* Center: Nav links */}
          <div className="flex items-center gap-1 px-2">
            {navItems.map((item) => (
              <MagneticButton
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap !gap-0 !outline-none",
                  activeSection === item.href
                    ? "text-foreground"
                    : "text-secondary hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {activeSection === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-surface-elevated/80 shadow-sm border border-foreground/10 rounded-full"
                    style={{ borderRadius: 999 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </MagneticButton>
            ))}
          </div>

          {/* Right: Tools (fixed width to balance left side) */}
          <div className="w-[100px] flex items-center justify-end gap-1">
            {/* Translation Button */}
            <button 
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-secondary hover:text-foreground hover:bg-foreground/10 transition-colors"
              aria-label={lang === 'fr' ? "Switch to English" : "Passer en Français"}
              title={lang === 'fr' ? "Switch to English" : "Passer en Français"}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <div className="w-[1px] h-4 bg-foreground/10 mx-0.5" />
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Mobile bottom dock */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: hidden ? 100 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
        aria-label="Navigation mobile"
      >
        <div className="mx-3 mb-3 glass rounded-3xl flex items-center justify-between px-3 py-2" style={{ boxShadow: "var(--shadow-nav)" }}>
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[52px] transition-colors",
                  activeSection === item.href
                    ? "text-accent-cyan"
                    : "text-secondary"
                )}
                aria-label={item.label}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[52px] text-secondary"
            aria-label="Menu"
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-[32px] p-6 pb-safe"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg">Navigation</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl text-left transition-colors",
                        activeSection === item.href
                          ? "bg-surface-elevated text-foreground"
                          : "text-secondary hover:text-foreground hover:bg-surface-elevated"
                      )}
                    >
                      <Icon size={22} />
                      <span className="font-display font-semibold text-lg">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-6">
                <div className="flex gap-4">
                  <ThemeToggle />
                  <button 
                    onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-secondary bg-surface-elevated hover:text-foreground hover:bg-foreground/10 transition-colors"
                    aria-label={lang === 'fr' ? "Switch to English" : "Passer en Français"}
                  >
                    {lang === 'fr' ? 'EN' : 'FR'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
