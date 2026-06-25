"use client";

import { useEffect, useRef } from "react";

/** Fires a single view-tracking ping when a prospect opens the public link. */
export default function ViewBeacon({ token }: { token: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/public/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {});
  }, [token]);
  return null;
}
