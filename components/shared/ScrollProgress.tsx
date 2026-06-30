"use client";

import { useEffect, useState } from "react";

/**
 * Thin teal scroll-progress bar pinned to the bottom edge of the (64px) sticky
 * nav. Excluded from print/PDF.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="no-print"
      aria-hidden
      style={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 49,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, var(--covert-teal-mid), var(--covert-teal))",
          boxShadow: "0 0 10px rgba(20,184,166,0.7)",
          transition: "width 0.08s linear",
        }}
      />
    </div>
  );
}
