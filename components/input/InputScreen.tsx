"use client";

import { useReducer, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import CovertLogo from "@/components/shared/CovertLogo";
import SignOutButton from "@/components/shared/SignOutButton";
import PCRUploader from "./PCRUploader";
import DemoModeToggle from "./DemoModeToggle";
import DataFormSections from "./DataFormSections";
import GenerateButton from "./GenerateButton";
import { PCRData } from "@/lib/types";
import { DEMO_DATA } from "@/lib/demoData";
import { parsePCRFileDetailed } from "@/lib/pcrParser";
import type { Provenance } from "@/lib/pcr/types";

export interface GenerateOptions {
  isDemo: boolean;
  provenance?: Provenance;
  /** Name of the uploaded PCR file, so the history shows what generated each proposal. */
  sourceFileName?: string;
}

interface State {
  status: "empty" | "parsing" | "loaded";
  data: PCRData | null;
  isDemo: boolean;
  provenance?: Provenance;
  sourceFileName?: string;
  needsReview: string[];
  error: string | null;
}

type Action =
  | { type: "START_PARSING" }
  | { type: "PARSE_FAILED"; error: string }
  | {
      type: "DATA_LOADED";
      data: PCRData;
      isDemo: boolean;
      provenance?: Provenance;
      sourceFileName?: string;
      needsReview?: string[];
    }
  | { type: "UPDATE_DATA"; data: PCRData };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_PARSING":
      return { ...state, status: "parsing", error: null };
    case "PARSE_FAILED":
      return { ...state, status: "empty", error: action.error };
    case "DATA_LOADED":
      return {
        status: "loaded",
        data: action.data,
        isDemo: action.isDemo,
        provenance: action.provenance,
        sourceFileName: action.sourceFileName,
        needsReview: action.needsReview ?? [],
        error: null,
      };
    case "UPDATE_DATA":
      return { ...state, data: action.data };
    default:
      return state;
  }
}

// Human-readable labels for the fields the extractor flags for review.
const FIELD_LABELS: Record<string, string> = {
  withdrawalSymptomMembers: "Members managing severe withdrawal",
  catastrophicRisk: "Risk tier — Catastrophic",
  severeRisk: "Risk tier — Severe",
  highRisk: "Risk tier — High",
  moderateRisk: "Risk tier — Moderate",
  earlyWithdrawal: "Risk tier — Medically emergent withdrawal",
  matMembers: "Risk tier — MAT enrolled",
  chronicOpioidPrescribers: "Chronic opioid prescribers",
  acuteOpioidPrescribers: "Acute opioid prescribers",
  membersMultiplePrescribers: "Members using multiple prescribers",
  membersOver3Refills: "Members receiving >3 refills",
  wsiBreakdown: "Withdrawal symptom breakdown (chart)",
  chronicConditions: "Chronic conditions breakdown (chart)",
};

function reviewLabel(key: string): string {
  return (
    FIELD_LABELS[key] ??
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
  );
}

interface InputScreenProps {
  onGenerate: (data: PCRData, opts: GenerateOptions) => void;
}

export default function InputScreen({ onGenerate }: InputScreenProps) {
  const [state, dispatch] = useReducer(reducer, {
    status: "empty",
    data: null,
    isDemo: false,
    needsReview: [],
    error: null,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    dispatch({ type: "START_PARSING" });
    try {
      const result = await parsePCRFileDetailed(file);
      dispatch({
        type: "DATA_LOADED",
        data: result.data,
        isDemo: false,
        provenance: result.provenance,
        sourceFileName: file.name,
        needsReview: result.needsReview as string[],
      });
    } catch (err) {
      dispatch({
        type: "PARSE_FAILED",
        error: err instanceof Error ? err.message : "Could not read the PCR.",
      });
    }
  }, []);

  const handleDemoMode = useCallback(() => {
    dispatch({ type: "DATA_LOADED", data: { ...DEMO_DATA }, isDemo: true });
  }, []);

  const handleDataChange = useCallback((data: PCRData) => {
    dispatch({ type: "UPDATE_DATA", data });
  }, []);

  const canGenerate =
    state.status === "loaded" &&
    state.data !== null &&
    state.data.clientName.trim().length > 0;

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--covert-bg)" }}>
      <nav
        className="w-full"
        style={{
          borderBottom: "1px solid var(--covert-border)",
          backgroundColor: "var(--covert-bg)",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16"
          style={{ height: "64px", maxWidth: "720px" }}
        >
          <CovertLogo size={28} />
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5"
              style={{ fontSize: "14px", fontWeight: 600, color: "var(--covert-text-secondary)" }}
            >
              <ArrowLeft size={15} />
              Dashboard
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "720px", paddingTop: "48px", paddingBottom: "120px" }}
      >
        <div className="mb-8">
          <h1 className="font-bold" style={{ fontSize: "38px", lineHeight: 1.15 }}>
            Opioid Risk Intelligence Report Generator
          </h1>
          <p
            className="mt-3"
            style={{
              fontSize: "17px",
              color: "var(--covert-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Upload a Pharmacy Claims Review (PCR) to generate a client-ready
            opioid risk proposal in under 60 seconds.
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <PCRUploader
            onFileSelect={handleFileSelect}
            isLoading={state.status === "parsing"}
          />

          {state.error && (
            <p style={{ fontSize: "14px", color: "var(--covert-red, #DC2626)" }}>
              {state.error}
            </p>
          )}

          <div
            className="flex items-center gap-4"
            style={{ color: "var(--covert-text-secondary)", fontSize: "14px" }}
          >
            <div
              className="flex-1"
              style={{ height: "1px", backgroundColor: "var(--covert-border)" }}
            />
            or
            <div
              className="flex-1"
              style={{ height: "1px", backgroundColor: "var(--covert-border)" }}
            />
          </div>

          <DemoModeToggle onActivate={handleDemoMode} />
        </div>

        {state.data && state.needsReview.length > 0 && (
          <div
            className="flex items-start gap-3 mb-6"
            style={{
              backgroundColor: "#FFF7ED",
              border: "1px solid #FED7AA",
              borderRadius: "12px",
              padding: "16px 18px",
            }}
          >
            <AlertTriangle size={18} style={{ color: "#B45309", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p className="font-semibold" style={{ fontSize: "14px", color: "#92400E" }}>
                Double-check {state.needsReview.length} field
                {state.needsReview.length === 1 ? "" : "s"} before saving
              </p>
              <p style={{ fontSize: "13px", color: "#B45309", marginTop: "4px", lineHeight: 1.5 }}>
                These came from chart/image pages or were low-confidence in the
                PCR — verify them in the form below:{" "}
                <strong>
                  {state.needsReview.map(reviewLabel).join(", ")}
                </strong>
                .
              </p>
            </div>
          </div>
        )}

        {state.data && (
          <div className="animate-slide-up">
            <DataFormSections
              data={state.data}
              onChange={handleDataChange}
              isAutoFilled={state.status === "loaded"}
            />
          </div>
        )}

        <GenerateButton
          onClick={() =>
            state.data &&
            onGenerate(state.data, {
              isDemo: state.isDemo,
              provenance: state.provenance,
              sourceFileName: state.sourceFileName,
            })
          }
          disabled={!canGenerate}
        />
      </main>
    </div>
  );
}
