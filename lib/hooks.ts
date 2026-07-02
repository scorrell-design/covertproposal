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
 * Reactive `prefers-reduced-motion` flag. SSR-safe (false until mount) and
 * updates live if the OS setting changes. Motion wrappers use it to snap to
 * their final state instead of animating (WCAG 2.3.3).
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
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

/**
 * Shrink an element's font-size so its single-line content never spills out
 * of its own box (Steph 7/2 — large ticker figures were escaping their card).
 * `baseFontSize` is the element's design size (e.g. "var(--fs-stat)"): each
 * fit resets to it, measures, and only ever scales DOWN — short figures keep
 * the full design size. It must be passed explicitly because React owns the
 * inline style; clearing fontSize to "" would silently drop to the root 16px.
 * Re-fits on resize and when deps change.
 */
export function useFitText<T extends HTMLElement>(
  baseFontSize: string,
  deps: readonly unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = baseFontSize; // design size first, then measure
      const { scrollWidth, clientWidth } = el;
      if (clientWidth > 0 && scrollWidth > clientWidth) {
        const base = parseFloat(window.getComputedStyle(el).fontSize);
        const fitted = Math.floor((base * clientWidth) / scrollWidth);
        el.style.fontSize = `${Math.max(14, fitted)}px`;
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseFontSize, ...deps]);

  return ref;
}
