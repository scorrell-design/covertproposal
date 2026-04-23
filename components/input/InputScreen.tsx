"use client";

import { useReducer, useCallback } from "react";
import CovertLogo from "@/components/shared/CovertLogo";
import PCRUploader from "./PCRUploader";
import DemoModeToggle from "./DemoModeToggle";
import DataFormSections from "./DataFormSections";
import GenerateButton from "./GenerateButton";
import { PCRData, InputState } from "@/lib/types";
import { DEMO_DATA } from "@/lib/demoData";
import { parsePCRFile } from "@/lib/pcrParser";

type Action =
  | { type: "START_PARSING" }
  | { type: "DATA_LOADED"; data: PCRData; isDemo: boolean }
  | { type: "UPDATE_DATA"; data: PCRData };

function reducer(state: InputState, action: Action): InputState {
  switch (action.type) {
    case "START_PARSING":
      return { ...state, status: "parsing" };
    case "DATA_LOADED":
      return {
        status: "loaded",
        data: action.data,
        isDemo: action.isDemo,
      };
    case "UPDATE_DATA":
      return { ...state, data: action.data };
    default:
      return state;
  }
}

interface InputScreenProps {
  onGenerate: (data: PCRData) => void;
}

export default function InputScreen({ onGenerate }: InputScreenProps) {
  const [state, dispatch] = useReducer(reducer, {
    status: "empty",
    data: null,
    isDemo: false,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    dispatch({ type: "START_PARSING" });
    const data = await parsePCRFile(file);
    dispatch({ type: "DATA_LOADED", data, isDemo: false });
  }, []);

  const handleDemoMode = useCallback(() => {
    dispatch({
      type: "DATA_LOADED",
      data: { ...DEMO_DATA },
      isDemo: true,
    });
  }, []);

  const handleDataChange = useCallback((data: PCRData) => {
    dispatch({ type: "UPDATE_DATA", data });
  }, []);

  const canGenerate =
    state.status === "loaded" &&
    state.data !== null &&
    state.data.clientName.trim().length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--covert-bg)" }}>
      <nav
        className="flex items-center h-16 px-6"
        style={{
          borderBottom: "1px solid var(--covert-border)",
          backgroundColor: "var(--covert-bg)",
        }}
      >
        <CovertLogo size={28} />
      </nav>

      <main className="mx-auto" style={{ maxWidth: "680px", padding: "48px 24px 120px" }}>
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
          onClick={() => state.data && onGenerate(state.data)}
          disabled={!canGenerate}
        />
      </main>
    </div>
  );
}
