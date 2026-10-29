"use client";

import { GitHubRepo } from "@/lib/github";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TechIcon, getTechIconUrl } from "@/components/ui/TechIcon";
import { ExternalLink, Github, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface ProjectsSectionProps {
  repos: GitHubRepo[];
}

export function ProjectsSection({ repos }: ProjectsSectionProps) {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"pro" | "perso" | "scolaire" | null>(null);
  const [selectedProject, setSelectedProject] = useState<GitHubRepo | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Auto-switch view based on filters
  const viewMode = (languageFilter || categoryFilter) ? "grid" : "carousel";

  // Helper to determine category based on GitHub topics or config
  const getRepoCategory = (repo: GitHubRepo): "pro" | "perso" | "scolaire" => {
    if (repo.category) return repo.category as "pro" | "perso" | "scolaire";
    const t = repo.topics || [];
    if (t.includes("pro") || t.includes("professionnel") || t.includes("professional") || t.includes("stage")) return "pro";
    if (t.includes("scolaire") || t.includes("school") || t.includes("ecole") || t.includes("university")) return "scolaire";
    return "perso";
  };

  const visibleRepos = repos.filter((r) => r.visible !== false);

  // Get unique languages
  const allLanguages = Array.from(
    new Set(visibleRepos.map((r) => r.language).filter(Boolean))
  ) as string[];

  const filtered = visibleRepos.filter((r) => {
    const matchLang = languageFilter ? r.language === languageFilter : true;
    const matchCat = categoryFilter ? getRepoCategory(r) === categoryFilter : true;
    return matchLang && matchCat;
  });

  // Reset index when filter changes to avoid out of bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [filtered.length]);

  // Bytewebster Carousel Logic
  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1));
  }, [filtered.length]);

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  }, [filtered.length]);

  const getCarouselItemStyle = (index: number): React.CSSProperties => {
    const total = filtered.length;
    if (total === 0) return {};

    let diff = index - currentIndex;
    
    // Normalize diff for infinite looping
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;

    // Bytewebster mapping with subtle blur effect for background elements
    if (diff === 0) {
      return { zIndex: 10, left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(1)", opacity: 1, filter: "blur(0px)", pointerEvents: "auto" };
    } else if (diff === -1) {
      return { zIndex: 5, left: "30%", top: "50%", transform: "translate(-50%, -50%) scale(0.85)", opacity: 1, filter: "blur(1px)", pointerEvents: "auto" };
    } else if (diff === 1) {
      return { zIndex: 5, left: "70%", top: "50%", transform: "translate(-50%, -50%) scale(0.85)", opacity: 1, filter: "blur(1px)", pointerEvents: "auto" };
    } else if (diff === -2) {
      return { zIndex: 4, left: "15%", top: "50%", transform: "translate(-50%, -50%) scale(0.7)", opacity: 1, filter: "blur(2px)", pointerEvents: "auto" };
    } else if (diff === 2) {
      return { zIndex: 4, left: "85%", top: "50%", transform: "translate(-50%, -50%) scale(0.7)", opacity: 1, filter: "blur(2px)", pointerEvents: "auto" };
    } else if (diff < -2) {
      return { zIndex: 1, left: "0%", top: "50%", transform: "translate(-50%, -50%) scale(0.4)", opacity: 0, filter: "blur(3px)", pointerEvents: "none" };
    } else {
      return { zIndex: 1, left: "100%", top: "50%", transform: "translate(-50%, -50%) scale(0.4)", opacity: 0, filter: "blur(3px)", pointerEvents: "none" };
    }
  };

  return (
    <section id="projects" className="px-3 md:px-6 py-12">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Reveal>
            <h2
              className="font-display font-extrabold tracking-tight text-balance"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {lang === 'en' ? 'GitHub Projects' : 'Projets GitHub'}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category filters */}
              <div className="flex gap-2 flex-wrap border-r border-foreground/10 pr-3">
                {[
                  { id: null, label: lang === 'en' ? 'All Types' : "Tous les types" },
                  { id: "pro", label: "Pro" },
                  { id: "perso", label: lang === 'en' ? 'Personal' : "Personnel" },
                  { id: "scolaire", label: lang === 'en' ? 'Academic' : "Scolaire" },
                ].map((cat) => (
                  <button
                    key={String(cat.id)}
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`pill text-xs transition-colors ${categoryFilter === cat.id
                        ? "!bg-accent-purple/20 text-accent-purple border-accent-purple/30"
                        : ""
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Language filters */}
              <div className="flex gap-2 flex-wrap border-r border-foreground/10 pr-3">
                <button
                  onClick={() => setLanguageFilter(null)}
                  className={`pill text-xs transition-colors ${!languageFilter
                      ? "!bg-accent-blue/20 text-accent-blue border-accent-blue/30"
                      : ""
                    }`}
                >
                  {lang === 'en' ? 'All Technologies' : 'Toutes les technos'}
                </button>
                {allLanguages.map((lang) => {
                  const url = getTechIconUrl(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => setLanguageFilter(lang === languageFilter ? null : lang)}
                      className={`pill text-xs flex items-center gap-1.5 transition-colors ${languageFilter === lang
                          ? "!bg-accent-blue/20 text-accent-blue border-accent-blue/30"
                          : ""
                        }`}
                    >
                      {url && <img src={url} alt={lang} className="w-3.5 h-3.5 object-contain" />}
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {viewMode === "carousel" ? (
          /* Carousel view */
          <div className="relative">
            {/* Counter */}
            <div className="text-right mb-4">
              <span className="font-mono text-sm text-secondary">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(filtered.length).padStart(2, "0")}
              </span>
            </div>

            {/* Cards container */}
            <div
              className="relative group/carousel w-full h-[550px] overflow-hidden py-10"
              style={{ perspective: "1200px" }}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                const startX = touchStartX.current;
                const endX = event.changedTouches[0]?.clientX;
                touchStartX.current = null;
                if (startX === null || endX === undefined) return;
                const delta = endX - startX;
                if (Math.abs(delta) > 50) {
                  if (delta > 0) scrollPrev();
                  else scrollNext();
                }
              }}
            >
              {filtered.map((repo, i) => {
                const style = getCarouselItemStyle(i);
                return (
                  <div
                    key={repo.slug}
                    className="absolute w-[85vw] md:w-[650px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer"
                    style={style}
                    onClick={() => {
                      if (currentIndex === i) setSelectedProject(repo);
                      else setCurrentIndex(i);
                    }}
                  >
                    <div className="carousel-item-inner h-full rounded-3xl overflow-hidden shadow-2xl dark:shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                      <ProjectCard repo={repo} onSelect={() => setSelectedProject(repo)} />
                    </div>
                  </div>
                );
              })}

              {/* Discreet arrows */}
              <button
                onClick={scrollPrev}
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 z-10"
                aria-label="Projet précédent"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 z-10"
                aria-label="Projet suivant"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        ) : (
          /* Grid view */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((repo, i) => (
              <motion.div
                key={repo.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                  delay: i * 0.05,
                }}
              >
                <ProjectCard repo={repo} onSelect={() => setSelectedProject(repo)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            repo={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            lang={lang}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectModal({ repo, onClose, lang }: { repo: GitHubRepo; onClose: () => void; lang: string }) {
  const [readme, setReadme] = useState<string>(lang === 'en' ? "Loading project details..." : "Chargement des détails du projet...");
  const [imgIndex, setImgIndex] = useState(-1);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const abortController = new AbortController();
    document.body.style.overflow = "hidden";
    
    if (repo.readmeUrl) {
      const fetchUrl = lang === 'en' ? repo.readmeUrl.replace(/readme\.md$/i, 'README.en.md') : repo.readmeUrl;
      fetch(fetchUrl, { signal: abortController.signal })
        .then(async (res) => {
          const text = await res.text();
          // Remove markdown images and emojis to keep it concise, clean, and serious
          const concise = text
            .replace(/!\[.*?\]\(.*?\)/g, "")
            .replace(/<img[^>]*>/g, "")
            .replace(new RegExp("[\\p{Extended_Pictographic}\\p{Emoji_Presentation}]", "gu"), "");
          
          if (lang === 'en' && res.status === 404) {
             // Fallback to default README if English version doesn't exist
             fetch(repo.readmeUrl!, { signal: abortController.signal }).then(r => r.text()).then(t => setReadme(t.replace(/!\[.*?\]\(.*?\)/g, "").replace(/<img[^>]*>/g, "")));
          } else {
             setReadme(concise);
          }
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setReadme(lang === 'en' ? "Could not load project details." : "Impossible de charger les détails du projet.");
        });
    } else {
      setReadme(repo.description || (lang === 'en' ? "No additional details available for this project." : "Aucun détail supplémentaire disponible pour ce projet."));
    }

    return () => {
      abortController.abort();
      document.body.style.overflow = previousOverflow;
    };
  }, [repo, lang]);

  return (
    <div className="fixed inset-0 z-[200]">
      <motion.div 
        layoutId={`project-container-${repo.slug}`}
        className="relative w-full h-full bg-background overflow-y-auto overflow-x-hidden z-10"
        data-lenis-prevent="true"
      >
        {/* Fixed subtle grid background */}
        <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }} />

        <div className="relative z-10">
          <button 
            onClick={onClose} 
            className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10 hover:scale-110 transition-all backdrop-blur-md"
          >
            <X size={24} />
          </button>

          <div className="max-w-5xl mx-auto pt-20 md:pt-32 pb-24 px-6 md:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 drop-shadow-lg">{repo.name}</h2>
            
            <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-foreground/10">
              <a href={repo.html_url} target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 text-foreground border border-foreground/10 hover:bg-foreground/10 hover:scale-105 transition-all shadow-lg">
                <Github size={18} /> {lang === 'en' ? 'Source Code' : 'Code Source'}
              </a>
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 hover:bg-accent-cyan/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <ExternalLink size={18} /> {lang === 'en' ? 'View Demo' : 'Voir la Démo'}
                </a>
              )}
            </div>

            {/* Technologies */}
            {repo.languages && Object.keys(repo.languages).length > 0 && (
              <div className="mb-16">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-5">{lang === 'en' ? 'Technologies & Languages' : 'Technologies & Langages'}</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(repo.languages).map(lang => (
                    <TechIcon key={lang} name={lang} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Gallery */}
          {repo.screenshots.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-20"
            >
              <h3 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-4 before:content-[''] before:w-8 before:h-1 before:bg-accent-cyan before:rounded-full">{lang === 'en' ? 'Gallery' : 'Galerie'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {repo.screenshots.map((img, i) => (
                  <motion.div
                    key={i}
                    layoutId={i === 0 ? `image-${repo.slug}` : `image-float-${repo.slug}-${i}`}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform border border-foreground/10 group"
                    onClick={() => setImgIndex(i)}
                  >
                    <Image src={img} alt={`${repo.name} capture ${i + 1}`} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
                       <span className="text-background opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/80 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium border border-background/10">Agrandir</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* README Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-none pb-24"
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground border-b border-foreground/10 pb-6 mb-10" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-display font-bold text-foreground mt-16 mb-8 flex items-center gap-4 before:content-[''] before:w-8 before:h-1 before:bg-accent-cyan before:rounded-full" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-display font-semibold text-foreground mt-12 mb-6" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-xl font-display font-medium text-foreground mt-8 mb-4" {...props} />,
                p: ({node, ...props}) => <p className="text-secondary leading-relaxed mb-6 text-base md:text-lg font-sans" {...props} />,
                a: ({node, ...props}) => <a className="text-accent-cyan hover:text-foreground underline decoration-accent-cyan/30 hover:decoration-foreground transition-colors font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-8" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-3 mb-8 text-secondary marker:text-accent-cyan/80" {...props} />,
                li: ({node, ...props}) => (
                  <li className="flex items-start gap-3 text-secondary text-base md:text-lg">
                    <span className="text-accent-cyan mt-1.5 flex-shrink-0">•</span>
                    <span {...props} />
                  </li>
                ),
                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-accent-cyan bg-gradient-to-r from-accent-cyan/10 to-transparent py-4 px-6 rounded-r-2xl text-secondary italic my-10 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]" {...props} />
                ),
                hr: ({node, ...props}) => <hr className="border-foreground/10 my-16" {...props} />,
                pre: ({node, ...props}) => (
                  <div className="relative group my-10">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 to-accent-blue/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <pre className="relative bg-surface-elevated border border-foreground/10 rounded-2xl p-6 overflow-x-auto shadow-2xl font-mono text-sm text-foreground/80" {...props} />
                  </div>
                ),
                code: ({node, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !className;
                  return isInline ? (
                    <code className="bg-accent-cyan/10 text-accent-cyan px-2 py-1 rounded-md font-mono text-sm border border-accent-cyan/20" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img: ({node, ...props}) => (
                  <img alt="" className="rounded-2xl border border-foreground/10 shadow-2xl my-10 max-w-full" loading="lazy" {...props} />
                ),
              }}
            >
              {readme}
            </ReactMarkdown>
          </motion.div>
        </div>
        </div>
      </motion.div>

      {/* Full Screen Image Viewer Overlay */}
      <AnimatePresence>
        {imgIndex >= 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setImgIndex(-1)}
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground backdrop-blur-md transition-all hover:scale-110 z-50" 
              onClick={(e) => { e.stopPropagation(); setImgIndex(-1); }}
            >
              <X size={28} />
            </button>

            <motion.div 
              layoutId={imgIndex === 0 ? `image-${repo.slug}` : `image-float-${repo.slug}-${imgIndex}`}
              className="relative w-full max-w-7xl h-full max-h-[85vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                 src={repo.screenshots[imgIndex] || repo.screenshots[0]} 
                 alt={repo.name}
                 fill
                 unoptimized
                 className="object-contain drop-shadow-[0_0_50px_rgba(34,211,238,0.2)]"
                 sizes="100vw"
              />
            </motion.div>

            {repo.screenshots.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIndex((prev) => (prev === 0 ? repo.screenshots.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-foreground/10 text-foreground flex items-center justify-center hover:bg-foreground/20 hover:scale-110 transition-all backdrop-blur-md"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIndex((prev) => (prev + 1) % repo.screenshots.length);
                  }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-foreground/10 text-foreground flex items-center justify-center hover:bg-foreground/20 hover:scale-110 transition-all backdrop-blur-md"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ repo, onSelect }: { repo: GitHubRepo; onSelect: () => void }) {
  const [imageIndex, setImageIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasScreenshots = repo.screenshots.length > 0;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const languageColors: Record<string, string> = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Go: "#00ADD8",
    Java: "#b07219",
    C: "#555555",
  };

  return (
    <div className="relative aspect-video md:aspect-[16/10] w-full rounded-[2rem] overflow-hidden group bg-surface-elevated border border-foreground/5 ring-1 ring-foreground/10">
      {/* Screenshot */}
      {hasScreenshots ? (
        <div
          className="absolute inset-0 w-full h-full"
          onMouseEnter={() => {
            if (repo.screenshots.length > 1) {
              timerRef.current = setInterval(() => {
                setImageIndex((prev) => (prev + 1) % repo.screenshots.length);
              }, 1500);
            }
          }}
          onMouseLeave={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setImageIndex(0);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIndex}
              layoutId={imageIndex === 0 ? `image-${repo.slug}` : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={repo.screenshots[imageIndex]}
                alt={`${repo.name} capture`}
                fill
                unoptimized
                className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 85vw, 700px"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center">
          <span className="text-secondary text-5xl font-mono opacity-20">
            {repo.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 md:p-12">
        {repo.language && (
          <div className="flex mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <TechIcon name={repo.language} />
          </div>
        )}
        <h3 className="font-display font-bold text-3xl md:text-4xl text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{repo.name}</h3>
        {repo.description && (
          <p className="text-white/70 text-sm md:text-base max-w-xl mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {repo.description}
          </p>
        )}

        {/* Links */}
        <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
          <button
            onClick={onSelect}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-cyan/80 backdrop-blur-md border border-accent-cyan text-white text-sm font-medium hover:bg-accent-cyan hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            aria-label={`En savoir plus sur ${repo.name}`}
          >
            <Plus size={16} />
            En savoir plus
          </button>
          
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all"
            aria-label={`Code source de ${repo.name}`}
          >
            <Github size={16} />
            Code
          </a>
        </div>
      </div>
    </div>
  );
}
