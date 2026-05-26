"use client";

interface CovertLogoProps {
  size?: number;
  white?: boolean;
  showWordmark?: boolean;
}

export default function CovertLogo({
  size = 32,
  white = false,
  showWordmark = true,
}: CovertLogoProps) {
  const textColor = white ? "#FFFFFF" : "var(--covert-black)";

  return (
    <div className="flex items-center" role="img" aria-label="Covert logo" style={{ gap: size * 0.35 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/covert-assets/dark-logo-only.png"
        alt=""
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          display: "block",
        }}
      />
      {showWordmark && (
        <span
          className="font-bold"
          style={{
            color: textColor,
            fontSize: size * 0.85,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Covert
        </span>
      )}
    </div>
  );
}
