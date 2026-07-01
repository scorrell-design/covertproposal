"use client";

import { Shield } from "lucide-react";
import { PCRData } from "@/lib/types";

interface HeroSectionProps {
  data: PCRData;
}

/**
 * Single-column editorial hero (Jesse 6/26). The former "At a Glance" stat box
 * was removed — those figures now live once, in the "What the Data Shows"
 * section below, so nothing is repeated.
 */
export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(88px, 11vw, 144px)",
        paddingBottom: "clamp(56px, 7vw, 96px)",
        backgroundColor: "transparent",
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
              fontSize: "var(--fs-eyebrow)",
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
            fontSize: "var(--fs-hero)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            textWrap: "balance",
          }}
        >
          The opioid risk{" "}
          <span style={{ color: "var(--covert-teal)" }}>already embedded</span>{" "}
          in your health plan.
        </h1>

        <p
          className="mt-8"
          style={{
            fontSize: "var(--fs-lead)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
            maxWidth: "720px",
          }}
        >
          Prepared for{" "}
          <strong style={{ color: "#FFFFFF" }}>{data.clientName}</strong>. This
          report provides an executive overview of how opioid prescribing is
          impacting your health plan, your members, and your healthcare costs.
          It also illustrates how identifying opioid risk through withdrawal
          months earlier creates an opportunity to prevent future addiction,
          save lives, and reduce avoidable healthcare costs.
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
              fontSize: "var(--fs-caption)",
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
              fontSize: "var(--fs-caption)",
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
