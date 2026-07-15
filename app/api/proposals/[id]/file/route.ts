import { getProposalFile } from "@/lib/proposals";

export const runtime = "nodejs";

// Gated by the shared-password proxy (this path is not in the public allowlist),
// so only signed-in team members can download a proposal's source PCR.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const proposal = await getProposalFile(id);
  if (!proposal?.sourceFile) {
    return new Response("No source file for this proposal.", { status: 404 });
  }

  // Fall back to a safe generic name; strip anything that could break the header.
  const name = (proposal.sourceFileName ?? "pcr.pdf").replace(/["\r\n]/g, "");
  return new Response(Buffer.from(proposal.sourceFile), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
