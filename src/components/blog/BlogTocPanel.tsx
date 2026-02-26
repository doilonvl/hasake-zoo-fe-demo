"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, List, X } from "lucide-react";
import type { TocItem } from "@/types/blog";

type BlogTocPanelProps = {
  items: TocItem[];
  title: string;
};

export default function BlogTocPanel({ items, title }: BlogTocPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    if (!ids.length) return;
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.2 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    const target = panelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const pastTop = entry.boundingClientRect.top < 0;
        setShowFloating(!entry.isIntersecting && pastTop);
      },
      { rootMargin: "-10% 0px 0px 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsFloatingOpen(false);
  };

  useEffect(() => {
    if (!isFloatingOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFloatingOpen(false);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        floatingRef.current &&
        event.target instanceof Node &&
        !floatingRef.current.contains(event.target)
      ) {
        setIsFloatingOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFloatingOpen]);

  if (!items.length) return null;

  const list = (
    <nav className="mt-3 space-y-1 text-sm">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleScroll(item.id)}
          className={[
            "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition",
            item.level === 3 ? "pl-7 text-[13px]" : "text-sm font-medium",
            activeId === item.id
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-white/60 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          <span className="mt-[2px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/20" />
          <span className="line-clamp-2">{item.text}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Inline panel */}
      <div ref={panelRef} className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-3"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <List className="h-4 w-4 text-emerald-400" />
            {title}
          </span>
          <ChevronDown
            className={[
              "h-4 w-4 text-white/50 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
        </button>
        <div
          className={[
            "grid transition-all duration-300 ease-out",
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          ].join(" ")}
        >
          <div
            className="overflow-hidden [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
            data-lenis-prevent
          >{list}</div>
        </div>
      </div>

      {/* Floating elements rendered via Portal to avoid GSAP transform breaking fixed positioning */}
      {mounted &&
        createPortal(
          <>
            {/* Floating button */}
            <div
              className={[
                "fixed left-4 top-1/2 z-40 -translate-y-1/2 transition-opacity duration-200",
                showFloating && !isFloatingOpen
                  ? "opacity-100"
                  : "pointer-events-none opacity-0",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setIsFloatingOpen(true)}
                className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-slate-900/90 text-emerald-400 shadow-lg backdrop-blur-sm transition hover:scale-105"
                aria-label={title}
                aria-expanded={isFloatingOpen}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Floating panel */}
            <div
              className={[
                "fixed left-4 top-1/2 z-40 w-[280px] -translate-y-1/2 transition duration-200",
                isFloatingOpen && showFloating
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0",
              ].join(" ")}
              style={{ transformOrigin: "left center" }}
            >
              <div
                ref={floatingRef}
                className="rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <List className="h-4 w-4 text-emerald-400" />
                    {title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFloatingOpen(false)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-white/50 transition hover:bg-white/10"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div
                  className="mt-2 max-h-[60vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none" }}
                  data-lenis-prevent
                >
                  {list}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
