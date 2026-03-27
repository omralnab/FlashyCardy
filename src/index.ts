import "dotenv/config";
import { count } from "drizzle-orm";

import { db } from "./db";
import { cardsTable, decksTable } from "./db/schema";

/**
 * Smoke test: verifies DATABASE_URL / Neon and that Drizzle can read your tables.
 * Run: npm run db:run
 */
async function main() {
  const [deckRow] = await db.select({ n: count() }).from(decksTable);
  const [cardRow] = await db.select({ n: count() }).from(cardsTable);

  console.log("Database connection OK.");
  console.log(`Total decks (all users): ${deckRow?.n ?? 0}`);
  console.log(`Total cards (all decks): ${cardRow?.n ?? 0}`);
}

main().catch((error) => {
  console.error("Database check failed:", error);
  process.exit(1);
});
