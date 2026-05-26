"use client";

import { Play } from "lucide-react";

interface DemoModeToggleProps {
  onActivate: () => void;
}

export default function DemoModeToggle({ onActivate }: DemoModeToggleProps) {
  return (
    <button
      onClick={onActivate}
      className="flex items-center justify-center gap-2 w-full transition-colors duration-200"
      style={{
        border: "2px solid var(--covert-teal)",
        borderRadius: "999px",
        padding: "12px 24px",
        color: "var(--covert-teal)",
        fontWeight: 600,
        fontSize: "15px",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--covert-teal-light)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <Play size={16} />
      Try Demo with Sample Data
    </button>
  );
}
