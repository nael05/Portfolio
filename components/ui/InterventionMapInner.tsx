"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/LanguageProvider";
import idfGeoJson from "@/public/data/ile-de-france.json";
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Car,
  Home,
  GraduationCap,
  Sparkles,
  Info,
} from "lucide-react";

export const DEPARTMENTS_INFO: Record<
  string,
  {
    nom: string;
    tagFr: string;
    tagEn: string;
    descFr: string;
    descEn: string;
    center: [number, number];
    zoom: number;
  }
> = {
  "75": {
    nom: "Paris",
    tagFr: "Paris intra-muros",
    tagEn: "Central Paris",
    descFr: "Centre économique & startups · Accessible RER / Métro / Voiture",
    descEn: "Economic hub & startups · Accessible via RER / Metro / Car",
    center: [48.8566, 2.3522],
    zoom: 11,
  },
  "92": {
    nom: "Hauts-de-Seine",
    tagFr: "La Défense, Boulogne, Nanterre",
    tagEn: "La Defense, Boulogne, Nanterre",
    descFr: "Secteur Ynov Campus Nanterre · Proximité immédiate",
    descEn: "Ynov Campus Nanterre area · Immediate proximity",
    center: [48.8285, 2.2188],
    zoom: 11,
  },
  "95": {
    nom: "Val-d'Oise",
    tagFr: "Seraincourt, Cergy, Argenteuil",
    tagEn: "Seraincourt, Cergy, Argenteuil",
    descFr: "Zone de résidence (Seraincourt) · Déplacements très rapides",
    descEn: "Home base (Seraincourt) · Rapid local commuting",
    center: [49.0844, 2.1091],
    zoom: 10,
  },
  "78": {
    nom: "Yvelines",
    tagFr: "Versailles, Poissy, Tessancourt",
    tagEn: "Versailles, Poissy, Tessancourt",
    descFr: "Secteur d'activité actuel · Déplacements en voiture (Permis B)",
    descEn: "Current professional area · Mobile by car (B License)",
    center: [48.8145, 1.9056],
    zoom: 10,
  },
  "93": {
    nom: "Seine-Saint-Denis",
    tagFr: "Saint-Denis, Montreuil, Pantin",
    tagEn: "Saint-Denis, Montreuil, Pantin",
    descFr: "Grand Paris · Accessible réseau autoroutier & transports",
    descEn: "Greater Paris · Highway & public transit connectivity",
    center: [48.9137, 2.4846],
    zoom: 11,
  },
  "94": {
    nom: "Val-de-Marne",
    tagFr: "Créteil, Vincennes, Ivry",
    tagEn: "Creteil, Vincennes, Ivry",
    descFr: "Zone couverte · Accessible RER A, B et réseau routier",
    descEn: "Covered zone · Accessible via RER A, B and road network",
    center: [48.777, 2.4531],
    zoom: 11,
  },
  "91": {
    nom: "Essonne",
    tagFr: "Évry, Massy, Saclay",
    tagEn: "Evry, Massy, Saclay",
    descFr: "Pôle technologique Paris-Saclay & entreprises de pointe",
    descEn: "Paris-Saclay innovation cluster & tech enterprises",
    center: [48.5286, 2.2575],
    zoom: 10,
  },
  "77": {
    nom: "Seine-et-Marne",
    tagFr: "Marne-la-Vallée, Meaux, Melun",
    tagEn: "Marne-la-Vallee, Meaux, Melun",
    descFr: "Zone couverte · Déplacements voiture & RER",
    descEn: "Covered zone · Accessible via car & RER",
    center: [48.6046, 2.8929],
    zoom: 9,
  },
};

interface InterventionMapInnerProps {
  isModal?: boolean;
  onToggleModal?: () => void;
}

