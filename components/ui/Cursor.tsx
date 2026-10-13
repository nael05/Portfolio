"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isHovering = false;
    let rafId: number;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly move the dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".card")
      ) {
        isHovering = true;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0) scale(1.5)`;
          cursorRef.current.style.backgroundColor = "rgba(34, 211, 238, 0.1)";
        }
        if (dotRef.current) {
          dotRef.current.style.opacity = "0";
        }
      } else {
        isHovering = false;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0) scale(1)`;
          cursorRef.current.style.backgroundColor = "transparent";
        }
        if (dotRef.current) {
          dotRef.current.style.opacity = "1";
        }
      }
    };

    const animate = () => {
      // Lerp for the outer ring
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0) scale(${isHovering ? 1.5 : 1})`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    animate();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-cyan/50 pointer-events-none z-[100] mix-blend-difference hidden md:block transition-colors duration-200"
        style={{ transform: "translate3d(-100px, -100px, 0)", willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent-cyan rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block transition-opacity duration-200"
        style={{ transform: "translate3d(-100px, -100px, 0)", willChange: "transform" }}
      />
    </>
  );
}
