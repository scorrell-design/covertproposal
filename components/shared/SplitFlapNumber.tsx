"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface SplitFlapNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Total animation length in ms. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

const DIGITS = "0123456789";

/**
 * Split-flap / departure-board number. On scroll-into-view, each digit shuffles
 * and "folds" into place, locking left-to-right — the deliberate, mechanical
 * read of a train-station board rather than a fast count-up.
 *
 * PDF / reduced-motion safe: it initializes to the FINAL value, so an
 * un-animated capture (or a reduced-motion user) always shows the correct
 * figure; the shuffle only plays as an enhancement when in view.
 */
export default function SplitFlapNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
  className,
  style,
}: SplitFlapNumberProps) {
  const target = `${prefix}${value.toLocaleString("en-US")}${suffix}`;
  const [display, setDisplay] = useState(target);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    // `display` already initializes to the final `target`, so a reduced-motion
    // user simply keeps that — no setState (and no shuffle) needed.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const chars = target.split("");
    const digitIdx = chars.reduce<number[]>((acc, c, i) => {
      if (/\d/.test(c)) acc.push(i);
      return acc;
    }, []);
    const n = digitIdx.length || 1;

    const start = performance.now();
    let raf = 0;
    let lastShuffle = 0;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      if (now - lastShuffle >= 55) {
        lastShuffle = now;
        const next = chars.slice();
        digitIdx.forEach((pos, di) => {
          // Each digit locks once the run passes its left-to-right threshold;
          // until then it keeps flipping through random glyphs.
          const lockAt = (di + 1) / n;
          next[pos] =
            progress >= lockAt
              ? chars[pos]
              : DIGITS[Math.floor(Math.random() * 10)];
        });
        setDisplay(next.join(""));
      }
      if (progress < 1) raf = requestAnimationFrame(frame);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span
      ref={ref}
      data-count
      aria-label={target}
      className={className}
      style={{ ...style, display: "inline-block", perspective: "600px" }}
    >
      {display.split("").map((ch, i) => {
        const isDigit = /\d/.test(ch);
        return (
          <span
            key={i}
            aria-hidden
            style={{ display: "inline-block", transformStyle: "preserve-3d" }}
          >
            {/* key on the glyph so a change remounts and replays the fold */}
            <span
              key={ch}
              style={{
                display: "inline-block",
                animation: isDigit
                  ? "flap 0.2s cubic-bezier(0.2, 0.75, 0.2, 1)"
                  : undefined,
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </span>
  );
}
