import "dotenv/config";
import { defineConfig } from "drizzle-kit";

function databaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.NEON_DATABASE_URL;
  if (!url?.trim()) {
    throw new Error(
      "Set DATABASE_URL (or POSTGRES_URL / NEON_DATABASE_URL) for Drizzle.",
    );
  }
  return url.trim();
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl(),
  },
});
