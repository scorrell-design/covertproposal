import { getCurrentDbUser } from "@/lib/auth";
import { createProposal } from "@/lib/proposals";
import { PCRData } from "@/lib/types";
import type { Provenance } from "@/lib/pcr/types";

export const runtime = "nodejs";

interface SaveBody {
  clientName?: string;
  preparedFor?: string;
  pcrData?: PCRData;
  provenance?: Provenance;
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

  const proposal = await createProposal({
    ownerUserId: user.id,
    clientName,
    preparedFor: body.preparedFor ?? body.pcrData.preparedFor,
    pcrData: { ...body.pcrData, clientName },
    provenance: body.provenance,
  });

  return Response.json({ id: proposal.id, shareToken: proposal.shareToken });
}
