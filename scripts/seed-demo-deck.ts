import "dotenv/config";

import { insertCardForUser } from "../src/db/queries/cards";
import { insertDeckForUser, listDecksForUser } from "../src/db/queries/decks";

const SAMPLE_CARDS = [
  { front: "Hello", back: "Hola" },
  { front: "Goodbye", back: "Adiós" },
  { front: "Please", back: "Por favor" },
  { front: "Thank you", back: "Gracias" },
  { front: "Yes", back: "Sí" },
  { front: "No", back: "No" },
];

async function main() {
  const clerkUserId =
    process.argv[2]?.trim() || process.env.CLERK_USER_ID?.trim();
  if (!clerkUserId) {
    console.error(
      "Missing Clerk user id.\n" +
        "  Usage: npx tsx scripts/seed-demo-deck.ts <user_...>\n" +
        "  Or set CLERK_USER_ID in .env.local (Dashboard → Users → copy User ID).",
    );
    process.exit(1);
  }

  const existing = await listDecksForUser(clerkUserId);
  if (existing.length > 0) {
    console.log(
      `This account already has ${existing.length} deck(s). No seed rows added.`,
    );
    console.log(
      "Open /dashboard and use the deck links, or clear decks in Neon if you want a fresh demo.",
    );
    return;
  }

  const deck = await insertDeckForUser(clerkUserId, {
    title: "English to Spanish - Basic Vocabulary",
    description:
      "Learn essential Spanish vocabulary with English translations",
  });

  if (!deck) {
    throw new Error("Failed to create demo deck.");
  }

  for (const card of SAMPLE_CARDS) {
    const row = await insertCardForUser(deck.id, clerkUserId, card);
    if (!row) {
      throw new Error("Failed to insert card: " + card.front);
    }
  }

  console.log(`Created demo deck id=${deck.id} with ${SAMPLE_CARDS.length} cards.`);
  console.log(`Open: http://localhost:3000/decks/${deck.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
