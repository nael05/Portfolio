"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile } from "@/data/profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  Send,
  Copy,
  Check,
  Github,
  Download,
  MapPin,
  Loader2,
} from "lucide-react";

// Stable ids so the selected subject survives a language switch.
const SUBJECTS = [
  { id: "internship", fr: "Proposition de stage", en: "Internship offer" },
  { id: "workstudy", fr: "Alternance", en: "Work-Study" },
  { id: "web", fr: "Projet web", en: "Web project" },
  { id: "other", fr: "Autre", en: "Other" },
] as const;

type SubjectId = (typeof SUBJECTS)[number]["id"];

type FormData = {
  name: string;
  email: string;
  subject: SubjectId;
  message: string;
  honeypot: string;
};

type FormState = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const { lang } = useLanguage();
  const profile = getProfile(lang);
  const [formState, setFormState] = useState<FormState>("idle");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"stage" | "projet">("stage");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "internship",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const en = lang === "en";
    if (!formData.name.trim()) newErrors.name = en ? "Your name is required" : "Votre nom est requis";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = en ? "Invalid email" : "Email invalide";
    if (!formData.message.trim() || formData.message.trim().length < 10)
      newErrors.message = en ? "10 characters minimum" : "10 caractères minimum";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;
    if (!validate()) return;

    setFormState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: SUBJECTS.find((s) => s.id === formData.subject)?.[lang === "en" ? "en" : "fr"],
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error();
      setFormState("success");
      setFormData({
        name: "",
        email: "",
        subject: "internship",
        message: "",
        honeypot: "",
      });
    } catch {
      setFormState("error");
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.identity.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="px-3 md:px-6 py-12">
      <div className="w-full max-w-[1280px] mx-auto">
        <div
          className="section-panel relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,211,238,0.05), rgba(79,124,255,0.08), rgba(139,92,246,0.05))",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Form */}
            <div>
              <Reveal>
                <h2
                  className="font-display font-extrabold tracking-tight text-balance mb-4"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
                >
                  {mode === "stage"
                    ? (lang === 'en' ? "Let's talk about your next internship." : "Parlons de votre prochain stage.")
                    : (lang === 'en' ? "Let's talk about your project." : "Parlons de votre projet.")}
                </h2>
              </Reveal>

              {/* Mode toggle */}
              <Reveal delay={0.1}>
                <div className="inline-flex rounded-full bg-surface border border-border p-1 mb-8">
                  {(["stage", "projet"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setFormData((prev) => ({
                          ...prev,
                          subject: m === "stage" ? "internship" : "web",
                        }));
                      }}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        mode === m ? "text-foreground" : "text-secondary"
                      }`}
                    >
                      {mode === m && (
                        <motion.div
                          layoutId="contact-toggle"
                          className="absolute inset-0 bg-surface-elevated rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 25,
                          }}
                        />
                      )}
                      <span className="relative z-10">
                        {m === "stage" ? (lang === 'en' ? "I'm hiring" : "Je recrute") : (lang === 'en' ? "I have a project" : "J'ai un projet")}
                      </span>
                    </button>
                  ))}
                </div>
              </Reveal>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) =>
                    setFormData({ ...formData, honeypot: e.target.value })
                  }
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-2 block">
                    {lang === 'en' ? 'Name' : 'Nom'}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-5 py-3.5 rounded-[18px] bg-surface border border-border focus:border-accent-blue outline-none transition-colors text-foreground"
                    placeholder={lang === 'en' ? 'Your name' : 'Votre nom'}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-5 py-3.5 rounded-[18px] bg-surface border border-border focus:border-accent-blue outline-none transition-colors text-foreground"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                    {lang === 'en' ? 'Subject' : 'Sujet'}
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value as SubjectId })
                    }
                    className="w-full px-5 py-3.5 rounded-[18px] bg-surface border border-border focus:border-accent-blue outline-none transition-colors text-foreground appearance-none"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {lang === 'en' ? s.en : s.fr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    className="w-full px-5 py-3.5 rounded-[18px] bg-surface border border-border focus:border-accent-blue outline-none transition-colors text-foreground resize-none"
                    placeholder={lang === 'en' ? 'Your message…' : 'Votre message…'}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {formState === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400"
                    >
                      <Check size={20} />
                      <span className="text-sm font-medium">
                        {lang === 'en' ? 'Message sent! I will reply shortly.' : 'Message envoyé ! Je vous réponds rapidement.'}
                      </span>
                    </motion.div>
                  ) : formState === "error" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400"
                    >
                      <span className="text-sm">
                        {lang === 'en' ? 'Error sending message.' : "Erreur lors de l'envoi."}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormState("idle")}
                        className="text-sm underline"
                      >
                        {lang === 'en' ? 'Try again' : 'Réessayer'}
                      </button>
                    </motion.div>
                  ) : (
                    <MagneticButton
                      type="submit"
                      disabled={formState === "loading"}
                      className="btn-gradient w-full !justify-center"
                    >
                      {formState === "loading" ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={18} />
                          <span>{lang === 'en' ? 'Send' : 'Envoyer'}</span>
                        </>
                      )}
                    </MagneticButton>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Right: Contact info */}
            <div className="flex flex-col justify-center gap-6">
              <Reveal delay={0.2}>
                <div className="card !rounded-3xl">
                  <p className="text-secondary text-sm mb-2">Email</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm break-all">
                      {profile.identity.email}
                    </span>
                    <button
                      onClick={copyEmail}
                      className="shrink-0 w-9 h-9 rounded-xl bg-surface-elevated flex items-center justify-center hover:bg-accent-cyan/10 transition-colors"
                      aria-label={lang === 'en' ? 'Copy email' : "Copier l'email"}
                    >
                      {copied ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col gap-3">
                  <a
                    href={profile.identity.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card !rounded-3xl flex items-center gap-3 hover:border-accent-cyan/30 transition-colors"
                  >
                    <Github size={20} className="text-accent-blue" />
                    <span className="font-medium">GitHub</span>
                  </a>

                  <a
                    href="/cv.pdf"
                    download
                    className="card !rounded-3xl flex items-center gap-3 hover:border-accent-cyan/30 transition-colors"
                  >
                    <Download size={20} className="text-accent-violet" />
                    <span className="font-medium">{lang === 'en' ? 'Download my Resume' : 'Télécharger mon CV'}</span>
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="flex items-center gap-2 text-secondary text-sm">
                  <MapPin size={16} />
                  <span>
                    {profile.identity.location} · {lang === 'en' ? 'Available for an internship' : 'Disponible pour un stage'}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
