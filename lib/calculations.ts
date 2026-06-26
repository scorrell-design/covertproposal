// === RATES — updated per Jesse Lisson (VP, Covert), 2026 ===
export const SAVINGS_PER_WITHDRAWAL_MEMBER = 23000;
export const COST_PER_MEMBER_ON_OPIOID = 600;
// ROI ratio inputs — per Jesse (6/3/26). The fixed-ROI claim is retired; the
// ROI is now avoided medical spend ÷ cost, where:
//   cost    = members with an opioid Rx × $600  (COST_PER_MEMBER_ON_OPIOID)
//   savings = at-risk (identified) members × $23,790
export const SAVINGS_PER_AT_RISK_MEMBER = 23790;
export const CASE_MANAGEMENT_COST_PER_CASE = 600;
export const PREVENTABLE_REDUCTION_RATE = 0.75;
// Overdose-death projection — per Jesse (5/28/26): members managing withdrawal
// symptoms ÷ 820, suppressed entirely when the plan has < 300 members.
export const OVERDOSE_DEATH_DIVISOR = 820;
export const OVERDOSE_MIN_POPULATION = 300;
export const ABUSE_ADDICTION_RATE = 0.25;
export const LARGE_POPULATION_THRESHOLD = 9000;
export const OUD_PREVENTION_RATE = 0.75;
export const LIVES_SAVED_PER_AT_RISK = 0.015;

export function calcMedicalSpendFromWithdrawal(
  withdrawalMembers: number,
): number {
  return withdrawalMembers * SAVINGS_PER_WITHDRAWAL_MEMBER;
}

// Preventable spend = 75% of the annual exposure. Annual exposure is now the
// at-risk basis (Jesse 6/26): identified members × $23,790. (Previously this
// was withdrawal members × $23,000 — retired so the report shows one
// consistent exposure figure.)
export function calcPreventableSpend(identifiedMembers: number): number {
  return Math.round(
    calcAvoidedMedicalSpend(identifiedMembers) * PREVENTABLE_REDUCTION_RATE,
  );
}

export function calcCaseManagementCost(membersAtRisk: number): number {
  return membersAtRisk * CASE_MANAGEMENT_COST_PER_CASE;
}

export function calcOpioidExposureCost(membersWithOpioidRx: number): number {
  return membersWithOpioidRx * COST_PER_MEMBER_ON_OPIOID;
}

// Net ROI (Jesse 6/26) = preventable spend (at-risk basis) − Covert cost
// (members currently on an opioid Rx × $600).
export function calcNetROI(
  identifiedMembers: number,
  membersWithOpioidRx: number,
): number {
  return (
    calcPreventableSpend(identifiedMembers) - calcCovertCost(membersWithOpioidRx)
  );
}

export function calcDailyCostOfInaction(preventableSpend: number): number {
  return Math.round(preventableSpend / 365);
}

export function calcMonthlyPreventable(preventableSpend: number): number {
  return Math.round(preventableSpend / 12);
}

/**
 * Projected opioid-overdose deaths in the next 12 months.
 * Formula (Jesse, 5/28/26): members managing withdrawal symptoms ÷ 820.
 * Returns null when the plan is under 300 members (stat is suppressed).
 */
export function calcProjectedOverdoseDeaths(
  withdrawalMembers: number,
  totalPlanMembers: number,
): number | null {
  if (totalPlanMembers < OVERDOSE_MIN_POPULATION) return null;
  const value = Math.round(withdrawalMembers / OVERDOSE_DEATH_DIVISOR);
  return value > 0 ? value : null;
}

export function calcProjectedAbuseAddiction(
  identifiedMembers: number,
): number {
  return Math.round(identifiedMembers * ABUSE_ADDICTION_RATE);
}

export function calcAnnualInvestment(identifiedMembers: number): number {
  return identifiedMembers * CASE_MANAGEMENT_COST_PER_CASE;
}

export function calcProjectedOUDPrevented(identifiedMembers: number): number {
  return Math.round(identifiedMembers * OUD_PREVENTION_RATE);
}

/** Avoided medical spend (Jesse 6/3/26): at-risk members × $23,790. */
export function calcAvoidedMedicalSpend(identifiedMembers: number): number {
  return identifiedMembers * SAVINGS_PER_AT_RISK_MEMBER;
}

/** Covert cost basis (Jesse 6/3/26): members with an opioid Rx × $600. */
export function calcCovertCost(membersWithOpioidRx: number): number {
  return membersWithOpioidRx * COST_PER_MEMBER_ON_OPIOID;
}

/**
 * ROI ratio (Jesse 6/3/26) = avoided medical spend ÷ cost.
 *   savings = identified (at-risk) members × $23,790
 *   cost    = members with an opioid Rx × $600
 */
export function calcROIRatio(
  identifiedMembers: number,
  membersWithOpioidRx: number,
): number {
  const cost = calcCovertCost(membersWithOpioidRx);
  if (cost <= 0) return 0;
  return Math.round(calcAvoidedMedicalSpend(identifiedMembers) / cost);
}

export function calcProjectedLivesSaved(
  identifiedMembers: number,
  totalPlanMembers: number,
): number | null {
  if (totalPlanMembers < LARGE_POPULATION_THRESHOLD) return null;
  return Math.round(identifiedMembers * LIVES_SAVED_PER_AT_RISK);
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
