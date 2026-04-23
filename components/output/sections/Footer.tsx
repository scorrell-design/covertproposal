"use client";

import CovertLogo from "@/components/shared/CovertLogo";

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between px-6"
      style={{
        padding: "24px",
        backgroundColor: "var(--covert-bg-secondary)",
        borderTop: "1px solid var(--covert-border)",
      }}
    >
      <CovertLogo size={22} showWordmark={false} />
      <span style={{ fontSize: "12px", color: "var(--covert-text-secondary)" }}>
        © 2026 Clever Ventures, LLC
      </span>
    </footer>
  );
}
