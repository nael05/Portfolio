"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GitHubRepo } from "@/lib/github";
import type { RepoConfig } from "@/lib/reposConfig";

export function AdminClient({ initialRepos }: { initialRepos: GitHubRepo[] }) {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const messageTimer = useRef<ReturnType<typeof setTimeout>>();

  const updateRepo = (name: string, updates: Partial<GitHubRepo>) => {
    setRepos(prev => prev.map(r => r.name === name ? { ...r, ...updates } : r));
  };

  const showMessage = (text: string, duration = 4000) => {
    clearTimeout(messageTimer.current);
    setMessage(text);
    messageTimer.current = setTimeout(() => setMessage(""), duration);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.refresh();
  };

  const handleSave = async () => {
    setSaving(true);
    clearTimeout(messageTimer.current);
    setMessage("");

    // Build the config map
    const configMap: Record<string, RepoConfig> = {};
    repos.forEach(repo => {
      configMap[repo.name] = {
        visible: repo.visible ?? true,
        category: repo.category as RepoConfig["category"],
        coverImage: repo.screenshots?.[0] || null
      };
    });

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configMap)
      });
      if (res.ok) {
        showMessage("✅ Configuration enregistrée avec succès !");
      } else {
        const data = await res.json().catch(() => null);
        if (res.status === 401) router.refresh(); // session expired → back to the login form
        showMessage(`❌ ${data?.error || "Erreur lors de l'enregistrement."}`, 8000);
      }
    } catch {
      showMessage("❌ Erreur réseau lors de l'enregistrement.", 8000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div 
        className="fixed top-0 right-0 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none"
        style={{ transform: "translate(20%, -20%)" }}
      />
      <div 
        className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"
        style={{ transform: "translate(-20%, 20%)" }}
      />

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-surface/50 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Administration</h1>
            <p className="text-secondary text-sm md:text-base">Gérez la visibilité, les catégories et les images de couverture de vos projets.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {message && <span role="status" className="text-sm font-medium px-4 py-2 rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20 max-w-md">{message}</span>}
            <button
              onClick={handleLogout}
              className="px-4 py-3.5 rounded-2xl text-sm font-medium text-secondary border border-border hover:text-primary hover:border-white/20 transition-colors shrink-0"
            >
              Déconnexion
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-accent-blue text-white font-bold hover:bg-accent-blue/90 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {repos.filter(r => r.visible !== false).map(repo => (
            <div key={repo.name} className="p-6 md:p-8 rounded-3xl bg-surface/40 backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors shadow-xl flex flex-col gap-6">
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2 group-hover:text-accent-blue transition-colors">{repo.name}</h2>
                  <p className="text-sm text-secondary line-clamp-2">{repo.description}</p>
                </div>
                
                <button 
                  onClick={() => updateRepo(repo.name, { visible: false })}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400 hover:text-white transition-all shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Retirer
                </button>
              </div>

              <div className="h-px w-full bg-border/50"></div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Catégorie du projet</label>
                  <div className="flex flex-wrap gap-3">
                    {["pro", "perso", "scolaire"].map(cat => (
                      <label key={cat} className={`
                        cursor-pointer px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300
                        ${(repo.category || "perso") === cat 
                          ? "bg-accent-blue/10 border-accent-blue text-accent-blue" 
                          : "bg-surface-elevated border-border text-secondary hover:border-white/20 hover:text-primary"}
                      `}>
                        <input 
                          type="radio" 
                          name={`cat-${repo.name}`}
                          value={cat}
                          checked={(repo.category || "perso") === cat}
                          onChange={(e) => updateRepo(repo.name, { category: e.target.value as any })}
                          className="sr-only"
                        />
                        {cat === "pro" ? "Pro" : cat === "perso" ? "Personnel" : "Scolaire"}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Image de couverture</label>
                  {repo.screenshots && repo.screenshots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {repo.screenshots.map((url, i) => (
                        <div 
                          key={i}
                          onClick={() => {
                            const newScreenshots = [url, ...repo.screenshots.filter(s => s !== url)];
                            updateRepo(repo.name, { screenshots: newScreenshots });
                          }}
                          className={`
                            relative cursor-pointer rounded-xl overflow-hidden aspect-video border-2 transition-all duration-300 group
                            ${repo.screenshots[0] === url ? "border-accent-blue shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"}
                          `}
                        >
                          <img src={url} alt={`Screenshot ${i+1}`} className="w-full h-full object-cover" />
                          {repo.screenshots[0] === url && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-lg">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full py-8 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-secondary bg-surface-elevated/30">
                      <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-sm">Aucune image trouvée</span>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>

        {repos.filter(r => r.visible === false).length > 0 && (
          <div className="mt-12 pt-12 border-t border-border">
            <h3 className="text-xl font-display font-bold mb-6 text-secondary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Projets retirés du portfolio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.filter(r => r.visible === false).map(repo => (
                <div key={repo.name} className="p-4 rounded-2xl bg-surface-elevated/50 border border-white/5 flex items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity">
                  <span className="font-medium text-sm truncate">{repo.name}</span>
                  <button 
                    onClick={() => updateRepo(repo.name, { visible: true })}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg text-accent-blue bg-accent-blue/10 hover:bg-accent-blue hover:text-white transition-colors"
                  >
                    Restaurer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
