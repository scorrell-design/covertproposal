import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/session";

export const runtime = "nodejs";

/** Constant-time compare so login timing doesn't leak the password length. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** POST /api/login — exchange the shared team password for a session cookie. */
export async function POST(request: Request) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return Response.json(
      { error: "Sign-in is not configured. Set APP_PASSWORD." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (typeof body.password !== "string" || !safeEqual(body.password, expected)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${SESSION_MAX_AGE}`,
      ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
    ].join("; "),
  );
  return res;
}
