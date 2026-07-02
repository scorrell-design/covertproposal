import { PCRData } from "../types";

/**
 * Provenance for a single extracted field. Drives the manual-review screen:
 * the salesperson sees where each number came from and how confident we are,
 * so low-confidence / conflicting fields can be flagged for a human check
 * before the proposal is finalized.
 */
export type FieldSource = "text" | "vision" | "merged" | "missing";

export type Confidence = "high" | "medium" | "low";

export interface FieldResult<T = number> {
  /** The extracted value, or null when nothing could be found. */
  value: T | null;
  source: FieldSource;
  confidence: Confidence;
  /** The raw substring (text pass) or note (vision pass) the value came from. */
  raw?: string;
  /** Set when the text and vision passes disagreed — surfaced in review. */
  conflict?: { text: T | null; vision: T | null };
}

/** Every scalar field in PCRData that we attempt to extract. Optionality is
 * stripped so any optional numerics are included. */
export type PCRScalarField = NonNullable<
  {
    [K in keyof PCRData]-?: NonNullable<PCRData[K]> extends number ? K : never;
  }[keyof PCRData]
>;

/** Provenance map keyed by PCRData field name (scalars + the two breakdowns). */
export type Provenance = Partial<
  Record<PCRScalarField, FieldResult> & {
    wsiBreakdown: FieldResult<{ name: string; count: number }[]>;
    chronicConditions: FieldResult<{ name: string; count: number }[]>;
  }
>;

export interface ExtractionResult {
  /** The assembled PCRData, ready to flow through the existing proposal UI. */
  data: PCRData;
  /** Per-field provenance + confidence for the review screen. */
  provenance: Provenance;
  /** Fields the reviewer should double-check (missing, low-confidence, or conflicting). */
  needsReview: PCRScalarField[] | string[];
  /** Which passes actually ran (vision is skipped when no API key is configured). */
  passes: { text: boolean; vision: boolean };
}
