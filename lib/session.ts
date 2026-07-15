// Shared-password session. No per-user accounts and no external auth service —
// a single team password unlocks the tool and sets a signed, expiring cookie.
// The cookie value is `${exp}.${hmac(exp)}`, signed with APP_SESSION_SECRET so
// it can't be forged or extended by the client. Uses Web Crypto (crypto.subtle)
// so the same code runs in the Edge middleware and in Node route handlers.

const encoder = new TextEncoder();

export const SESSION_COOKIE = "covert_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

function getSecret(): string {
  const secret = process.env.APP_SESSION_SECRET;
  if (!secret) throw new Error("APP_SESSION_SECRET is not set");
  return secret;
}

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toHex(sig);
}

/** Constant-time string compare (both args are equal-length hex digests). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Mint a fresh signed session token that expires SESSION_MAX_AGE from now. */
export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const sig = await sign(String(exp));
  return `${exp}.${sig}`;
}

/** True if the token is well-formed, correctly signed, and not expired. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return false;
  if (exp * 1000 <= Date.now()) return false;
  const expected = await sign(expStr);
  return safeEqual(sig, expected);
}
