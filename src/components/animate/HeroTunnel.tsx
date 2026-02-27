"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface HeroTunnelProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/* ─── Deterministic pseudo-random (avoids SSR/client hydration mismatch) ─── */
function seededValues(count: number, seed: number = 7): number[] {
  const vals: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 16807 + 11) % 2147483647;
    vals.push((s % 1000) / 1000);
  }
  return vals;
}

const RAY_RANDOMS = seededValues(24, 42);
const PARTICLE_RANDOMS = seededValues(120, 73);

export function HeroTunnel({
  title = "Hasake",
  subtitle = "Habitat Solutions",
  children,
}: HeroTunnelProps) {
  const { t } = useTranslation();
  const spacerRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const prismaticRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const spacer = spacerRef.current;
    const tunnel = tunnelRef.current;
    const content = contentRef.current;
    const bg = bgRef.current;
    const rays = raysRef.current;
    const prismatic = prismaticRef.current;
    if (!spacer || !tunnel || !content || !bg || !rays || !prismatic) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animation 1: Scale mask from 1 → 50 (opens the cave hole wide)
    tl.to(tunnel, { scale: 50, ease: "power2.in", duration: 0.85 }, 0);

    // Animation 2: Fade out "Hasake" title text + scale up
    tl.to(
      content,
      { opacity: 0, scale: 2, ease: "power1.in", duration: 0.5 },
      0,
    );

    // Animation 3: Deep cinematic pan — move the entire 200vh world
    // UP by 100vh so we travel from treetops down to the jungle floor
    // where the hero content text is anchored
    tl.to(bg, { y: "-100vh", ease: "power1.inOut", duration: 1 }, 0);

    // Animation 4: Light rays pulse during opening
    tl.fromTo(
      rays,
      { opacity: 0 },
      { opacity: 0.6, ease: "power2.in", duration: 0.4 },
      0.05,
    );
    tl.to(rays, { opacity: 0, ease: "power1.out", duration: 0.45 }, 0.4);

    // Animation 5: Chromatic aberration flare during peak opening
    tl.fromTo(
      prismatic,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1.05, ease: "power2.in", duration: 0.3 },
      0.15,
    );
    tl.to(
      prismatic,
      { opacity: 0, scale: 1.2, ease: "power1.out", duration: 0.5 },
      0.45,
    );

    // Animation 6: Fade out mask at the very end (85→100%)
    tl.to(tunnel, { opacity: 0, ease: "none", duration: 0.15 }, 0.85);

    // NO background fade-out — the jungle stays visible,
    // subsequent content (z-40) will scroll over it naturally
  });

  /* ─────────────────────────────────────────────────────────
   * UNIFIED POSTER ARCHITECTURE — the jungle image and the
   * hero content are ONE tall "world" (200vh). GSAP pans
   * this upward so the user travels from canopy to floor.
   * ───────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── LAYER 1: The Immersive World (z-0) ──
           A 200vh tall poster: jungle image fills it entirely,
           hero content text is anchored at the bottom.
           GSAP pans this upward by 100vh during scroll. */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden"
        style={{ zIndex: 0, pointerEvents: "none" }}
      >
        <div
          ref={bgRef}
          className="relative w-full"
          style={{ height: "200vh", willChange: "transform" }}
        >
          {/* The tall jungle image — covers the full 200vh poster */}
          <Image
            src="/Banner/animal-banner.png"
            alt="Wildlife Habitat"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />

          {/* Bottom gradient for text readability over the jungle */}
          <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Hero content anchored at the bottom of the world */}
          {children && (
            <div
              className="absolute bottom-20 left-0 w-full"
              style={{ pointerEvents: "auto" }}
            >
              {children}
            </div>
          )}
        </div>
      </div>

      {/* ── LAYER 2: The Tunnel / Cave Mask (z-10) ──
           GSAP scales this from 1→50 then fades it out. */}
      <div
        ref={tunnelRef}
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: 10,
          pointerEvents: "none",
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <div className="absolute inset-0">
          {/* Radial transparent hole with enhanced emerald-tinted edge glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(
                ellipse 28% 38% at 50% 50%,
                transparent 0%,
                transparent 70%,
                rgba(80,200,140,0.04) 74%,
                rgba(40,160,100,0.06) 77%,
                rgba(5,20,10,0.3) 80%,
                rgba(5,20,10,0.7) 85%,
                rgb(5,20,10) 95%
              )`,
            }}
          />

          {/* Top canopy — enhanced with depth layers + vine silhouettes */}
          <svg
            className="absolute top-0 left-0 w-full h-[45%]"
            viewBox="0 0 1440 500"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="canopyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(5,20,10)" />
                <stop offset="70%" stopColor="rgb(5,20,10)" />
                <stop
                  offset="100%"
                  stopColor="rgb(8,30,15)"
                  stopOpacity="0.85"
                />
              </linearGradient>
              <linearGradient id="vineGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(5,20,10)" />
                <stop
                  offset="80%"
                  stopColor="rgb(15,40,20)"
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(40,100,60)"
                  stopOpacity="0.15"
                />
              </linearGradient>
            </defs>
            {/* Main canopy mass */}
            <path
              d="M0,0 H1440 V200 Q1400,280 1300,250 Q1200,220 1100,300 Q1050,340 950,290 Q880,250 800,310 Q740,360 680,300 Q620,250 560,320 Q500,370 420,290 Q360,230 280,300 Q200,360 140,280 Q80,220 0,260 Z"
              fill="url(#canopyGrad)"
            />
            {/* Hanging vines */}
            <path
              d="M200,200 Q210,320 190,380 Q180,400 200,420 Q220,400 210,380 Q190,320 220,200 Z"
              fill="url(#vineGlow)"
              opacity="0.8"
            />
            <path
              d="M450,250 Q460,350 440,400 Q430,430 450,450 Q470,430 460,400 Q440,350 470,250 Z"
              fill="url(#vineGlow)"
              opacity="0.7"
            />
            <path
              d="M900,220 Q910,330 890,380 Q880,410 900,430 Q920,410 910,380 Q890,330 920,220 Z"
              fill="url(#vineGlow)"
              opacity="0.8"
            />
            <path
              d="M1150,240 Q1160,340 1140,390 Q1130,420 1150,440 Q1170,420 1160,390 Q1140,340 1170,240 Z"
              fill="url(#vineGlow)"
              opacity="0.7"
            />
            <path
              d="M650,180 Q660,300 640,360 Q630,390 650,410 Q670,390 660,360 Q640,300 670,180 Z"
              fill="url(#vineGlow)"
              opacity="0.6"
            />
            {/* Extra foliage depth — layered leaf shapes */}
            <path
              d="M100,260 Q130,300 160,270 Q190,240 220,280 Q180,310 140,290 Z"
              fill="rgb(8,30,15)"
              opacity="0.5"
            />
            <path
              d="M750,310 Q780,340 820,310 Q850,280 880,320 Q840,350 790,330 Z"
              fill="rgb(8,30,15)"
              opacity="0.45"
            />
            <path
              d="M1200,250 Q1230,290 1260,260 Q1290,230 1320,270 Q1280,300 1240,280 Z"
              fill="rgb(8,30,15)"
              opacity="0.4"
            />
          </svg>

          {/* Bottom cave floor — enhanced with stalactite depth */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[35%]"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="floorGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgb(5,20,10)" />
                <stop offset="60%" stopColor="rgb(5,20,10)" />
                <stop
                  offset="100%"
                  stopColor="rgb(10,35,18)"
                  stopOpacity="0.8"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,400 H1440 V180 Q1380,140 1300,200 Q1220,260 1140,180 Q1080,120 980,200 Q920,260 840,180 Q780,120 700,200 Q640,260 560,180 Q500,120 420,200 Q360,260 280,180 Q200,100 120,200 Q60,260 0,180 Z"
              fill="url(#floorGrad)"
            />
            {/* Stalagmites with subtle glow tips */}
            <path
              d="M300,400 L315,270 L330,400 Z"
              fill="rgb(5,20,10)"
              opacity="0.9"
            />
            <path
              d="M315,275 L317,270 L319,275 Z"
              fill="rgb(40,120,70)"
              opacity="0.12"
            />
            <path
              d="M700,400 L715,290 L730,400 Z"
              fill="rgb(5,20,10)"
              opacity="0.9"
            />
            <path
              d="M715,295 L717,290 L719,295 Z"
              fill="rgb(40,120,70)"
              opacity="0.12"
            />
            <path
              d="M1100,400 L1115,300 L1130,400 Z"
              fill="rgb(5,20,10)"
              opacity="0.9"
            />
            <path
              d="M1115,305 L1117,300 L1119,305 Z"
              fill="rgb(40,120,70)"
              opacity="0.12"
            />
            {/* Extra ground rocks */}
            <path
              d="M500,400 L510,340 L520,400 Z"
              fill="rgb(5,20,10)"
              opacity="0.7"
            />
            <path
              d="M900,400 L908,350 L916,400 Z"
              fill="rgb(5,20,10)"
              opacity="0.7"
            />
          </svg>

          {/* Left wall — enhanced with moss texture */}
          <svg
            className="absolute top-0 left-0 h-full w-[30%]"
            viewBox="0 0 400 900"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wallLeftGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(5,20,10)" />
                <stop offset="70%" stopColor="rgb(5,20,10)" />
                <stop
                  offset="100%"
                  stopColor="rgb(12,40,22)"
                  stopOpacity="0.7"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,0 H200 Q250,100 220,200 Q180,320 230,420 Q280,500 200,580 Q150,650 220,740 Q260,800 200,900 H0 Z"
              fill="url(#wallLeftGrad)"
            />
            {/* Moss highlights */}
            <path
              d="M195,300 Q210,310 200,330 Q190,310 195,300 Z"
              fill="rgb(30,80,45)"
              opacity="0.15"
            />
            <path
              d="M210,500 Q225,510 215,530 Q205,510 210,500 Z"
              fill="rgb(30,80,45)"
              opacity="0.12"
            />
            <path
              d="M185,700 Q200,710 190,730 Q180,710 185,700 Z"
              fill="rgb(30,80,45)"
              opacity="0.1"
            />
          </svg>

          {/* Right wall — enhanced with moss texture */}
          <svg
            className="absolute top-0 right-0 h-full w-[30%]"
            viewBox="0 0 400 900"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wallRightGrad" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="rgb(5,20,10)" />
                <stop offset="70%" stopColor="rgb(5,20,10)" />
                <stop
                  offset="100%"
                  stopColor="rgb(12,40,22)"
                  stopOpacity="0.7"
                />
              </linearGradient>
            </defs>
            <path
              d="M400,0 H200 Q150,100 180,200 Q220,320 170,420 Q120,500 200,580 Q250,650 180,740 Q140,800 200,900 H400 Z"
              fill="url(#wallRightGrad)"
            />
            {/* Moss highlights */}
            <path
              d="M205,250 Q190,260 200,280 Q210,260 205,250 Z"
              fill="rgb(30,80,45)"
              opacity="0.15"
            />
            <path
              d="M190,450 Q175,460 185,480 Q195,460 190,450 Z"
              fill="rgb(30,80,45)"
              opacity="0.12"
            />
            <path
              d="M215,650 Q200,660 210,680 Q220,660 215,650 Z"
              fill="rgb(30,80,45)"
              opacity="0.1"
            />
          </svg>

          {/* Inner edge glow — soft emerald light leaking through the tunnel opening */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(
                ellipse 30% 40% at 50% 50%,
                transparent 60%,
                rgba(52,211,153,0.03) 72%,
                rgba(52,211,153,0.06) 78%,
                transparent 90%
              )`,
            }}
          />
        </div>
      </div>

      {/* ── LAYER 2b: Chromatic Aberration Ring (z-11) ──
           Subtle prismatic refraction that flares during the tunnel opening */}
      <div
        ref={prismaticRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 11,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 32% 42% at 50% 50%,
              transparent 55%,
              rgba(255,80,80,0.1) 65%,
              rgba(255,80,80,0.03) 75%,
              transparent 85%
            )`,
            transform: "translate(3px, -2px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 32% 42% at 50% 50%,
              transparent 55%,
              rgba(80,255,160,0.1) 65%,
              rgba(80,255,160,0.03) 75%,
              transparent 85%
            )`,
            transform: "translate(-2px, 2px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 32% 42% at 50% 50%,
              transparent 55%,
              rgba(100,140,255,0.1) 65%,
              rgba(100,140,255,0.03) 75%,
              transparent 85%
            )`,
            transform: "translate(0px, 3px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 30% 40% at 50% 50%,
              transparent 50%,
              rgba(255,220,100,0.05) 62%,
              transparent 75%
            )`,
          }}
        />
      </div>

      {/* ── LAYER 2c: Volumetric Light Rays (z-12) ──
           God-rays that pulse as the tunnel opens — sunlight breaking in */}
      <div
        ref={raysRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 12,
          opacity: 0,
          willChange: "opacity",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="rayGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(160,255,200,0.25)" />
              <stop offset="30%" stopColor="rgba(160,255,200,0.06)" />
              <stop offset="100%" stopColor="rgba(160,255,200,0)" />
            </radialGradient>
          </defs>

          {Array.from({ length: 12 }, (_, i) => {
            const angle = (360 / 12) * i;
            const op = 0.12 + RAY_RANDOMS[i * 2] * 0.12;
            const w = 1.5 + RAY_RANDOMS[i * 2 + 1] * 2.5;
            return (
              <g key={i} transform={`rotate(${angle} 500 500)`}>
                <line
                  x1="500"
                  y1="500"
                  x2="500"
                  y2="50"
                  stroke="rgba(180,255,220,0.12)"
                  strokeWidth={w}
                  opacity={op}
                />
                <line
                  x1="500"
                  y1="500"
                  x2="500"
                  y2="50"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={w * 3}
                  opacity={op * 0.4}
                />
              </g>
            );
          })}

          <circle cx="500" cy="500" r="100" fill="url(#rayGlow)" />
        </svg>
      </div>

      {/* ── LAYER 2d: Floating Particles / Dust Motes (z-13) ── */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 13 }}
      >
        {Array.from({ length: 20 }, (_, i) => {
          const r = PARTICLE_RANDOMS;
          const b = i * 6;
          const size = 2 + r[b] * 3;
          const left = 30 + r[b + 1] * 40;
          const top = 25 + r[b + 2] * 50;
          const delay = r[b + 3] * 6;
          const duration = 4 + r[b + 4] * 4;
          const isGreen = r[b + 5] > 0.5;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: isGreen
                  ? "rgba(160,255,200,0.35)"
                  : "rgba(255,255,255,0.25)",
                boxShadow: isGreen
                  ? "0 0 6px rgba(160,255,200,0.25)"
                  : "0 0 4px rgba(255,255,255,0.15)",
                animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
        <style>{`
          @keyframes floatParticle {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.3;
            }
            25% {
              transform: translate(10px, -15px) scale(1.2);
              opacity: 0.6;
            }
            50% {
              transform: translate(-8px, -25px) scale(0.8);
              opacity: 0.4;
            }
            75% {
              transform: translate(12px, -10px) scale(1.1);
              opacity: 0.7;
            }
          }
        `}</style>
      </div>

      {/* ── LAYER 3: The "Hasake" Title (z-20) ──
           Fixed + centered. GSAP fades & scales this out. */}
      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center"
        style={{ zIndex: 20, pointerEvents: "none" }}
      >
        <div ref={contentRef} style={{ willChange: "transform, opacity" }}>
          <div className="text-center">
            <h1 className="text-8xl lg:text-[10rem] font-bold text-white tracking-tighter leading-none drop-shadow-2xl">
              {title}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent to-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              <p
                className="text-white text-xl lg:text-3xl font-medium tracking-[0.3em] uppercase"
                style={{
                  textShadow:
                    "0 0 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.9)",
                }}
              >
                {subtitle}
              </p>
              <div className="w-20 h-[2px] bg-gradient-to-l from-transparent to-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
            <p
              className="mt-8 text-white text-lg lg:text-xl max-w-md mx-auto font-light"
              style={{
                textShadow:
                  "0 0 16px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)",
              }}
            >
              {t("home:scrollToExplore")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-2 animate-bounce">
              <svg
                className="w-7 h-7 text-white/80 drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── LAYER 4: The Scroll Spacer (z-30) ──
           Creates scroll height for GSAP scrub.
           pointer-events: none so buttons in LAYER 1 remain clickable. */}
      <div
        ref={spacerRef}
        className="relative"
        style={{ height: "500vh", zIndex: 30, pointerEvents: "none" }}
      />
    </>
  );
}
