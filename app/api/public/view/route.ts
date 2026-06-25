import { recordView } from "@/lib/proposals";

export const runtime = "nodejs";

/**
 * PUBLIC (no auth) — called by the prospect-facing /p/[token] page to record a
 * view. Allowlisted in middleware. Always returns ok so a bad/expired token
 * doesn't surface anything to the prospect.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { token?: string };
  if (typeof body.token === "string" && body.token) {
    await recordView(body.token).catch(() => {});
  }
  return Response.json({ ok: true });
}
