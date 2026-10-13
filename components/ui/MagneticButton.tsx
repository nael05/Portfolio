"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  type = "button",
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 25 });
  const springY = useSpring(y, { stiffness: 260, damping: 25 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.3;
    const distY = (e.clientY - centerY) * 0.3;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Tag
        href={href}
        onClick={onClick}
        type={href ? undefined : type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-300",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
