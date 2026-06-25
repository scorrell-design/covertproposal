import { readFileSync } from "fs";
import { globSync } from "glob";

type Violation = { file: string; line: number; rule: string; snippet: string };
const violations: Violation[] = [];

const files = globSync("{app,components,src}/**/*.{tsx,jsx}", {
  ignore: ["**/node_modules/**", "**/.next/**"],
});

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");

  lines.forEach((line, i) => {
    const lineNum = i + 1;

    // RULE 1: </strong> or </b> immediately followed by capital letter (no space)
    if (/<\/(strong|b)>[A-Z]/.test(line)) {
      violations.push({
        file,
        line: lineNum,
        rule: "LABEL_CONCAT",
        snippet: line.trim(),
      });
    }

    // RULE 2: Bold span closing tag followed by capital letter with no space
    if (/font-(bold|semibold)[^<]*>[^<]*<\/(span|div)>[A-Z]/.test(line)) {
      violations.push({
        file,
        line: lineNum,
        rule: "BOLD_SPAN_CONCAT",
        snippet: line.trim(),
      });
    }

    // RULE 3: whitespace-nowrap on prose (4+ words in nearby content)
    if (/whitespace-nowrap/.test(line)) {
      const context = lines.slice(i, i + 4).join(" ");
      const textContent =
        context.match(/>([^<>{}]+)</g)?.join(" ") || "";
      const wordCount = textContent
        .split(/\s+/)
        .filter((w) => w.length > 2).length;
      if (wordCount >= 4) {
        violations.push({
          file,
          line: lineNum,
          rule: "NOWRAP_ON_PROSE",
          snippet: line.trim(),
        });
      }
    }

    // RULE 6: max-width class without mx-auto on the same element
    const classNameMatch = line.match(/className=["'`]([^"'`]+)["'`]/);
    if (classNameMatch) {
      const cls = classNameMatch[1];
      const hasMaxW = /\bmax-w-(sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|prose)\b/.test(cls);
      const hasMxAuto = /\bmx-auto\b/.test(cls);
      const hasWFull = /\bw-full\b/.test(cls);
      if (hasMaxW && !hasMxAuto && !hasWFull) {
        violations.push({
          file,
          line: lineNum,
          rule: "MAX_W_WITHOUT_MX_AUTO",
          snippet: line.trim(),
        });
      }
    }
  });

  // RULE 7: page files must center their content — via PageShell, an mx-auto
  // wrapper, flex centering (auth pages), or by delegating to a self-contained
  // full-bleed view that manages its own layout (the proposal renderers).
  if (/app\/.*page\.(tsx|jsx)$/.test(file)) {
    const hasPageShell = /<PageShell/.test(src);
    const hasMxAutoWrapper = /mx-auto/.test(src);
    const hasFlexCentered = /(items-center|justify-center)/.test(src);
    const delegatesFullBleed = /(OutputProposal|SavedProposalView)/.test(src);
    if (!hasPageShell && !hasMxAutoWrapper && !hasFlexCentered && !delegatesFullBleed) {
      violations.push({
        file,
        line: 1,
        rule: "PAGE_MISSING_CENTERED_WRAPPER",
        snippet: "Page file must wrap content in <PageShell> or include mx-auto",
      });
    }
  }
}

if (violations.length === 0) {
  console.log("✓ Spacing audit passed — no violations found.");
  process.exit(0);
}

console.log(`✗ Spacing audit FAILED — ${violations.length} violation(s):\n`);
const grouped = violations.reduce<Record<string, Violation[]>>((acc, v) => {
  (acc[v.rule] ||= []).push(v);
  return acc;
}, {});

const descriptions: Record<string, string> = {
  LABEL_CONCAT:
    "Bold tag directly followed by capital letter — missing space/separator",
  BOLD_SPAN_CONCAT: "Bold span followed by text with no space",
  NOWRAP_ON_PROSE:
    "whitespace-nowrap applied to prose (should only be on short labels)",
  MAX_W_WITHOUT_MX_AUTO:
    "Element has max-width but no mx-auto — will left-align",
  PAGE_MISSING_CENTERED_WRAPPER:
    "Page component missing PageShell or centered wrapper",
};

for (const [rule, items] of Object.entries(grouped)) {
  console.log(`\n[${rule}] ${descriptions[rule]}`);
  console.log(`  ${items.length} occurrence(s):`);
  items.slice(0, 8).forEach((v) => {
    console.log(`    ${v.file}:${v.line}`);
    console.log(
      `      ${v.snippet.slice(0, 120)}${v.snippet.length > 120 ? "..." : ""}`,
    );
  });
  if (items.length > 8) console.log(`    ...and ${items.length - 8} more`);
}

process.exit(1);
