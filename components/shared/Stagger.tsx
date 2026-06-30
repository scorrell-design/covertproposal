"use client";

import { Children, CSSProperties, ReactNode } from "react";
import { useInView } from "react-intersection-observer";

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
  step = 85,
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
  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className} style={style}>
      {items.map((child, i) => (
        <div
          key={i}
          data-reveal
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${distance}px)`,
            transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
              baseDelay + i * step
            }ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
              baseDelay + i * step
            }ms`,
            willChange: "opacity, transform",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
