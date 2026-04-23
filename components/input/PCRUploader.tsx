"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileCheck } from "lucide-react";

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
      const valid = /\.(pdf|csv|xlsx?)$/i.test(file.name);
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
      className="relative cursor-pointer transition-colors duration-200"
      style={{
        border: `2px dashed ${isDragging ? "var(--covert-teal)" : "var(--covert-border)"}`,
        borderRadius: "12px",
        padding: "64px 24px",
        backgroundColor: isDragging
          ? "var(--covert-teal-light)"
          : "transparent",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload PCR file"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="flex flex-col items-center gap-3 text-center">
        {isLoading ? (
          <>
            <div
              className="animate-pulse-gentle"
              style={{ color: "var(--covert-teal)" }}
            >
              <FileCheck size={36} />
            </div>
            <p className="font-semibold" style={{ fontSize: "16px" }}>
              Parsing {fileName}...
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
              PDF, CSV, XLSX accepted
            </p>
          </>
        )}
      </div>
    </div>
  );
}
