import path from "node:path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Prisma 7's CLI no longer auto-loads env files. Load .env.local (what Next.js
// uses) first, then .env, so `prisma migrate`/`generate` see the same
// DATABASE_URL / DIRECT_URL as the running app. dotenv won't override vars
// already set in the real environment (e.g. on Vercel), which is what we want.
loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  // Migrations/introspection connect directly (unpooled). Fall back to the
  // pooled URL if no separate direct URL is configured. Empty at generate-time
  // is fine — `generate` doesn't open a connection.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
