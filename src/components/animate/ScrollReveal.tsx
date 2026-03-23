"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
}: ScrollRevealProps) {
  const distance = 40;

  const initial: Record<string, number> = { opacity: 0 };
  const animate: Record<string, number> = { opacity: 1 };

  switch (direction) {
    case "up":
      initial.y = distance;
      animate.y = 0;
      break;
    case "down":
      initial.y = -distance;
      animate.y = 0;
      break;
    case "left":
      initial.x = distance;
      animate.x = 0;
      break;
    case "right":
      initial.x = -distance;
      animate.x = 0;
      break;
    case "scale":
      initial.scale = 0.85;
      animate.scale = 1;
      break;
    case "fade":
      break;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.1, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
