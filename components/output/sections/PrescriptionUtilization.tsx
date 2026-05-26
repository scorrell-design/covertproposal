"use client";

import { Pill } from "lucide-react";
import { PCRData } from "@/lib/types";
import { useInView } from "react-intersection-observer";

interface PrescriptionUtilizationProps {
  data: PCRData;
}

export default function PrescriptionUtilization({
  data,
}: PrescriptionUtilizationProps) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const opioidPercentage =
    data.totalMembersWithAnyRx > 0
      ? Math.round((data.membersWithOpioidRx / data.totalMembersWithAnyRx) * 100)
      : 0;
  const withdrawalPercentage =
    data.membersWithOpioidRx > 0
      ? Math.round(
          (data.withdrawalSymptomMembers / data.membersWithOpioidRx) * 100,
        )
      : 0;

  return (
    <section
      ref={ref}
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(72px, 8vw, 112px)",
        paddingBottom: "clamp(72px, 8vw, 112px)",
        backgroundColor: "var(--covert-black)",
        color: "#FFFFFF",
      }}
    >
      {/* Subtle teal gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 100% 30%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <Pill size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Prescription Utilization
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "780px",
            textWrap: "balance",
          }}
        >
          Where the risk lives in{" "}
          <span style={{ color: "var(--covert-teal)" }}>your population.</span>
        </h2>

        {/* Top row: donut + headline stat */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1fr)",
            gap: "clamp(32px, 4vw, 56px)",
            marginTop: "48px",
          }}
        >
          {/* Donut visualization */}
          <div className="flex justify-center">
            <svg
              viewBox="0 0 420 420"
              width="100%"
              style={{
                maxWidth: "320px",
                height: "auto",
                opacity: inView ? 1 : 0,
                transform: inView ? "scale(1)" : "scale(0.92)",
                transition: "all 0.7s ease-out",
              }}
              role="img"
              aria-label={`${data.pharmaciesDispensingOpioids} pharmacies dispensing opioids`}
            >
              <circle cx="210" cy="210" r="180" fill="var(--covert-teal)" />
              <circle cx="210" cy="210" r="110" fill="var(--covert-black)" />
              <text
                x="210"
                y="178"
                textAnchor="middle"
                fontFamily="Satoshi, sans-serif"
                fontSize="15"
                fontWeight="500"
                fill="rgba(255,255,255,0.7)"
              >
                Pharmacies
              </text>
              <text
                x="210"
                y="198"
                textAnchor="middle"
                fontFamily="Satoshi, sans-serif"
                fontSize="15"
                fontWeight="500"
                fill="rgba(255,255,255,0.7)"
              >
                dispensing opioids
              </text>
              <text
                x="210"
                y="248"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Satoshi, sans-serif"
                fontSize="64"
                fontWeight="700"
                letterSpacing="-3"
                fill="#FFFFFF"
              >
                {data.pharmaciesDispensingOpioids}
              </text>
            </svg>
          </div>

          {/* Headline 30% stat — anchors the right side */}
          <div>
            <p
              className="font-bold"
              style={{
                fontSize: "clamp(56px, 6vw, 88px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--covert-teal)",
              }}
            >
              30%
            </p>
            <p
              style={{
                fontSize: "17px",
                color: "#FFFFFF",
                marginTop: "10px",
                lineHeight: 1.4,
                maxWidth: "360px",
              }}
            >
              of opioid recipients are driving avoidable medical spend
            </p>
            <p
              className="italic"
              style={{
                fontSize: "12px",
                color: "var(--on-dark-text-muted)",
                marginTop: "6px",
              }}
            >
              versus industry average of 30%
            </p>
          </div>
        </div>

        {/* Bottom row: 2 stat tiles horizontally */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <StatTile
            eyebrow="Members with opioid Rx"
            eyebrowColor="var(--covert-teal)"
            value={data.membersWithOpioidRx.toLocaleString()}
            percent={`${opioidPercentage}%`}
            note="versus average of 10%"
            accent="var(--covert-teal)"
          />
          <StatTile
            eyebrow="Members with severe withdrawal symptoms"
            eyebrowColor="#FF8A8A"
            value={data.withdrawalSymptomMembers.toLocaleString()}
            percent={`${withdrawalPercentage}% of opioid Rx`}
            note="Identified via cross-class prescribing pattern analysis"
            accent="var(--covert-red)"
          />
        </div>

        <p
          className="italic"
          style={{
            fontSize: "11px",
            color: "var(--on-dark-text-muted)",
            marginTop: "24px",
            textAlign: "right",
          }}
        >
          *Based on CDC-aligned prescribing risk factors
        </p>
      </div>
    </section>
  );
}

interface StatTileProps {
  eyebrow: string;
  eyebrowColor: string;
  value: string;
  percent: string;
  note: string;
  accent: string;
}

function StatTile({ eyebrow, eyebrowColor, value, percent, note, accent }: StatTileProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderRadius: "16px",
        padding: "22px 24px",
      }}
    >
      <p
        className="font-semibold uppercase"
        style={{
          fontSize: "11px",
          color: eyebrowColor,
          letterSpacing: "0.12em",
        }}
      >
        {eyebrow}
      </p>
      <div
        className="flex items-center"
        style={{ gap: "12px", marginTop: "10px", flexWrap: "wrap" }}
      >
        <span
          className="font-bold"
          style={{
            fontSize: "clamp(34px, 3.6vw, 46px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
          }}
        >
          {value}
        </span>
        <span
          className="inline-flex items-center justify-center font-semibold"
          style={{
            fontSize: "13px",
            color: "#FFFFFF",
            backgroundColor: accent,
            borderRadius: "999px",
            padding: "6px 14px",
            lineHeight: 1,
            minHeight: "26px",
            whiteSpace: "nowrap",
          }}
        >
          {percent}
        </span>
      </div>
      <p
        className="italic"
        style={{
          fontSize: "12px",
          color: "var(--on-dark-text-muted)",
          marginTop: "8px",
        }}
      >
        {note}
      </p>
    </div>
  );
}
