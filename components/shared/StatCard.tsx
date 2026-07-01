"use client";

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  borderColor?: string;
  valueColor?: string;
  valueSize?: string;
}

export default function StatCard({
  value,
  label,
  sublabel,
  borderColor = "var(--covert-teal)",
  valueColor = "var(--covert-black)",
  valueSize = "var(--fs-stat)",
}: StatCardProps) {
  return (
    <div
      className="bg-white transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: "1px solid var(--covert-border)",
        borderRadius: "12px",
        borderTop: `3px solid ${borderColor}`,
        padding: "24px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      <p
        className="font-bold"
        style={{ fontSize: valueSize, color: valueColor, lineHeight: 1.1 }}
      >
        {value}
      </p>
      <p
        className="mt-2"
        style={{
          fontSize: "var(--fs-label)",
          color: "var(--covert-text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {label}
      </p>
      {sublabel && (
        <p
          className="mt-1"
          style={{
            fontSize: "var(--fs-caption)",
            color: "var(--covert-text-secondary)",
          }}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
}
