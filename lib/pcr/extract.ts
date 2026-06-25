import { PCRData } from "../types";
import { DEMO_DATA } from "../demoData";
import { extractPdfText } from "./text";
import { extractTextFields } from "./textFields";
import { extractWithClaude } from "./vision";
import { PCRExtraction } from "./schema";
import {
  ExtractionResult,
  FieldResult,
  PCRScalarField,
  Provenance,
} from "./types";

/** Scalar fields we expect in a PCR, in display order (also the review order). */
const SCALAR_FIELDS = Object.keys(DEMO_DATA).filter(
  (k) => typeof (DEMO_DATA as unknown as Record<string, unknown>)[k] === "number"
) as PCRScalarField[];

/**
 * Merge a high-confidence text value with Claude's value for one field.
 * - text only        → high (clean label-anchored match)
 * - vision only      → medium (chart/image read; reviewer should glance)
 * - agree            → high
 * - disagree         → low + conflict, keep the text value (label-anchored beats OCR)
 */
function mergeField(
  text: FieldResult | undefined,
  visionValue: number | null | undefined
): FieldResult {
  const t = text?.value ?? null;
  const v = visionValue ?? null;

  if (t !== null && v !== null) {
    if (t === v) return { value: t, source: "merged", confidence: "high", raw: text?.raw };
    return {
      value: t,
      source: "merged",
      confidence: "low",
      raw: text?.raw,
      conflict: { text: t, vision: v },
    };
  }
  if (t !== null) return text!;
  if (v !== null) return { value: v, source: "vision", confidence: "medium" };
  return { value: null, source: "missing", confidence: "low" };
}

function mergeBreakdown(
  vision: { name: string; count: number }[] | null | undefined,
  field: "wsiBreakdown" | "chronicConditions"
): FieldResult<{ name: string; count: number }[]> {
  if (vision && vision.length) {
    return { value: vision, source: "vision", confidence: "medium" };
  }
  return { value: [], source: "missing", confidence: "low", raw: `No ${field} extracted` };
}

/**
 * Parse a PCR PDF into PCRData + per-field provenance.
 *
 * Hybrid: a free, deterministic text pass handles the label-anchored scalars;
 * Claude reads the whole PDF (including chart/image pages) to fill the rest and
 * cross-check the text. The result always carries a `needsReview` list so the
 * UI can flag anything missing, low-confidence, or conflicting before the
 * salesperson finalizes the proposal. Falls back to text-only when no API key
 * is set, so local dev works offline.
 */
export async function extractPCR(
  pdfBytes: Uint8Array,
  opts: { clientName?: string; preparedFor?: string } = {}
): Promise<ExtractionResult> {
  // unpdf/pdf.js detaches the ArrayBuffer backing the Uint8Array it's given, so
  // hand it a copy — otherwise the vision pass below would base64-encode an
  // emptied buffer and the Claude call would fail.
  const text = await extractPdfText(pdfBytes.slice());
  const textFields = extractTextFields(text);

  let vision: PCRExtraction | null = null;
  try {
    vision = await extractWithClaude(pdfBytes);
  } catch {
    vision = null; // never let a vision failure block the text-derived proposal
  }

  const provenance: Provenance = {};
  const data = {
    clientName: opts.clientName ?? "",
    preparedFor: opts.preparedFor ?? "",
  } as PCRData;

  for (const field of SCALAR_FIELDS) {
    const merged = mergeField(textFields[field], vision?.[field] as number | null | undefined);
    provenance[field] = merged;
    (data[field] as number) = merged.value ?? 0;
  }

  const wsi = mergeBreakdown(vision?.wsiBreakdown, "wsiBreakdown");
  provenance.wsiBreakdown = wsi;
  data.wsiBreakdown = wsi.value ?? [];

  const chronic = mergeBreakdown(vision?.chronicConditions, "chronicConditions");
  provenance.chronicConditions = chronic;
  data.chronicConditions = chronic.value ?? [];

  const needsReview: string[] = [];
  for (const [field, result] of Object.entries(provenance)) {
    if (!result) continue;
    const empty =
      result.value === null ||
      (Array.isArray(result.value) && result.value.length === 0);
    if (empty || result.confidence === "low") needsReview.push(field);
  }

  return {
    data,
    provenance,
    needsReview,
    passes: { text: true, vision: vision !== null },
  };
}
