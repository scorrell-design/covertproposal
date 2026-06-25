/**
 * Accuracy harness for the PCR text-extraction layer.
 *
 * Runs the text matchers against a real PCR PDF and diffs every field against
 * DEMO_DATA (the hand-verified RxSense ground truth). Lets us prove the parser
 * before wiring it into the app, and catch regressions as matchers evolve.
 *
 *   npx tsx scripts/test-extract.ts "/path/to/PCR.pdf"
 */
import { readFile } from "node:fs/promises";
import { extractPdfText } from "../lib/pcr/text";
import { extractTextFields } from "../lib/pcr/textFields";
import { extractPCR } from "../lib/pcr/extract";
import { DEMO_DATA } from "../lib/demoData";
import { PCRScalarField } from "../lib/pcr/types";

const DEFAULT_PCR = "/Users/stephanie/Downloads/PCR - Covert-RxSense-07-122025.pdf";

async function main() {
  const path = process.argv[2] || DEFAULT_PCR;
  // `--full` runs the hybrid pipeline (text + Claude). Needs ANTHROPIC_API_KEY.
  const full = process.argv.includes("--full");
  const bytes = new Uint8Array(await readFile(path));

  if (full) {
    const result = await extractPCR(bytes, { clientName: "RxSense" });
    let correct = 0;
    const numeric = (Object.keys(DEMO_DATA) as (keyof typeof DEMO_DATA)[]).filter(
      (k) => typeof DEMO_DATA[k] === "number"
    ) as PCRScalarField[];
    for (const field of numeric) {
      const got = result.data[field];
      const exp = DEMO_DATA[field] as number;
      const p = result.provenance[field];
      const ok = got === exp;
      if (ok) correct++;
      const flag = p?.conflict ? ` CONFLICT(text=${p.conflict.text},vision=${p.conflict.vision})` : "";
      console.log(
        `${(ok ? "✓" : "✗").padEnd(2)} ${field.padEnd(28)} exp=${String(exp).padEnd(8)} got=${String(got).padEnd(8)} [${p?.source}/${p?.confidence}]${flag}`
      );
    }
    console.log(`\nHybrid: ${correct}/${numeric.length} numeric fields correct`);
    console.log(`Passes: text=${result.passes.text} vision=${result.passes.vision}`);
    console.log(`Needs review (${result.needsReview.length}): ${result.needsReview.join(", ") || "none"}`);
    console.log(`WSI breakdown items: ${result.data.wsiBreakdown.length}; chronic: ${result.data.chronicConditions.length}`);
    if (correct < numeric.length) process.exitCode = 1;
    return;
  }

  const text = await extractPdfText(bytes);
  const fields = extractTextFields(text);

  // Every numeric PCRData field, so we can see coverage (text-found vs not).
  const numericFields = (Object.keys(DEMO_DATA) as (keyof typeof DEMO_DATA)[]).filter(
    (k) => typeof DEMO_DATA[k] === "number"
  ) as PCRScalarField[];

  let correct = 0;
  let found = 0;
  const rows: string[] = [];
  for (const field of numericFields) {
    const expected = DEMO_DATA[field] as number;
    const result = fields[field];
    const got = result?.value ?? null;
    if (got !== null) found++;
    const ok = got === expected;
    if (got !== null && ok) correct++;
    const status = got === null ? "·  (vision)" : ok ? "✓" : "✗ MISMATCH";
    rows.push(
      `${status.padEnd(12)} ${field.padEnd(28)} expected=${String(expected).padEnd(8)} got=${got ?? "—"}`
    );
  }

  console.log(`PCR: ${path}`);
  console.log(`Pages: ${text.totalPages}\n`);
  console.log(rows.join("\n"));
  console.log(
    `\nText pass: ${correct}/${found} found-fields correct · ${found}/${numericFields.length} of all numeric fields covered by text`
  );
  const mismatches = rows.filter((r) => r.includes("MISMATCH"));
  if (mismatches.length) {
    console.log(`\n⚠️  ${mismatches.length} mismatch(es) — fix matchers before trusting text pass.`);
    process.exitCode = 1;
  }
}

main();
