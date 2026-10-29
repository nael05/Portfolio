"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  IDF_DEPARTMENTS,
  IDF_POINTS,
  IDF_VIEWBOX,
} from "@/components/ui/idfMapData";

interface InterventionMapProps {
  className?: string;
}

// Simple static map of Île-de-France: 8 departments + 2 key places, no tiles or controls.
export function InterventionMap({ className = "" }: InterventionMapProps) {
  const { lang } = useLanguage();
  const en = lang === "en";
  const [active, setActive] = useState<string | null>(null);
  const activeDept = IDF_DEPARTMENTS.find((d) => d.code === active);

  return (
    <div
      className={`w-full h-full min-h-[310px] flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <svg
        viewBox={`0 0 ${IDF_VIEWBOX.width} ${IDF_VIEWBOX.height}`}
        role="img"
        aria-label={
          en ? "Map of the Île-de-France region" : "Carte de la région Île-de-France"
        }
        className="w-full max-w-[460px] max-h-[300px] h-auto"
      >
        {IDF_DEPARTMENTS.map((dept) => {
          const isActive = dept.code === active;
          return (
            <g
              key={dept.code}
              className="cursor-pointer"
              onMouseEnter={() => setActive(dept.code)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(isActive ? null : dept.code)}
            >
              <path
                d={dept.d}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className={`transition-colors duration-200 ${
                  isActive
                    ? "fill-accent-blue/30 stroke-accent-blue"
                    : "fill-accent-blue/10 stroke-border"
                }`}
                strokeWidth={isActive ? 1.5 : 1}
              >
                <title>{`${dept.code} · ${dept.nom}`}</title>
              </path>
              <text
                x={dept.cx}
                y={dept.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-secondary font-mono pointer-events-none select-none"
                fontSize={dept.code === "75" ? 8 : 10}
              >
                {dept.code}
              </text>
            </g>
          );
        })}

        <g className="pointer-events-none">
          <circle
            cx={IDF_POINTS.home[0]}
            cy={IDF_POINTS.home[1]}
            r={9}
            className="fill-accent-cyan/25 animate-pulse"
          />
          <circle
            cx={IDF_POINTS.home[0]}
            cy={IDF_POINTS.home[1]}
            r={4}
            className="fill-accent-cyan stroke-background"
            strokeWidth={1.5}
          />
          <circle
            cx={IDF_POINTS.campus[0]}
            cy={IDF_POINTS.campus[1]}
            r={4}
            className="fill-accent-violet stroke-background"
            strokeWidth={1.5}
          />
        </g>
      </svg>

      <p className="text-sm text-center min-h-[1.25rem]">
        {activeDept ? (
          <>
            <span className="font-mono text-accent-blue mr-2">{activeDept.code}</span>
            <span className="font-medium text-foreground">{activeDept.nom}</span>
          </>
        ) : (
          <span className="text-secondary">
            {en ? "Available across the whole region" : "Disponible sur toute la région"}
          </span>
        )}
      </p>

      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-secondary">
        <li className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
          {en ? "Home · Seraincourt (95)" : "Domicile · Seraincourt (95)"}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-violet" />
          {en ? "School · Ynov Nanterre (92)" : "École · Ynov Nanterre (92)"}
        </li>
      </ul>
    </div>
  );
}
