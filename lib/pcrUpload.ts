import { prisma } from "./db";

/** Cap on a reassembled upload — well above any real PCR. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/** Concatenate ordered chunk rows (index 0..n-1) into the full file bytes. */
export function concatChunks(
  chunks: { index: number; data: Uint8Array }[],
): Uint8Array {
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].index !== i) {
      throw new Error(`chunk gap at index ${i} (got ${chunks[i].index})`);
    }
  }
  const total = chunks.reduce((n, c) => n + c.data.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c.data, offset);
    offset += c.data.byteLength;
  }
  return out;
}

/**
 * Reassemble a chunked upload into its full bytes, or null if there are no
 * chunks (e.g. demo mode, or the upload was already claimed/swept) or the
 * result is empty / oversized. Does not delete the chunks — the caller decides.
 */
export async function reassembleUpload(
  uploadId: string,
): Promise<Uint8Array | null> {
  const chunks = await prisma.pcrUploadChunk.findMany({
    where: { uploadId },
    orderBy: { index: "asc" },
    select: { index: true, data: true },
  });
  if (chunks.length === 0) return null;
  const bytes = concatChunks(chunks);
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_UPLOAD_BYTES) return null;
  return bytes;
}

/** Drop every chunk for an upload (best-effort — never throws). */
export async function deleteUpload(uploadId: string): Promise<void> {
  await prisma.pcrUploadChunk
    .deleteMany({ where: { uploadId } })
    .catch((e) => console.error("[pcrUpload] delete failed:", e));
}

/**
 * Reclaim chunks left behind by uploads that were parsed but never saved
 * (demo runs, abandoned reviews). Best-effort; runs opportunistically.
 */
export async function sweepStaleUploads(olderThanMs = 6 * 60 * 60 * 1000): Promise<void> {
  const cutoff = new Date(Date.now() - olderThanMs);
  await prisma.pcrUploadChunk
    .deleteMany({ where: { createdAt: { lt: cutoff } } })
    .catch((e) => console.error("[pcrUpload] sweep failed:", e));
}
