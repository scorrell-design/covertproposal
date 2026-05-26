"use client";

import CovertLogo from "@/components/shared/CovertLogo";

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "var(--covert-black)",
        borderTop: "1px solid var(--on-dark-border)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1100px", paddingTop: "32px", paddingBottom: "32px" }}
      >
        <CovertLogo size={24} white showWordmark />
        <span style={{ fontSize: "12px", color: "var(--on-dark-text-muted)" }}>
          © 2026 Clever Ventures, LLC
        </span>
      </div>
    </footer>
  );
}
