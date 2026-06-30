import { readFileSync } from "fs";
import { globSync } from "glob";

const results: { check: string; pass: boolean; detail?: string }[] = [];

function check(name: string, pass: boolean, detail?: string) {
  results.push({ check: name, pass, detail });
}

const allSource = globSync("{app,components,lib,src}/**/*.{ts,tsx,js,jsx}", {
  ignore: ["**/node_modules/**", "**/.next/**"],
}).map((f) => ({ file: f, src: readFileSync(f, "utf8") }));

const joined = allSource.map((f) => f.src).join("\n");

// 1. Retired $23,000 withdrawal-savings path is fully removed (superseded by
//    the $23,790 at-risk basis). The old constant + helper must be gone.
check(
  "Retired $23,000 withdrawal-savings path removed",
  !/SAVINGS_PER_WITHDRAWAL_MEMBER/.test(joined) &&
    !/calcMedicalSpendFromWithdrawal/.test(joined),
);

// 2. $600 per member on opioid
check(
  "COST_PER_MEMBER_ON_OPIOID = 600 exists",
  /COST_PER_MEMBER_ON_OPIOID\s*=\s*600/.test(joined),
);

// 2b. Catastrophic-risk exposure = $100,000/member (Jesse 6/30), via a named
//     constant (no inline magic number in RiskBreakdown).
check(
  "Catastrophic exposure uses CATASTROPHIC_EXPOSURE_PER_MEMBER = 100000",
  /CATASTROPHIC_EXPOSURE_PER_MEMBER\s*=\s*100[_,]?000/.test(joined) &&
    !/catastrophicRisk\s*\*\s*100000/.test(joined),
);

// 3. Overdose-death projection: withdrawal members ÷ 820, suppressed under
//    300 members (Jesse 5/28/26 — supersedes the prior 825 / 9,000 lives-lost rule).
const hasOverdoseDivisor = /OVERDOSE_DEATH_DIVISOR\s*=\s*820/.test(joined);
const hasOverdoseThreshold = /OVERDOSE_MIN_POPULATION\s*=\s*300/.test(joined);
const hasOverdoseGate = /totalPlanMembers\s*<\s*OVERDOSE_MIN_POPULATION/.test(joined);
check(
  "Overdose-death projection uses ÷820 and is gated under 300 members",
  hasOverdoseDivisor && hasOverdoseThreshold && hasOverdoseGate,
);

// 4. calcAtRiskCadence helper exists
check(
  "calcAtRiskCadence helper exists",
  /function\s+calcAtRiskCadence|const\s+calcAtRiskCadence\s*=/.test(joined),
);

// 5. Prescription Utilization merged into "What the Data Shows" (Jesse 6/26).
//    The standalone donut section was removed; the combined data section and
//    its headline stat remain.
const utilizationRemoved = !allSource.some((f) =>
  /sections\/PrescriptionUtilization\.tsx$/.test(f.file),
);
check(
  'Prescription Utilization merged into "What the Data Shows" (donut removed)',
  utilizationRemoved && /What the Data Shows/.test(joined),
);

// 6. CDC asterisk footnote
check(
  "CDC-aligned prescribing risk factors footnote present",
  /CDC-aligned prescribing risk factors/.test(joined),
);

// 7. Recommended Interventions REMOVED
const riRegex =
  /Recommended Intervention|recommendedInterventions|RecommendedInterventions/;
const riHits = allSource.filter((f) => riRegex.test(f.src)).map((f) => f.file);
check(
  "Recommended Interventions section removed",
  riHits.length === 0,
  riHits.length > 0 ? `Found in: ${riHits.join(", ")}` : undefined,
);

// 8. CTA close trimmed (Jesse 6/29): the report now ends on the heading, the
// three comparison boxes, and the Request button — the "directly affected"
// transition headline and the closing stat tiles were removed.
check(
  "CTA close trimmed to heading + 3 boxes + Request button (no 'directly affected' headline)",
  !/directly affected/.test(joined) &&
    /Request Client Service Agreement/.test(joined),
);

// 9. Data type has pharmaciesDispensingOpioids
check(
  "Data type includes pharmaciesDispensingOpioids",
  /pharmaciesDispensingOpioids\s*:/.test(joined),
);

// 10. 25% abuse/addiction rate constant
check(
  "ABUSE_ADDICTION_RATE = 0.25 exists",
  /ABUSE_ADDICTION_RATE\s*=\s*0\.25/.test(joined),
);

// 11. ROI ratio = at-risk × $23,790 ÷ (opioid-Rx members × $600); "Guaranteed
//     ROI" retired (Jesse 6/3/26).
check(
  "ROI uses SAVINGS_PER_AT_RISK_MEMBER = 23790 and 'Guaranteed ROI' is removed",
  /SAVINGS_PER_AT_RISK_MEMBER\s*=\s*23[_,]?790/.test(joined) &&
    !/Guaranteed ROI/.test(joined),
);

// Report
const failed = results.filter((r) => !r.pass);
console.log("\n=== JESSE FEEDBACK AUDIT ===\n");
for (const r of results) {
  console.log(`${r.pass ? "✓" : "✗"} ${r.check}`);
  if (r.detail) console.log(`    ${r.detail}`);
}
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed\n`,
);

if (failed.length > 0) {
  console.error(
    `✗ ${failed.length} Jesse feedback item(s) missing or incorrect`,
  );
  process.exit(1);
}
console.log("✓ All Jesse feedback verified");
process.exit(0);
