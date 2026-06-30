"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export function useCountUp(
  end: number,
  duration: number = 1900,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  // Ref (not state) so guarding against re-runs doesn't itself setState in the
  // effect body — the animation only ever starts once.
  const hasStarted = useRef(false);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!startOnView || !inView || hasStarted.current) return;
    hasStarted.current = true;

    // Respect reduced-motion: present the final figure without the ramp.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      const id = requestAnimationFrame(() => setCount(end));
      return () => cancelAnimationFrame(id);
    }

    let frame = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Smootherstep (6t⁵−15t⁴+10t³): eases gently in AND out, so the figure
      // glides up and settles precisely rather than snapping toward the target.
      // Reads as a deliberate, high-tech count rather than an aggressive blur.
      const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
      setCount(progress < 1 ? Math.round(eased * end) : end);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration, startOnView]);

  return { count, ref };
}

/**
 * Measure a container's pixel width (and re-measure on resize). Used to give
 * Recharts explicit dimensions instead of its ResponsiveContainer, which can
 * render an empty chart when its first async measurement is 0 — common inside
 * CSS grid cells with `min-width: 0`, and during PDF capture.
 */
export function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
