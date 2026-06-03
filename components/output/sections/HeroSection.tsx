"use client";

import { Shield } from "lucide-react";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";

interface HeroSectionProps {
  data: PCRData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const heroStats = [
    {
      value: data.pharmaciesDispensingOpioids,
      label: "Pharmacies dispensing opioids",
    },
    {
      value: data.identifiedPrescribers,
      label: "Prescribers providing opioids to at-risk patients",
    },
    {
      value: data.membersWithOpioidRx,
      label: "Members with an opioid Rx",
    },
    {
      value: data.withdrawalSymptomMembers,
      label: "Members managing severe withdrawal symptoms",
    },
  ];

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
          className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,400px)] items-center"
          style={{ gap: "clamp(40px, 5vw, 72px)" }}
        >
          {/* Left column — headline + subtext */}
          <div>
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
              <strong style={{ color: "#FFFFFF" }}>{data.clientName}</strong>.
              This report translates your pharmacy claims data into an
              actionable plan to eliminate preventable opioid-related medical
              spend — without utilization management, prior authorization, or
              claims denial.
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

          {/* Right column — at-a-glance stat box */}
          <div
            className="w-full"
            style={{
              border: "1px solid var(--on-dark-border)",
              backgroundColor: "var(--on-dark-surface)",
              borderRadius: "16px",
              padding: "28px",
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              className="font-semibold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.16em",
                color: "var(--covert-teal)",
              }}
            >
              At a Glance
            </span>

            <div
              className="grid grid-cols-2"
              style={{ gap: "20px", marginTop: "20px" }}
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <p
                    className="font-bold"
                    style={{
                      fontSize: "clamp(30px, 3vw, 40px)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: "#FFFFFF",
                    }}
                  >
                    {formatNumber(stat.value)}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--on-dark-text-secondary)",
                      marginTop: "8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
