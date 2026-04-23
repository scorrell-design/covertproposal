"use client";

import CovertLogo from "@/components/shared/CovertLogo";
import { PCRData } from "@/lib/types";
import {
  calcPreventableSpend,
  calcMonthlyPreventable,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";

interface NextStepsCTAProps {
  data: PCRData;
}

export default function NextStepsCTA({ data }: NextStepsCTAProps) {
  const preventable = calcPreventableSpend(data.withdrawalSymptomMembers);
  const monthly = calcMonthlyPreventable(preventable);

  return (
    <section
      className="w-full"
      style={{
        paddingTop: "80px",
        paddingBottom: "64px",
        backgroundColor: "var(--covert-black)",
      }}
    >
      <div
        className="mx-auto text-center px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "760px" }}
      >
        <span
          className="font-bold uppercase"
          style={{
            fontSize: "10px",
            color: "var(--covert-teal)",
            letterSpacing: "0.8px",
          }}
        >
          Next Steps
        </span>

        <h2
          className="font-bold"
          style={{
            fontSize: "32px",
            color: "#FFFFFF",
            lineHeight: 1.25,
            marginTop: "20px",
            textWrap: "balance",
          }}
        >
          Your plan has{" "}
          <span style={{ color: "var(--covert-teal)" }}>
            {formatNumber(data.identifiedMembers)} members
          </span>{" "}
          directly affected by the prescribing patterns above.
        </h2>

        <p
          style={{
            marginTop: "24px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.7,
          }}
        >
          The data in this report represents real, actionable intelligence from
          your pharmacy claims — {formatNumber(data.identifiedMembers)}{" "}
          identified members, {formatNumber(data.identifiedPrescribers)}{" "}
          prescribers contributing to the pattern, and{" "}
          <strong>{formatCurrency(preventable)}</strong> in preventable annual
          spend. Every month of delay adds ~
          <strong>{formatCurrency(monthly)}</strong> to your exposure.
          Covert&apos;s intervention model addresses prescriber behavior at its
          source, preventing the downstream costs that compound year over year.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap justify-center"
          data-cta-buttons
          style={{ gap: "16px", marginTop: "36px" }}
        >
          <button
            className="flex items-center gap-2 transition-colors duration-200 font-semibold"
            style={{
              backgroundColor: "var(--covert-teal)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "7px",
              padding: "14px 28px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--covert-teal-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--covert-teal)")
            }
          >
            Engage Covert Today →
          </button>
          <button
            className="transition-opacity duration-200 hover:opacity-80 font-semibold"
            style={{
              backgroundColor: "transparent",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "7px",
              padding: "14px 28px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Schedule a Review
          </button>
        </div>

        {/* Attribution */}
        <div
          className="flex items-center justify-center"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            marginTop: "48px",
            gap: "12px",
          }}
        >
          <CovertLogo size={20} white showWordmark={false} />
          <span>
            © 2026 Clever Ventures, LLC · Prepared for {data.clientName}
          </span>
        </div>
      </div>
    </section>
  );
}
