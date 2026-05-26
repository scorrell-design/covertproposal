"use client";

import { ArrowRight } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function GenerateButton({
  onClick,
  disabled,
}: GenerateButtonProps) {
  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-10"
      style={{
        padding: "16px 0",
        background:
          "linear-gradient(transparent, var(--covert-bg) 30%)",
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center gap-2 w-full transition-all duration-200"
        style={{
          backgroundColor: disabled
            ? "var(--covert-border)"
            : "var(--covert-teal)",
          color: disabled ? "var(--covert-text-secondary)" : "#FFFFFF",
          borderRadius: "999px",
          padding: "14px 32px",
          fontWeight: 600,
          fontSize: "16px",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!disabled)
            e.currentTarget.style.backgroundColor = "var(--covert-teal-dark)";
        }}
        onMouseLeave={(e) => {
          if (!disabled)
            e.currentTarget.style.backgroundColor = "var(--covert-teal)";
        }}
      >
        Generate Proposal
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
