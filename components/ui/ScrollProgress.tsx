"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] transform origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #22D3EE, #4F7CFF, #8B5CF6)",
      }}
    />
  );
}
