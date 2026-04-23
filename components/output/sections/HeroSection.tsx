"use client";

import { Shield } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";

interface HeroSectionProps {
  clientName: string;
}

export default function HeroSection({ clientName }: HeroSectionProps) {
  return (
    <section
      style={{
        paddingTop: "96px",
        paddingBottom: "48px",
        backgroundColor: "var(--covert-bg)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1100px", padding: "0 24px" }}>
        <SectionLabel icon={Shield} text="Intelligence Report" />

        <h1
          className="font-bold"
          style={{
            fontSize: "clamp(36px, 5vw, 54px)",
            lineHeight: 1.1,
            color: "var(--covert-black)",
            maxWidth: "900px",
          }}
        >
          The Opioid Risk{" "}
          <span className="relative inline-block">
            Already Embedded
            <span
              className="absolute left-0 right-0 bottom-0"
              style={{
                height: "3px",
                backgroundColor: "var(--covert-teal)",
                borderRadius: "2px",
              }}
            />
          </span>{" "}
          in Your Health Plan
        </h1>

        <p
          className="mt-6"
          style={{
            fontSize: "18px",
            color: "var(--covert-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "680px",
          }}
        >
          Prepared for <strong style={{ color: "var(--covert-black)" }}>{clientName}</strong>.
          This report translates your pharmacy claims data into an actionable
          plan to eliminate preventable opioid-related medical spend — without
          utilization management, prior authorization, or claims denial.
        </p>

        <div
          className="mt-10"
          style={{
            height: "1px",
            backgroundColor: "var(--covert-border)",
          }}
        />
      </div>
    </section>
  );
}
