import { extractPCR } from "@/lib/pcr/extract";

// PDF parsing + the Claude pass need the Node runtime (Buffer, unpdf, SDK).
export const runtime = "nodejs";
// The vision pass on a multi-page PCR can run ~30s; give the function headroom.
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB — well above a normal PCR

/**
 * POST /api/parse — multipart form: `file` (the PCR PDF), optional `clientName`.
 * Runs the hybrid extractor server-side (keeps ANTHROPIC_API_KEY off the client)
 * and returns { data, provenance, needsReview, passes } for the review screen.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing 'file' upload." }, { status: 400 });
  }
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return Response.json({ error: "PCR must be a PDF." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "PDF exceeds 25 MB." }, { status: 413 });
  }

  const clientName =
    (form.get("clientName") as string | null)?.trim() ||
    file.name.replace(/\.pdf$/i, "");

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await extractPCR(bytes, { clientName });
    return Response.json(result);
  } catch (err) {
    console.error("[/api/parse] extraction failed:", err);
    return Response.json(
      { error: "Could not read this PCR. Try re-uploading, or enter the figures manually." },
      { status: 422 }
    );
  }
}
