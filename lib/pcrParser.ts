import { PCRData } from "./types";
import type { ExtractionResult } from "./pcr/types";

/**
 * Upload a PCR PDF to the server, which runs the hybrid extractor
 * (text pass + Claude) and returns the data + per-field provenance.
 *
 * The extraction itself lives server-side in `lib/pcr/*` so the Anthropic API
 * key never reaches the browser. This client helper just posts the file.
 */
export async function parsePCRFileDetailed(
  file: File,
  clientName?: string
): Promise<ExtractionResult> {
  const form = new FormData();
  form.append("file", file);
  if (clientName) form.append("clientName", clientName);

  const res = await fetch("/api/parse", { method: "POST", body: form });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to read the PCR PDF.");
  }
  return (await res.json()) as ExtractionResult;
}

/**
 * Back-compat helper for the current input screen: returns just the PCRData.
 * Use {@link parsePCRFileDetailed} when wiring the review/edit screen so the
 * provenance + needs-review flags are available.
 */
export async function parsePCRFile(file: File): Promise<PCRData> {
  const { data } = await parsePCRFileDetailed(file);
  return data;
}
