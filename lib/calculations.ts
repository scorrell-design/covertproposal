// === RATES — confirmed by Jesse Lisson (VP, Covert), 2026 ===
export const COST_PER_MEMBER_ON_OPIOID = 600;
// ROI ratio inputs — per Jesse (6/3/26). The fixed-ROI claim is retired; the
// ROI is now avoided medical spend ÷ cost, where:
//   cost    = members with an opioid Rx × $600  (COST_PER_MEMBER_ON_OPIOID)
//   savings = at-risk (identified) members × $23,790
export const SAVINGS_PER_AT_RISK_MEMBER = 23790;
export const PREVENTABLE_REDUCTION_RATE = 0.75;
// Overdose-death estimate — per Jesse (7/2/26, supersedes the 5/28 ÷820 rule):
// at-risk (identified) members × 0.0167. The rate is the 2023 U.S. opioid
// overdose mortality among people with opioid use disorder — 80,000 deaths
// (CDC) ÷ 4.8M with OUD (SAMHSA NSDUH) ≈ 1.67%. Population suppression under
// 300 members is retained from the 5/28 rule.
export const OVERDOSE_DEATH_RATE = 0.0167;
export const OVERDOSE_MIN_POPULATION = 300;
export const ABUSE_ADDICTION_RATE = 0.25;
// Catastrophic-risk exposure per member — per Jesse (6/30/26): members nearing
// a catastrophic event are trending toward overdose death or a major medical
// event, each carrying ~$100,000 in projected exposure.
export const CATASTROPHIC_EXPOSURE_PER_MEMBER = 100000;

// Total Medical Claims Exposure / Total Avoidable Medical Spend (Jesse 7/13 —
// supersedes the 7/1 chronic-cost-factors basis): total at-risk (identified)
// members × $23,790. Row 3 of "The cost of doing nothing", the "What the Data
// Shows" close, and the Projected Savings plan cost.
export function calcTotalClaimsExposure(identifiedMembers: number): number {
  return identifiedMembers * SAVINGS_PER_AT_RISK_MEMBER;
}

// Reduction in Avoidable Medical Claims (Jesse 7/13): 75% of the Total
// Avoidable Medical Spend. Shown in row 3 of "The return of correcting it"
// AND in the Decision close — Jesse requires those two figures to always
// match, so both must read from this one function. Rounds down to match
// Jesse's worked figure ($28,238,730 × .75 = $21,179,047.5 → $21,179,047).
export function calcAvoidableClaimsReduction(identifiedMembers: number): number {
  return Math.floor(
    calcTotalClaimsExposure(identifiedMembers) * PREVENTABLE_REDUCTION_RATE,
  );
}

// Net ROI (Jesse 6/26, rebased 7/13) = reduction in avoidable medical claims −
// Covert cost (members currently on an opioid Rx × $600). Internal form
// preview only; the report itself shows the un-netted reduction.
export function calcNetROI(
  identifiedMembers: number,
  membersWithOpioidRx: number,
): number {
  return (
    calcAvoidableClaimsReduction(identifiedMembers) -
    calcCovertCost(membersWithOpioidRx)
  );
}

/**
 * Estimated annual opioid overdose deaths within the health plan.
 * Formula (Jesse, 7/2/26): at-risk (identified) members × 0.0167 — the
 * CDC/SAMHSA 2023 population-level mortality rate among people with OUD.
 * Returns null when the plan is under 300 members (stat is suppressed).
 */
export function calcProjectedOverdoseDeaths(
  identifiedMembers: number,
  totalPlanMembers: number,
): number | null {
  if (totalPlanMembers < OVERDOSE_MIN_POPULATION) return null;
  const value = Math.round(identifiedMembers * OVERDOSE_DEATH_RATE);
  return value > 0 ? value : null;
}

/**
 * Estimated lives saved (Jesse 7/2/26): 75% of the estimated annual opioid
 * overdose deaths — the last row of "The return of correcting it".
 */
export function calcEstimatedLivesSaved(
  identifiedMembers: number,
  totalPlanMembers: number,
): number | null {
  const deaths = calcProjectedOverdoseDeaths(identifiedMembers, totalPlanMembers);
  if (deaths === null) return null;
  const value = Math.round(deaths * PREVENTABLE_REDUCTION_RATE);
  return value > 0 ? value : null;
}

export function calcProjectedAbuseAddiction(
  identifiedMembers: number,
): number {
  return Math.round(identifiedMembers * ABUSE_ADDICTION_RATE);
}

/**
 * Members experiencing chronic conditions and opioid withdrawal symptoms
 * (Jesse 7/13 — supersedes the 7/1 chronic-cost-factors basis): the at-risk
 * population × 75% — equivalently, at-risk members minus those projected to
 * abuse or become addicted (1,187 − 297 = 890). Computed by subtraction so
 * rows 1 + 2 of "The cost of doing nothing" always sum to the at-risk total.
 */
export function calcProjectedChronicWithdrawal(
  identifiedMembers: number,
): number {
  return identifiedMembers - calcProjectedAbuseAddiction(identifiedMembers);
}

/** Avoided medical spend (Jesse 6/3/26): at-risk members × $23,790. */
export function calcAvoidedMedicalSpend(identifiedMembers: number): number {
  return identifiedMembers * SAVINGS_PER_AT_RISK_MEMBER;
}

/** Covert cost basis (Jesse 6/3/26): members with an opioid Rx × $600. */
export function calcCovertCost(membersWithOpioidRx: number): number {
  return membersWithOpioidRx * COST_PER_MEMBER_ON_OPIOID;
}

/** Catastrophic-risk projected exposure (Jesse 6/30/26): members × $100,000. */
export function calcCatastrophicExposure(catastrophicRiskMembers: number): number {
  return catastrophicRiskMembers * CATASTROPHIC_EXPOSURE_PER_MEMBER;
}

/**
 * ROI ratio (Jesse 7/13/26 — supersedes 6/3) = reduction in avoidable medical
 * spend ÷ cost.
 *   savings = total avoidable medical spend × .75
 *             (= at-risk members × $23,790 × .75, via calcAvoidableClaimsReduction)
 *   cost    = members with an opioid Rx × $600
 * Rounded to the nearest whole ratio (Jesse's example: 14.7:1 → 15:1).
 */
export function calcROIRatio(
  identifiedMembers: number,
  membersWithOpioidRx: number,
): number {
  const cost = calcCovertCost(membersWithOpioidRx);
  if (cost <= 0) return 0;
  return Math.round(calcAvoidableClaimsReduction(identifiedMembers) / cost);
}

export function calcAtRiskCadence(identifiedMembers: number): {
  value: number;
  cadence: "day" | "month" | "year";
} {
  const perDay = identifiedMembers / 365;
  const perMonth = identifiedMembers / 12;
  if (perDay >= 1) return { value: Math.round(perDay), cadence: "day" };
  if (perMonth >= 1) return { value: Math.round(perMonth), cadence: "month" };
  return { value: identifiedMembers, cadence: "year" };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
