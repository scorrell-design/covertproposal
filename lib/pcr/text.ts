import { extractText, getDocumentProxy } from "unpdf";

export interface PdfText {
  totalPages: number;
  /** Per-page text, in pdf.js reading order. */
  pages: string[];
  /** All pages joined, whitespace-collapsed to single spaces for anchored matching. */
  normalized: string;
}

/**
 * Pull text out of a PCR PDF with unpdf (pdf.js under the hood — serverless-safe,
 * no system binaries). Numbers in the PCR sit next to their labels
 * ("713 Pharmacies > 1 Prescriber"), so collapsing whitespace and matching on
 * the label is reliable for the scalar fields. Chart/image pages (risk tiers,
 * provider stars) yield little or no text — those are handled by the vision pass.
 */
export async function extractPdfText(bytes: Uint8Array): Promise<PdfText> {
  const pdf = await getDocumentProxy(bytes);
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  const normalized = pages.join("\n").replace(/\s+/g, " ").trim();
  return { totalPages, pages, normalized };
}
