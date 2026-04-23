"use client";

import { useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import CovertLogo from "@/components/shared/CovertLogo";

interface NavBarProps {
  onBack: () => void;
  onDownloadPDF: () => Promise<void>;
}

export default function NavBar({ onBack, onDownloadPDF }: NavBarProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: "64px",
        backgroundColor: "var(--covert-black)",
      }}
    >
      <div className="flex items-center gap-4">
        <CovertLogo size={24} white showWordmark={false} />
        <span
          className="hidden sm:inline font-semibold"
          style={{ color: "#FFFFFF", fontSize: "14px" }}
        >
          Opioid Risk Intelligence Report
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-80"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            cursor: "pointer",
            padding: "8px 12px",
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 transition-colors duration-200"
          style={{
            backgroundColor: "var(--covert-teal)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "7px",
            padding: "8px 16px",
            fontWeight: 600,
            fontSize: "14px",
            cursor: isGenerating ? "wait" : "pointer",
            opacity: isGenerating ? 0.8 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isGenerating)
              e.currentTarget.style.backgroundColor = "var(--covert-teal-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--covert-teal)";
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={16} />
              Download PDF
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
