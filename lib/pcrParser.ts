import { PCRData } from "./types";
import type { ExtractionResult } from "./pcr/types";

// 3MB slices. Netlify Functions run on AWS Lambda, whose invocation payload is
// capped at ~6MB — and binary request bodies are base64-inflated ×1.33 before
// the function runs. A whole 4.7MB PCR therefore exceeds the cap and is rejected
// by the platform (non-JSON 500) before our code sees it. 3MB raw → ~4MB
// encoded leaves comfortable headroom per chunk.
const CHUNK_SIZE = 3 * 1024 * 1024;

/** Random, URL-safe upload id (matches the server's `[A-Za-z0-9_-]{8,64}`). */
function newUploadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}

/**
 * Upload a PCR PDF to the server in chunks, then run the hybrid extractor
 * (text pass + Claude) and return the data + per-field provenance.
 *
 * The extraction itself lives server-side in `lib/pcr/*` so the Anthropic API
 * key never reaches the browser. The file is sliced and streamed up via
 * /api/parse/chunk because a single whole-file POST exceeds the serverless
 * request-payload limit; /api/parse then reassembles the slices and extracts.
 */
export async function parsePCRFileDetailed(
  file: File,
  clientName?: string
): Promise<ExtractionResult> {
  const uploadId = newUploadId();
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

  for (let index = 0; index < totalChunks; index++) {
    const slice = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
    const res = await fetch(
      `/api/parse/chunk?uploadId=${uploadId}&index=${index}`,
      {
        method: "POST",
        headers: { "content-type": "application/octet-stream" },
        body: slice,
      }
    );
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "Failed to upload the PCR PDF.");
    }
  }

  const res = await fetch("/api/parse", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      uploadId,
      totalChunks,
      clientName,
      fileName: file.name,
    }),
  });
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
