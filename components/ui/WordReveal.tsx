"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { wordReveal, wordChild } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  children: string;
  className?: string;
  gradientWord?: string;
  once?: boolean;
}

export function WordReveal({
  children,
  className,
  gradientWord,
  once = true,
}: WordRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const words = children.split(" ");

  return (
    <motion.div
      ref={ref}
      variants={wordReveal}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn("flex flex-wrap gap-x-[0.3em] gap-y-1", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordChild}
          className={cn(
            "inline-block",
            gradientWord &&
              word.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ]/gi, "") ===
                gradientWord.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ]/gi, "") &&
              "gradient-text"
          )}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
