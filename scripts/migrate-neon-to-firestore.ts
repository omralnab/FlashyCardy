import "dotenv/config";
import admin from "firebase-admin";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";

type Args = {
  dryRun: boolean;
  limitDecks?: number;
  limitCards?: number;
};

function parseArgs(argv: string[]): Args {
  const dryRun = argv.includes("--dry-run") || process.env.DRY_RUN === "1";

  const limitDecksFlag = argv.find((a) => a.startsWith("--limit-decks="));
  const limitCardsFlag = argv.find((a) => a.startsWith("--limit-cards="));

  const limitDecks = limitDecksFlag
    ? Number(limitDecksFlag.split("=", 2)[1])
    : process.env.LIMIT_DECKS
      ? Number(process.env.LIMIT_DECKS)
      : undefined;

  const limitCards = limitCardsFlag
    ? Number(limitCardsFlag.split("=", 2)[1])
    : process.env.LIMIT_CARDS
      ? Number(process.env.LIMIT_CARDS)
      : undefined;

  return {
    dryRun,
    limitDecks: Number.isFinite(limitDecks as number) ? limitDecks : undefined,
    limitCards: Number.isFinite(limitCards as number) ? limitCards : undefined,
  };
}

function ensureFirebaseAdminInitialized() {
  if (admin.apps.length > 0) return;

  const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (serviceAccountJson?.trim()) {
    const parsed = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(parsed),
      projectId: projectId ?? parsed.projectId,
    });
    return;
  }

  // Falls back to Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS)
  // or other environments where the admin SDK can infer credentials.
  admin.initializeApp({
    projectId,
  });
}

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  ensureFirebaseAdminInitialized();
  const firestore = admin.firestore();

  console.log("Starting Neon -> Firestore migration");
  console.log(
    JSON.stringify(
      {
        dryRun: args.dryRun,
        projectId: admin.app().options.projectId ?? null,
        limitDecks: args.limitDecks ?? null,
        limitCards: args.limitCards ?? null,
      },
      null,
      2,
    ),
  );

  const decksQuery = db.select().from(decksTable);
  const deckRows =
    typeof args.limitDecks === "number"
      ? await decksQuery.limit(args.limitDecks)
      : await decksQuery;

  const cardsQuery = db
    .select({
      id: cardsTable.id,
      deckId: cardsTable.deckId,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
      updatedAt: cardsTable.updatedAt,
      clerkUserId: decksTable.clerkUserId,
    })
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id));

  const cardRows =
    typeof args.limitCards === "number"
      ? await cardsQuery.limit(args.limitCards)
      : await cardsQuery;

  console.log(`Loaded ${deckRows.length} decks and ${cardRows.length} cards from Neon.`);

  const writes: Array<{
    ref: FirebaseFirestore.DocumentReference;
    data: FirebaseFirestore.DocumentData;
  }> = [];

  for (const deck of deckRows) {
    const deckId = String(deck.id);
    const ref = firestore.doc(`users/${deck.clerkUserId}/decks/${deckId}`);
    writes.push({
      ref,
      data: {
        id: deckId,
        title: deck.title,
        description: deck.description ?? null,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        legacy: { postgresDeckId: deck.id },
      },
    });
  }

  for (const card of cardRows) {
    const deckId = String(card.deckId);
    const cardId = String(card.id);
    const ref = firestore.doc(
      `users/${card.clerkUserId}/decks/${deckId}/cards/${cardId}`,
    );
    writes.push({
      ref,
      data: {
        id: cardId,
        deckId,
        front: card.front,
        back: card.back,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        legacy: { postgresCardId: card.id, postgresDeckId: card.deckId },
      },
    });
  }

  console.log(`Prepared ${writes.length} Firestore document upserts.`);

  if (args.dryRun) {
    console.log("Dry run enabled; no writes were performed.");
    return;
  }

  const batches = chunk(writes, 450); // keep a buffer under the 500 write limit
  for (let i = 0; i < batches.length; i++) {
    const batch = firestore.batch();
    for (const w of batches[i]) {
      batch.set(w.ref, w.data, { merge: true });
    }
    await batch.commit();
    console.log(`Committed batch ${i + 1}/${batches.length} (${batches[i].length} ops)`);
  }

  console.log("Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
