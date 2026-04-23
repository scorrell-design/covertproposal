"use client";

import { useState, useEffect } from "react";
import InputScreen from "@/components/input/InputScreen";
import OutputProposal from "@/components/output/OutputProposal";
import CovertLogo from "@/components/shared/CovertLogo";
import { PCRData, AppScreen } from "@/lib/types";
import { Check, Loader2 } from "lucide-react";

const GENERATION_STEPS = [
  "Parsing pharmacy claims",
  "Identifying risk patterns",
  "Calculating financial impact",
  "Generating proposal",
];

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("input");
  const [data, setData] = useState<PCRData | null>(null);
  const [generationStep, setGenerationStep] = useState(0);

  const handleGenerate = (pcrData: PCRData) => {
    setData(pcrData);
    setScreen("generating");
    setGenerationStep(0);
  };

  useEffect(() => {
    if (screen !== "generating") return;

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= GENERATION_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setScreen("output"), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [screen]);

  const handleBack = () => {
    setScreen("input");
    window.scrollTo(0, 0);
  };

  if (screen === "generating") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--covert-bg)" }}
      >
        <div className="flex flex-col items-center gap-8">
          <CovertLogo size={40} />
          <div className="flex flex-col gap-4" style={{ minWidth: "320px" }}>
            {GENERATION_STEPS.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3"
                style={{
                  opacity: i <= generationStep ? 1 : 0.3,
                  transition: "opacity 0.3s ease",
                }}
              >
                {i < generationStep ? (
                  <Check size={18} style={{ color: "var(--covert-teal)" }} />
                ) : i === generationStep ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                    style={{ color: "var(--covert-teal)" }}
                  />
                ) : (
                  <div style={{ width: "18px", height: "18px" }} />
                )}
                <span
                  className={i <= generationStep ? "font-semibold" : ""}
                  style={{
                    fontSize: "15px",
                    color:
                      i <= generationStep
                        ? "var(--covert-black)"
                        : "var(--covert-text-secondary)",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "output" && data) {
    return <OutputProposal data={data} onBack={handleBack} />;
  }

  return <InputScreen onGenerate={handleGenerate} />;
}
