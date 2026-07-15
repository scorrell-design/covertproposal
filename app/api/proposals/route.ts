import { getCurrentDbUser } from "@/lib/auth";
import { createProposal } from "@/lib/proposals";
import { reassembleUpload, deleteUpload } from "@/lib/pcrUpload";
import { PCRData } from "@/lib/types";
import type { Provenance } from "@/lib/pcr/types";

export const runtime = "nodejs";

interface SaveBody {
  clientName?: string;
  preparedFor?: string;
  pcrData?: PCRData;
  provenance?: Provenance;
  sourceFileName?: string;
  /** Upload id from the parse step; its chunks hold the original PDF to keep. */
  uploadId?: string;
}

/**
 * POST /api/proposals — persist a reviewed proposal against the signed-in user.
 * Returns { id } so the client can redirect to the saved proposal view.
 */
export async function POST(request: Request) {
  const user = await getCurrentDbUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const clientName = body.clientName?.trim() || body.pcrData?.clientName?.trim();
  if (!clientName) {
    return Response.json({ error: "Client name is required." }, { status: 400 });
  }
  if (!body.pcrData) {
    return Response.json({ error: "Missing pcrData." }, { status: 400 });
  }

  // Keep the original PDF, uploaded in chunks during the parse step, so it can
  // be downloaded from the history later. Best-effort: if reassembly fails the
  // proposal still saves, just without the file.
  let sourceFile: Uint8Array | undefined;
  const uploadId = body.uploadId;
  if (uploadId && /^[A-Za-z0-9_-]{8,64}$/.test(uploadId)) {
    sourceFile = (await reassembleUpload(uploadId).catch(() => null)) ?? undefined;
  }

  const proposal = await createProposal({
    ownerUserId: user.id,
    clientName,
    preparedFor: body.preparedFor ?? body.pcrData.preparedFor,
    pcrData: { ...body.pcrData, clientName },
    provenance: body.provenance,
    sourceFileName: body.sourceFileName?.trim() || undefined,
    sourceFile,
  });

  // The chunks have served their purpose (extraction + this save) — drop them.
  if (uploadId) await deleteUpload(uploadId);

  return Response.json({ id: proposal.id, shareToken: proposal.shareToken });
}
