"use client";

import { LucideIcon } from "lucide-react";

interface SectionLabelProps {
  icon: LucideIcon;
  text: string;
}

export default function SectionLabel({ icon: Icon, text }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} style={{ color: "var(--covert-teal)" }} />
      <span
        className="font-bold uppercase"
        style={{
          fontSize: "11px",
          color: "var(--covert-teal)",
          letterSpacing: "0.8px",
        }}
      >
        {text}
      </span>
    </div>
  );
}
