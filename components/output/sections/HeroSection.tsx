"use client";

import { Shield } from "lucide-react";

interface HeroSectionProps {
  clientName: string;
}

export default function HeroSection({ clientName }: HeroSectionProps) {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(96px, 12vw, 160px)",
        paddingBottom: "clamp(80px, 10vw, 140px)",
        backgroundColor: "var(--covert-black)",
        color: "#FFFFFF",
      }}
    >
      {/* Subtle dark-teal gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 20%, rgba(20,184,166,0.18) 0%, rgba(20,184,166,0) 60%), radial-gradient(50% 70% at 10% 110%, rgba(20,184,166,0.10) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: "20px" }}
        >
          <Shield size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Intelligence Report
          </span>
        </div>

        <h1
          className="font-bold"
          style={{
            fontSize: "clamp(40px, 5.6vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            maxWidth: "920px",
            textWrap: "balance",
          }}
        >
          The opioid risk{" "}
          <span style={{ color: "var(--covert-teal)" }}>
            already embedded
          </span>{" "}
          in your health plan.
        </h1>

        <p
          className="mt-8"
          style={{
            fontSize: "clamp(16px, 1.4vw, 19px)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
            maxWidth: "680px",
          }}
        >
          Prepared for{" "}
          <strong style={{ color: "#FFFFFF" }}>{clientName}</strong>. This
          report translates your pharmacy claims data into an actionable plan
          to eliminate preventable opioid-related medical spend — without
          utilization management, prior authorization, or claims denial.
        </p>

        <div
          className="flex items-center"
          style={{ marginTop: "40px", gap: "20px" }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              backgroundColor: "var(--covert-teal)",
              color: "#FFFFFF",
              borderRadius: "999px",
              padding: "10px 20px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Confidential · Client-Ready
          </div>
          <span
            className="hidden sm:inline"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Scroll for findings
          </span>
        </div>
      </div>
    </section>
  );
}
