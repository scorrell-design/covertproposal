import { z } from "zod";

/**
 * Extraction schema handed to Claude as a structured-output format. Mirrors the
 * PCRData numeric fields plus the two breakdown arrays. Every scalar is
 * nullable so the model reports "not found in this PCR" instead of inventing a
 * number — a null becomes a review flag, a fabricated value would silently ship.
 *
 * clientName / preparedFor are intentionally omitted: those are set by the
 * salesperson, not read from the PCR.
 */
const nint = z.number().int().nullable();

export const pcrExtractionSchema = z.object({
  totalPlanMembers: nint,
  totalMembersWithAnyRx: nint,
  membersWithOpioidRx: nint,
  identifiedMembers: nint,
  withdrawalSymptomMembers: nint,

  catastrophicRisk: nint,
  severeRisk: nint,
  highRisk: nint,
  moderateRisk: nint,
  earlyWithdrawal: nint,
  matMembers: nint,

  totalPrescribersWithOpioid: nint,
  identifiedPrescribers: nint,
  chronicOpioidPrescribers: nint,
  acuteOpioidPrescribers: nint,
  prescribersExcessiveRefills: nint,

  pharmaciesDispensingOpioids: nint,
  pharmaciesEarlyRefills: nint,
  pharmaciesHighDosage: nint,
  pharmaciesMultiPrescriber: nint,
  crossLocationRefills: nint,
  membersMultiplePrescribers: nint,
  membersOver3Refills: nint,

  wsiUniqueMembers: nint,
  wsiBreakdown: z
    .array(z.object({ name: z.string(), count: z.number().int() }))
    .nullable(),

  chronicCostFactors: nint,
  chronicConditions: z
    .array(z.object({ name: z.string(), count: z.number().int() }))
    .nullable(),
});

export type PCRExtraction = z.infer<typeof pcrExtractionSchema>;
