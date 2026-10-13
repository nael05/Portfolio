import { Variants, Transition } from "framer-motion";

// Spring configs
export const springSmooth: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 30,
};

// Reveal variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...springSmooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springSmooth },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springSmooth },
  },
};

// Word reveal for titles
export const wordReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const wordChild: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...springSmooth },
  },
};

// Card hover tilt
export const cardHover = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: { scale: 1.02 },
};

// Nav animations
export const navExpand: Variants = {
  collapsed: {
    width: "auto",
    transition: { ...springBouncy },
  },
  expanded: {
    width: "auto",
    transition: { ...springBouncy },
  },
};

// Accordion
export const accordionContent: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { ...springSmooth, opacity: { duration: 0.2 } },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { ...springSmooth, opacity: { duration: 0.3, delay: 0.1 } },
  },
};
