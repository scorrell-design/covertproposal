"use client";

import { Children, CSSProperties, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface StaggerProps {
  children: ReactNode;
  /** ms between each child's reveal. */
  step?: number;
  /** delay before the first child reveals, in ms. */
  baseDelay?: number;
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Reveals its direct children one-by-one as they scroll into view — e.g. a row
 * of stat tiles or a grid of rings cascading in. Acts as the layout container
 * itself (pass the grid/flex className/style), wrapping each child in a
 * revealing cell so the cascade never disturbs the grid.
 *
 * PDF-safe via the shared [data-reveal] override in pdfExport.
 */
export default function Stagger({
  children,
  step = 70,
  baseDelay = 0,
  distance = 18,
  className,
  style,
}: StaggerProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "0px 0px -48px 0px",
  });
  const reduced = usePrefersReducedMotion();
  const shown = reduced || inView;
  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className} style={style}>
      {items.map((child, i) => {
        const offset = baseDelay + i * step;
        return (
          <div
            key={i}
            data-reveal
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : `translateY(${distance}px)`,
              transition: reduced
                ? "none"
                : `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${offset}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${offset}ms`,
              willChange: reduced ? "auto" : "opacity, transform",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
