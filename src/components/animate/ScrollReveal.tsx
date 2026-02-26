"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  duration = 1,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Initial state based on direction
    const initialState: any = { opacity: 0 };
    const animateState: any = { opacity: 1 };

    switch (direction) {
      case "up":
        initialState.y = 60;
        animateState.y = 0;
        break;
      case "down":
        initialState.y = -60;
        animateState.y = 0;
        break;
      case "left":
        initialState.x = 60;
        animateState.x = 0;
        break;
      case "right":
        initialState.x = -60;
        animateState.x = 0;
        break;
      case "scale":
        initialState.scale = 0.8;
        animateState.scale = 1;
        break;
      case "fade":
        // Only opacity, no movement
        break;
    }

    gsap.set(element, initialState);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(element, {
      ...animateState,
      duration,
      delay,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
    };
  }, [direction, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
