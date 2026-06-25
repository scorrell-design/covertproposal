"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileCheck, Loader2 } from "lucide-react";

interface PCRUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function PCRUploader({
  onFileSelect,
  isLoading,
}: PCRUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const valid = /\.pdf$/i.test(file.name);
      if (!valid) return;
      setFileName(file.name);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      className="relative transition-colors duration-200"
      style={{
        border: `2px dashed ${isDragging || isLoading ? "var(--covert-teal)" : "var(--covert-border)"}`,
        borderRadius: "12px",
        padding: "64px 24px",
        backgroundColor:
          isDragging || isLoading ? "var(--covert-teal-light)" : "transparent",
        cursor: isLoading ? "default" : "pointer",
      }}
      onDragOver={(e) => {
        if (isLoading) return;
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        if (isLoading) return;
        handleDrop(e);
      }}
      onClick={() => {
        if (!isLoading) inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload PCR file"
      aria-busy={isLoading}
      onKeyDown={(e) => {
        if (isLoading) return;
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="flex flex-col items-center gap-3 text-center">
        {isLoading ? (
          <>
            <Loader2
              size={36}
              className="animate-spin"
              style={{ color: "var(--covert-teal)" }}
            />
            <p className="font-semibold" style={{ fontSize: "16px" }}>
              Analyzing your PCR…
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--covert-text-secondary)",
                maxWidth: "380px",
                lineHeight: 1.5,
              }}
            >
              Reading the figures and chart pages from{" "}
              <strong>{fileName}</strong>. This usually takes 15–30 seconds —
              the form fills in and Generate unlocks as soon as it&rsquo;s done.
            </p>
          </>
        ) : fileName ? (
          <>
            <FileCheck size={36} style={{ color: "var(--covert-teal)" }} />
            <p className="font-semibold" style={{ fontSize: "16px" }}>
              {fileName}
            </p>
            <p style={{ fontSize: "14px", color: "var(--covert-text-secondary)" }}>
              Click or drop a new file to replace
            </p>
          </>
        ) : (
          <>
            <Upload size={36} style={{ color: "var(--covert-teal)" }} />
            <p className="font-semibold" style={{ fontSize: "16px" }}>
              Drag & drop PCR file here
            </p>
            <p style={{ fontSize: "14px", color: "var(--covert-text-secondary)" }}>
              or click to browse
            </p>
            <p style={{ fontSize: "13px", color: "var(--covert-text-secondary)" }}>
              PDF only
            </p>
          </>
        )}
      </div>
    </div>
  );
}
