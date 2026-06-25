import { getCurrentDbUser } from "@/lib/auth";
import { recordOwnerEvent } from "@/lib/proposals";
import { ProposalEventType } from "@/lib/generated/prisma/client";

export const runtime = "nodejs";

// Owner-initiated events only. Views are recorded via /api/public/view.
const ALLOWED: ReadonlySet<string> = new Set([
  ProposalEventType.SHARED,
  ProposalEventType.DOWNLOADED,
]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentDbUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { type?: string };
  if (!body.type || !ALLOWED.has(body.type)) {
    return Response.json({ error: "Invalid event type." }, { status: 400 });
  }

  const ok = await recordOwnerEvent(id, user.id, body.type as ProposalEventType);
  if (!ok) return Response.json({ error: "Proposal not found." }, { status: 404 });
  return Response.json({ ok: true });
}
