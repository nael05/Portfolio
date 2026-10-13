"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
  speed?: number;
}

export function Marquee({
  items,
  className,
  reverse = false,
  speed = 30,
}: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("overflow-hidden relative", className)}>
      <div
        className={cn(
          "flex gap-4 w-max",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="pill whitespace-nowrap text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
