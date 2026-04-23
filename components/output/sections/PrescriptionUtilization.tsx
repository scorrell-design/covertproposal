"use client";

import { Pill } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
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

  return (
    <section
      ref={ref}
      style={{ padding: "64px 0", backgroundColor: "var(--covert-bg)" }}
    >
      <div
        className="mx-auto text-center"
        style={{ maxWidth: "1100px", padding: "0 24px" }}
      >
        <div className="flex justify-center">
          <SectionLabel icon={Pill} text="Prescription Utilization" />
        </div>

        <h2
          className="font-bold mt-2"
          style={{ fontSize: "28px", lineHeight: 1.25 }}
        >
          Where the Risk Lives in Your Population
        </h2>

        {/* Nested circle SVG */}
        <div className="flex justify-center mt-12 mb-10">
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`Nested circle showing ${data.pharmaciesDispensingOpioids} pharmacies dispensing opioids`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.9)",
              transition: "all 0.6s ease-out",
            }}
          >
            {/* Outer circle */}
            <circle cx="140" cy="140" r="138" fill="#12AA9E" />
            {/* Inner circle */}
            <circle cx="140" cy="140" r="80" fill="#F1FDFA" />
            {/* Inner text */}
            <text
              x="140"
              y="126"
              textAnchor="middle"
              fill="#6D7482"
              fontFamily="Cabin, sans-serif"
              fontSize="11"
              fontWeight="400"
            >
              <tspan x="140" dy="0">Pharmacies</tspan>
              <tspan x="140" dy="14">dispensing opioids</tspan>
            </text>
            <text
              x="140"
              y="168"
              textAnchor="middle"
              fill="#000000"
              fontFamily="Cabin, sans-serif"
              fontSize="36"
              fontWeight="700"
            >
              {data.pharmaciesDispensingOpioids}
            </text>
          </svg>
        </div>

        {/* Below the circle */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-semibold"
            style={{ fontSize: "13px", color: "var(--covert-teal)" }}
          >
            Members with opioid Rx
          </span>
          <span
            className="font-bold"
            style={{
              display: "inline-block",
              backgroundColor: "var(--covert-teal)",
              color: "#FFFFFF",
              borderRadius: "8px",
              padding: "4px 12px",
              fontSize: "18px",
            }}
          >
            {data.membersWithOpioidRx.toLocaleString()} ({opioidPercentage}%)
          </span>
          <span
            className="italic"
            style={{ fontSize: "11px", color: "var(--covert-text-secondary)" }}
          >
            versus average of 10%
          </span>
        </div>

        <div className="flex flex-col items-center mt-6 gap-1">
          <span
            className="font-bold"
            style={{ fontSize: "44px", color: "var(--covert-teal)" }}
          >
            30%
          </span>
          <span style={{ fontSize: "15px", color: "var(--covert-black)" }}>
            of opioid recipients are driving avoidable medical spend
          </span>
          <span
            className="italic"
            style={{ fontSize: "11px", color: "var(--covert-text-secondary)" }}
          >
            versus average of 30%
          </span>
        </div>

        <p
          className="mt-8 italic"
          style={{ fontSize: "12px", color: "var(--covert-text-secondary)" }}
        >
          *Based on CDC-aligned prescribing risk factors
        </p>
      </div>
    </section>
  );
}
