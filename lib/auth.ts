import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "./proposals";

/**
 * Resolve the signed-in Clerk user and mirror them into our DB (lazy
 * sync-on-request — fine for the internal team; a webhook would be the
 * heavier-duty option later). Returns the DB User row (with our `id` and
 * `role`) that proposals are owned by, or null if not signed in.
 */
export async function getCurrentDbUser() {
  const user = await currentUser();
  if (!user) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    null;

  return syncUser({ clerkId: user.id, email, name });
}
