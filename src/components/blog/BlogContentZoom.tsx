"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export function BlogContentZoom({ children }: { children: ReactNode }) {
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);
  const [zoomedAlt, setZoomedAlt] = useState<string>("");

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Only respond to clicks on images inside a zoomable figure
    const figure = (target.tagName === "IMG" ? target.parentElement : null)
      ?.closest("figure[data-zoomable]")
      ?? target.closest("figure[data-zoomable]");
    if (!figure) return;
    const img = figure.querySelector("img");
    if (!img) return;
    setZoomedSrc(img.src);
    setZoomedAlt(img.alt || "");
  }, []);

  return (
    <div onClick={handleClick}>
      {children}
      {zoomedSrc &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setZoomedSrc(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedSrc(null);
              }}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomedSrc}
              alt={zoomedAlt}
              className="rounded-2xl shadow-2xl"
              style={{
                width: "90vw",
                height: "90vh",
                objectFit: "contain",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
