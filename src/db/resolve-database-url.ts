/**
 * Neon / Vercel integrations use different env var names for the same URL.
 */
export function resolveDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.NEON_DATABASE_URL;

  if (!url?.trim()) {
    throw new Error(
      "Database URL is not set. Add DATABASE_URL to .env.local (Neon connection string), " +
        "or set POSTGRES_URL / NEON_DATABASE_URL if your host provides those instead.",
    );
  }

  return url.trim();
}
