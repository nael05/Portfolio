"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percentage: number;
  label: string;
  sublabel: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  percentage,
  label,
  sublabel,
  size = 120,
  strokeWidth = 8,
  className,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient-ring)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isInView ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        <defs>
          <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#4F7CFF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="font-display font-bold text-lg">{label}</p>
        <p className="text-secondary text-sm">{sublabel}</p>
      </div>
    </div>
  );
}
