import { syncUser } from "./proposals";

// The tool is gated by a single shared team password (see proxy.ts), so there
// are no per-user accounts. Every proposal is owned by one shared "Covert Team"
// account; the whole team sees the same history. `clerkId` is repurposed as the
// stable key for that single row (the column name is kept to avoid a migration).
export const SHARED_USER_KEY = "covert-shared-team";

/**
 * Resolve the owner every proposal is attributed to. Upserts (and returns) the
 * single shared team user. Access itself is enforced by the password gate in
 * proxy.ts before any request reaches here.
 */
export async function getCurrentDbUser() {
  return syncUser({
    clerkId: SHARED_USER_KEY,
    email: "team@covertplan.com",
    name: "Covert Team",
  });
}
