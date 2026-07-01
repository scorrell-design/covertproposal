"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export interface NavSection {
  id: string;
  label: string;
}

interface OnThisPageNavProps {
  sections: NavSection[];
}

/**
 * Sticky "On This Page" rail for the long-scroll report. A vertical list of
 * section markers with a you-are-here indicator (scroll-spy) and click-to-jump.
 * Desktop-only, excluded from print/PDF. (NN/g in-page links.)
 */
export default function OnThisPageNav({ sections }: OnThisPageNavProps) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport that's intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trip when a section's top reaches the upper third of the viewport.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      className="no-print"
      aria-label="On this page"
      style={{
        position: "fixed",
        top: "50%",
        right: "28px",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "none",
        flexDirection: "column",
        gap: "4px",
      }}
      data-onthispage
    >
      {sections.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => jumpTo(s.id)}
            className="group flex items-center justify-end"
            style={{
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "5px 0",
            }}
          >
            <span
              className="opacity-0 group-hover:opacity-100"
              style={{
                fontSize: "var(--fs-caption)",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--covert-teal)" : "var(--on-dark-text-secondary)",
                transition: "opacity 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
                opacity: isActive ? 1 : undefined,
              }}
            >
              {s.label}
            </span>
            <span
              aria-hidden
              style={{
                display: "block",
                height: "2px",
                width: isActive ? "24px" : "14px",
                borderRadius: "1px",
                backgroundColor: isActive
                  ? "var(--covert-teal)"
                  : "rgba(255,255,255,0.25)",
                transition: "width 0.2s ease, background-color 0.2s ease",
              }}
            />
          </button>
        );
      })}
      <style>{`
        @media (min-width: 1280px) { nav[data-onthispage] { display: flex !important; } }
      `}</style>
    </nav>
  );
}
