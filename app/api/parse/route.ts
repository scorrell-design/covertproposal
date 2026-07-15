import { extractPCR } from "@/lib/pcr/extract";
import { prisma } from "@/lib/db";
import { concatChunks, deleteUpload, sweepStaleUploads } from "@/lib/pcrUpload";

// PDF parsing + the Claude pass need the Node runtime (Buffer, unpdf, SDK).
export const runtime = "nodejs";
// The vision pass on a multi-page PCR can run ~30s; give the function headroom.
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB — well above a normal PCR

/**
 * POST /api/parse — runs the hybrid extractor server-side (keeps
 * ANTHROPIC_API_KEY off the client) and returns
 * { data, provenance, needsReview, passes } for the review screen.
 *
 * Two ways in:
 *  - application/json { uploadId, totalChunks, clientName?, fileName? } —
 *    the normal path. The client streamed the PDF up in <6MB slices via
 *    /api/parse/chunk (a whole-file multipart POST exceeds the platform's
 *    request-payload cap); we reassemble those slices here.
 *  - multipart/form-data with `file` — legacy/direct path, still works for
 *    small PDFs that fit under the payload cap.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      return await handleChunked(request);
    }
    return await handleMultipart(request);
  } catch (err) {
    console.error("[/api/parse] extraction failed:", err);
    return Response.json(
      { error: "Could not read this PCR. Try re-uploading, or enter the figures manually." },
      { status: 422 }
    );
  }
}

/** Reassemble a chunked upload, extract, then drop the chunk rows. */
async function handleChunked(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as {
    uploadId?: string;
    totalChunks?: number;
    clientName?: string;
    fileName?: string;
  } | null;

  const uploadId = body?.uploadId;
  const totalChunks = body?.totalChunks;
  if (!uploadId || !/^[A-Za-z0-9_-]{8,64}$/.test(uploadId)) {
    return Response.json({ error: "Invalid uploadId." }, { status: 400 });
  }
  if (!Number.isInteger(totalChunks) || (totalChunks as number) < 1) {
    return Response.json({ error: "Invalid totalChunks." }, { status: 400 });
  }

  // Reclaim chunks from uploads that were parsed but never saved (demo runs,
  // abandoned reviews). Best-effort, runs before this upload is processed.
  await sweepStaleUploads();

  try {
    const chunks = await prisma.pcrUploadChunk.findMany({
      where: { uploadId },
      orderBy: { index: "asc" },
      select: { index: true, data: true },
    });

    if (chunks.length !== totalChunks) {
      return Response.json(
        { error: "Upload incomplete — some chunks are missing. Please re-upload." },
        { status: 400 }
      );
    }

    const bytes = concatChunks(chunks);
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) {
      return Response.json({ error: "PDF is empty or exceeds 25 MB." }, { status: 413 });
    }

    const clientName =
      body?.clientName?.trim() ||
      (body?.fileName ?? "").replace(/\.pdf$/i, "") ||
      "Untitled";

    const result = await extractPCR(bytes, { clientName });
    // NOTE: chunks are intentionally KEPT here. The save step (/api/proposals)
    // reassembles them into Proposal.sourceFile and deletes them; the stale
    // sweep above reclaims any upload that never reaches save.
    return Response.json(result);
  } catch (err) {
    // On failure the bytes are useless — drop them so they don't linger.
    await deleteUpload(uploadId);
    throw err;
  }
}

/** Legacy/direct path: a small PDF uploaded as multipart/form-data. */
async function handleMultipart(request: Request): Promise<Response> {
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

  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = await extractPCR(bytes, { clientName });
  return Response.json(result);
}
