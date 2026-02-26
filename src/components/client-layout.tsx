"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ClientLayoutProps = {
  children: ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

const LenisScrollSync = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // With ReactLenis root=true, Lenis syncs to window.scrollY directly.
    // scrollerProxy is NOT needed and causes jank by fighting Lenis's smooth scroll.
    // Just notify ScrollTrigger on each Lenis scroll tick.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return null;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollSettings: LenisOptions = isMobile
    ? {
        duration: 0.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: "vertical",
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.09,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      }
    : {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: "vertical",
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      };

  if (isAdmin) {
    return (
      <div className="page" ref={pageRef}>
        {children}
      </div>
    );
  }

  return (
    <ReactLenis root options={scrollSettings}>
      <LenisScrollSync />
      <div className="page" ref={pageRef}>
        {children}
      </div>
    </ReactLenis>
  );
}
