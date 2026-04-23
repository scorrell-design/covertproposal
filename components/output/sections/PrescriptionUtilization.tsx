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
      className="w-full"
      style={{ padding: "80px 0", backgroundColor: "var(--covert-bg)" }}
    >
      <div
        className="mx-auto text-center px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1100px" }}
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
            viewBox="0 0 420 420"
            width="420"
            height="420"
            style={{
              maxWidth: "100%",
              height: "auto",
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.9)",
              transition: "all 0.6s ease-out",
            }}
            role="img"
            aria-label={`${data.pharmaciesDispensingOpioids} pharmacies dispensing opioids`}
          >
            <circle cx="210" cy="210" r="180" fill="#12AA9E" />
            <circle cx="210" cy="210" r="110" fill="#F1FDFA" />
            <text
              x="210"
              y="178"
              textAnchor="middle"
              fontFamily="Cabin, sans-serif"
              fontSize="16"
              fontWeight="400"
              fill="#64748B"
            >
              Pharmacies
            </text>
            <text
              x="210"
              y="198"
              textAnchor="middle"
              fontFamily="Cabin, sans-serif"
              fontSize="16"
              fontWeight="400"
              fill="#64748B"
            >
              dispensing opioids
            </text>
            <text
              x="210"
              y="240"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Cabin, sans-serif"
              fontSize="56"
              fontWeight="700"
              fill="#0F172A"
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