export default function InterventionMapInner({
  isModal = false,
  onToggleModal,
}: InterventionMapInnerProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const activeDeptRef = useRef<string | null>(activeDept);
  activeDeptRef.current = activeDept;
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  // Department style function
  const getDeptStyle = useCallback(
    (feature: any, isHovered: boolean, isSelected: boolean) => {
      const isHighlighted = isHovered || isSelected;
      const currentDark = isDarkRef.current;
      return {
        fillColor: isHighlighted ? "#38BDF8" : "#3B82F6",
        fillOpacity: isHighlighted
          ? currentDark
            ? 0.28
            : 0.22
          : currentDark
          ? 0.1
          : 0.08,
        color: isHighlighted
          ? "#38BDF8"
          : currentDark
          ? "#94A3B8"
          : "#64748B",
        weight: isHighlighted ? 2 : 1,
        opacity: isHighlighted ? 0.9 : 0.55,
        dashArray: "",
      };
    },
    []
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center for Île-de-France
    const idfCenter: [number, number] = [48.84, 2.35];
    const initialZoom = isModal ? 10 : 9;

    const map = L.map(mapContainerRef.current, {
      center: idfCenter,
      zoom: initialZoom,
      minZoom: 8,
      maxZoom: 13,
      zoomControl: false,
      scrollWheelZoom: isModal, // only allow wheel zoom when modal is open to avoid hijacking page scroll
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap tiles work without a provider API key.
    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      className: isDarkRef.current ? "map-tiles-dark" : "map-tiles-light",
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Add GeoJSON Layer with Île-de-France polygons
    const geoJsonLayer = L.geoJSON(idfGeoJson as any, {
      style: (feature) => getDeptStyle(feature, false, false),
      onEachFeature: (feature, layer) => {
        const code = feature.properties?.code as string;
        const nom = feature.properties?.nom as string;
        const deptInfo = DEPARTMENTS_INFO[code];

        // Hover events
        layer.on({
          mouseover: (e) => {
            setHoveredDept(code);
            const target = e.target;
            target.setStyle(getDeptStyle(feature, true, activeDeptRef.current === code));
            target.bringToFront();
          },
          mouseout: (e) => {
            setHoveredDept(null);
            const target = e.target;
            target.setStyle(getDeptStyle(feature, false, activeDeptRef.current === code));
          },
          click: () => {
            setActiveDept(code);
            if (deptInfo) {
              map.flyTo(deptInfo.center, deptInfo.zoom, { duration: 0.8 });
            }
          },
        });

        // Tooltip
        const tooltipHtml = `
          <div class="font-sans px-1 py-0.5">
            <div class="flex items-center gap-1.5 font-bold text-xs text-cyan-400">
              <span>${code}</span>
              <span>•</span>
              <span>${nom}</span>
            </div>
            <div class="text-[11px] opacity-80 mt-0.5">${
              deptInfo ? deptInfo.tagFr : "Île-de-France"
            }</div>
          </div>
        `;

        layer.bindTooltip(tooltipHtml, {
          sticky: true,
          direction: "top",
          className: "custom-leaflet-tooltip",
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;

    // Fit bounds nicely to Île-de-France
    const bounds = geoJsonLayer.getBounds();
    map.fitBounds(bounds, {
      padding: isModal ? [40, 40] : [15, 15],
    });

    // Custom Icon for Home (Seraincourt 95)
    const homeIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <span class="absolute w-7 h-7 rounded-full bg-cyan-400/40 animate-ping"></span>
          <span class="absolute w-5 h-5 rounded-full bg-cyan-500/30"></span>
          <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 border border-white/80 dark:border-black/80">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const homeMarker = L.marker([49.0353, 1.8661], { icon: homeIcon })
      .addTo(map)
      .bindTooltip(
        `
        <div class="font-sans px-1 py-0.5">
          <div class="font-bold text-xs text-cyan-400 flex items-center gap-1">
            <span>🏠 Seraincourt (95)</span>
          </div>
          <div class="text-[11px] opacity-85 mt-0.5">${
            lang === "en" ? "Home base & residence" : "Point d'attache & résidence"
          }</div>
        </div>
      `,
        { direction: "top", className: "custom-leaflet-tooltip" }
      );

    // Custom Icon for Studies (Ynov Campus Nanterre 92)
    const campusIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <span class="absolute w-6 h-6 rounded-full bg-indigo-500/30 animate-pulse"></span>
          <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50 border border-white/80 dark:border-black/80">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const campusMarker = L.marker([48.8953, 2.2157], { icon: campusIcon })
      .addTo(map)
      .bindTooltip(
        `
        <div class="font-sans px-1 py-0.5">
          <div class="font-bold text-xs text-indigo-400 flex items-center gap-1">
            <span>🎓 Ynov Campus Nanterre (92)</span>
          </div>
          <div class="text-[11px] opacity-85 mt-0.5">${
            lang === "en" ? "Bachelor CS Studies" : "Bachelor Informatique"
          }</div>
        </div>
      `,
        { direction: "top", className: "custom-leaflet-tooltip" }
      );

    // Invalidate size once DOM stabilizes
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      homeMarker.remove();
      campusMarker.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isModal, getDeptStyle, lang]);

  // Handle Theme Change dynamically without rebuilding map
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileContainer = tileLayerRef.current.getContainer();
    tileContainer?.classList.toggle("map-tiles-dark", isDark);
    tileContainer?.classList.toggle("map-tiles-light", !isDark);
  }, [isDark]);

  // Handle Dynamic Department Highlight & Theme Change
  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle((feature) => {
        const code = feature?.properties?.code;
        return getDeptStyle(feature, code === hoveredDept, code === activeDept);
      });
    }
  }, [isDark, hoveredDept, activeDept, getDeptStyle]);

  // Map Controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    setActiveDept(null);
    if (mapInstanceRef.current && geoJsonLayerRef.current) {
      mapInstanceRef.current.fitBounds(geoJsonLayerRef.current.getBounds(), {
        padding: isModal ? [40, 40] : [15, 15],
      });
    }
  };

  const handleSelectDept = (code: string | null) => {
    setActiveDept(code);
    if (!mapInstanceRef.current) return;

    if (!code) {
      handleReset();
      return;
    }

    const dept = DEPARTMENTS_INFO[code];
    if (dept) {
      mapInstanceRef.current.flyTo(dept.center, dept.zoom, { duration: 0.9 });
    }
  };

  const displayedDeptKey = hoveredDept || activeDept;
  const displayedDept = displayedDeptKey ? DEPARTMENTS_INFO[displayedDeptKey] : null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none">
      {/* Interactive Map Header Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border bg-surface/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-semibold tracking-wide text-foreground truncate">
            {lang === "en"
              ? "100% Île-de-France Coverage"
              : "Zone d'intervention : 100% Île-de-France"}
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            {lang === "en" ? "Car + Transit" : "Permis B & Transports"}
          </span>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-7 h-7 rounded-lg bg-surface-elevated hover:bg-accent-blue/10 hover:text-accent-blue border border-border flex items-center justify-center transition-colors text-foreground text-xs"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-7 h-7 rounded-lg bg-surface-elevated hover:bg-accent-blue/10 hover:text-accent-blue border border-border flex items-center justify-center transition-colors text-foreground text-xs"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleReset}
            aria-label="Recentrer la carte"
            title={lang === "en" ? "Recenter on Île-de-France" : "Recentrer sur l'Île-de-France"}
            className="w-7 h-7 rounded-lg bg-surface-elevated hover:bg-accent-cyan/10 hover:text-accent-cyan border border-border flex items-center justify-center transition-colors text-foreground text-xs"
          >
            <RotateCcw size={14} />
          </button>
          {onToggleModal && (
            <button
              onClick={onToggleModal}
              aria-label={isModal ? "Fermer plein écran" : "Plein écran"}
              title={isModal ? (lang === "en" ? "Close" : "Réduire") : (lang === "en" ? "Fullscreen" : "Plein écran")}
              className="w-7 h-7 rounded-lg bg-surface-elevated hover:bg-accent-blue/15 hover:text-accent-blue border border-border flex items-center justify-center transition-colors text-foreground text-xs"
            >
              {isModal ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Department Quick Filter Bar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar border-b border-border/50 bg-surface/50 z-20 text-[11px]">
        <button
          onClick={() => handleSelectDept(null)}
          className={`px-2 py-0.5 rounded-full font-medium transition-all shrink-0 ${
            activeDept === null
              ? "bg-accent-blue text-white shadow-sm shadow-accent-blue/30"
              : "bg-surface-elevated text-secondary hover:text-foreground border border-border/60"
          }`}
        >
          {lang === "en" ? "All IDF" : "Toute l'IDF"}
        </button>
        {Object.entries(DEPARTMENTS_INFO).map(([code, info]) => (
          <button
            key={code}
            onClick={() => handleSelectDept(code === activeDept ? null : code)}
            className={`px-2 py-0.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1 ${
              activeDept === code
                ? "bg-accent-cyan text-black font-semibold shadow-sm shadow-accent-cyan/30"
                : "bg-surface-elevated text-secondary hover:text-foreground border border-border/60"
            }`}
          >
            <span>{code}</span>
            <span className="hidden md:inline">{info.nom}</span>
          </button>
        ))}
      </div>

      {/* Map Canvas Container */}
      <div className="relative flex-1 w-full min-h-[220px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Live Department / Area Info Floating Card */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-30 pointer-events-none">
          <div className="p-3 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-xl">
            {displayedDept ? (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-accent-blue/15 text-accent-blue">
                      {displayedDeptKey}
                    </span>
                    <span className="font-bold text-xs text-foreground">
                      {displayedDept.nom}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    {lang === "en" ? "Zone Active" : "Intervention OK"}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-foreground/90">
                  {lang === "en" ? displayedDept.tagEn : displayedDept.tagFr}
                </p>
                <p className="text-[10px] text-secondary mt-0.5">
                  {lang === "en" ? displayedDept.descEn : displayedDept.descFr}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                  <Sparkles size={13} className="text-accent-cyan" />
                  <span>{lang === "en" ? "Mobility Scope" : "Rayon d'action"}</span>
                </div>
                <p className="text-[11px] text-secondary leading-snug">
                  {lang === "en"
                    ? "Available across all 8 departments of Île-de-France (75, 77, 78, 91, 92, 93, 94, 95) & Remote."
                    : "Intervention possible dans les 8 départements d'Île-de-France (75, 77, 78, 91, 92, 93, 94, 95) & Télétravail."}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-foreground/80 font-medium pt-1.5 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    Seraincourt (95)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                    Ynov Nanterre (92)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
