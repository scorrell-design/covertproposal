"use client";

import { CSSProperties, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface RevealProps {
  children: ReactNode;
  /** Delay before this element animates in, in ms. Use to stagger siblings. */
  delay?: number;
  /** Vertical travel distance, in px. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scroll-reveal wrapper — fades + rises its children into view once, giving the
 * report a continuous, alive feel instead of stacked static blocks.
 *
 * PDF-safe: the export clone carries the `data-reveal` attribute, and
 * pdfExport's light-override CSS forces every `[data-reveal]` to its final
 * visible state, so nothing is captured mid-animation or hidden.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 22,
  className,
  style,
}: RevealProps) {
  // threshold 0 + a small negative bottom margin → the section reveals the
  // instant its top edge enters the viewport, so tall sections never show a
  // blank top while waiting for a visibility ratio to be met.
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "0px 0px -64px 0px",
  });
  const reduced = usePrefersReducedMotion();
  // Reduced-motion users get the final state immediately — no fade, no travel.
  const shown = reduced || inView;

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${distance}px)`,
        transition: reduced
          ? "none"
          : `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: reduced ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
