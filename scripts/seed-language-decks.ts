import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { insertCardForUser } from "../src/db/queries/cards";
import { insertDeckForUser } from "../src/db/queries/decks";

const SPANISH_CARDS = [
  { front: "Hello", back: "Hola" },
  { front: "Goodbye", back: "Adiós" },
  { front: "Please", back: "Por favor" },
  { front: "Thank you", back: "Gracias" },
  { front: "Water", back: "Agua" },
  { front: "Yes / No", back: "Sí / No" },
];

const ARABIC_CARDS = [
  { front: "Hello", back: "Marhaba (مرحبا)" },
  { front: "Thank you", back: "Shukran (شكرا)" },
  { front: "Peace", back: "Salam (سلام)" },
  { front: "How are you?", back: "Kayf haluk? (كيف حالك؟)" },
  { front: "Good morning", back: "Sabah al-khayr (صباح الخير)" },
  { front: "Goodbye", back: "Ma'a salama (مع السلامة)" },
];

async function main() {
  const clerkUserId =
    process.argv[2]?.trim() || process.env.CLERK_USER_ID?.trim();
  if (!clerkUserId) {
    console.error(
      "Missing Clerk user id.\n" +
        "  Usage: pnpm exec tsx scripts/seed-language-decks.ts <user_...>\n" +
        "  Or set CLERK_USER_ID in .env.local.",
    );
    process.exit(1);
  }

  const spanishDeck = await insertDeckForUser(clerkUserId, {
    title: "Simple Spanish Words",
    description: "English prompts with Spanish answers — basic vocabulary",
  });
  if (!spanishDeck) throw new Error("Failed to create Spanish deck.");

  for (const card of SPANISH_CARDS) {
    const row = await insertCardForUser(spanishDeck.id, clerkUserId, card);
    if (!row) throw new Error("Failed to insert Spanish card: " + card.front);
  }

  const arabicDeck = await insertDeckForUser(clerkUserId, {
    title: "Simple Arabic Words",
    description: "English prompts with Arabic answers — transliteration and script",
  });
  if (!arabicDeck) throw new Error("Failed to create Arabic deck.");

  for (const card of ARABIC_CARDS) {
    const row = await insertCardForUser(arabicDeck.id, clerkUserId, card);
    if (!row) throw new Error("Failed to insert Arabic card: " + card.front);
  }

  console.log(
    `Created decks for ${clerkUserId}:\n` +
      `  Spanish: ${spanishDeck.id} (${SPANISH_CARDS.length} cards)\n` +
      `  Arabic:  ${arabicDeck.id} (${ARABIC_CARDS.length} cards)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
