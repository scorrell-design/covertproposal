"use client";

import { CSSProperties } from "react";
import { useInView } from "react-intersection-observer";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface SplitFlapNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Total reveal length in ms (the last character lands by ~this time). */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Number reveal — the figure's characters fade up one-by-one, left to right,
 * on scroll-into-view, settling into place. A calm, deliberate reveal rather
 * than a slot-machine shuffle.
 *
 * PDF / reduced-motion safe: the final characters are always rendered (only
 * their opacity animates), so a reduced-motion user or a PDF capture shows the
 * correct, complete figure. The wrapper carries `data-count`, which pdfExport
 * forces to its final visible state.
 */
export default function SplitFlapNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1100,
  className,
  style,
}: SplitFlapNumberProps) {
  const text = `${prefix}${value.toLocaleString("en-US")}${suffix}`;
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const reduced = usePrefersReducedMotion();
  const shown = reduced || inView;

  const chars = text.split("");
  // Spread the per-character delay across the requested duration so longer
  // numbers don't reveal faster than short ones.
  const step = chars.length > 1 ? (duration * 0.7) / (chars.length - 1) : 0;

  return (
    <span
      ref={ref}
      data-count
      aria-label={text}
      className={className}
      style={{ ...style, display: "inline-block", whiteSpace: "pre" }}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(0.18em)",
            transition: reduced
              ? "none"
              : `opacity 0.45s ease-out ${i * step}ms, transform 0.45s ease-out ${i * step}ms`,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
