"use client";

import { useEffect, useState } from "react";

export function AuroraBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle for performance is usually good, but requestAnimationFrame is better
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background" aria-hidden="true">
      {/* Global spotlight tracking mouse */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30 transition-opacity duration-300 will-change-transform"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 124, 255, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Premium subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Very subtle static gradient at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
