"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";

export function useCountUp(
  end: number,
  duration: number = 1500,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!startOnView || !inView || hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration, hasStarted, startOnView]);

  return { count, ref };
}

export function useLiveTicker(dailyCost: number) {
  const [accumulated, setAccumulated] = useState(0);
  const startTime = useRef(Date.now());
  const isPaused = useRef(false);

  const handleVisibility = useCallback(() => {
    isPaused.current = document.hidden;
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = setInterval(() => {
      if (isPaused.current) return;
      const elapsed = (Date.now() - startTime.current) / 1000;
      const costPerSecond = dailyCost / 86400;
      setAccumulated(Math.round(costPerSecond * elapsed));
    }, 2000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dailyCost, handleVisibility]);

  return accumulated;
}
