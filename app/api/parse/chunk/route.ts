import { prisma } from "@/lib/db";

// Just writes a chunk to Postgres — no PDF parsing here, so it's quick, but it
// still needs the Node runtime for the Prisma pg adapter.
export const runtime = "nodejs";
export const maxDuration = 30;

// Each chunk must clear the ~6MB AWS Lambda invocation-payload cap that backs
// Netlify Functions (binary bodies are base64-inflated ×1.33 before the function
// even runs). The client sends 3MB chunks; cap at 5MB raw so a misbehaving
// caller can't push a part that the platform would reject with a non-JSON 500.
const MAX_CHUNK_BYTES = 5 * 1024 * 1024;
// Backstop against an upload fanning out into unbounded rows.
const MAX_CHUNKS = 40; // 40 × 3MB ≈ 120MB — far above any real PCR

/**
 * POST /api/parse/chunk?uploadId=<id>&index=<n>
 * Body: the raw bytes of one PDF slice (application/octet-stream).
 *
 * Stashes the slice in PcrUploadChunk keyed by (uploadId, index). /api/parse
 * later reassembles every slice for an uploadId, runs the extractor, and
 * deletes the rows. Splitting the upload is the only way a multi-MB PCR can
 * reach the server: a single multipart POST of the whole file exceeds the
 * platform's request-payload limit and is rejected before our code runs.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get("uploadId");
  const index = Number(searchParams.get("index"));

  if (!uploadId || !/^[A-Za-z0-9_-]{8,64}$/.test(uploadId)) {
    return Response.json({ error: "Invalid uploadId." }, { status: 400 });
  }
  if (!Number.isInteger(index) || index < 0 || index >= MAX_CHUNKS) {
    return Response.json({ error: "Invalid chunk index." }, { status: 400 });
  }

  const buf = Buffer.from(await request.arrayBuffer());
  if (buf.byteLength === 0) {
    return Response.json({ error: "Empty chunk." }, { status: 400 });
  }
  if (buf.byteLength > MAX_CHUNK_BYTES) {
    return Response.json({ error: "Chunk too large." }, { status: 413 });
  }

  try {
    // Upsert so a retried chunk overwrites rather than collides on the unique key.
    await prisma.pcrUploadChunk.upsert({
      where: { uploadId_index: { uploadId, index } },
      create: { uploadId, index, data: buf },
      update: { data: buf },
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[/api/parse/chunk] store failed:", err);
    return Response.json({ error: "Could not store the chunk." }, { status: 500 });
  }
}
