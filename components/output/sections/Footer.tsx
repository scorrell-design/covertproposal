"use client";

import CovertLogo from "@/components/shared/CovertLogo";

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "var(--covert-bg-secondary)",
        borderTop: "1px solid var(--covert-border)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1100px", paddingTop: "24px", paddingBottom: "24px" }}
      >
        <CovertLogo size={22} showWordmark={false} />
        <span style={{ fontSize: "12px", color: "var(--covert-text-secondary)" }}>
          © 2026 Clever Ventures, LLC
        </span>
      </div>
    </footer>
  );
}
