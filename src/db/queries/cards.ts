import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { getFirestoreDb } from "@/db/firestore-admin";

import { getDeckByIdForUser } from "@/db/queries/decks";

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as Timestamp).toDate();
  }
  return new Date();
}

export type CardListRow = {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
};

function cardDocToListRow(
  id: string,
  data: FirebaseFirestore.DocumentData | undefined,
): CardListRow {
  return {
    id,
    front: String(data?.front ?? ""),
    back: String(data?.back ?? ""),
    createdAt: toDate(data?.createdAt),
  };
}

export async function listCardsForDeck(
  deckId: string,
  userId: string,
): Promise<CardListRow[]> {
  const deck = await getDeckByIdForUser(deckId, userId);
  if (!deck) return [];

  const db = getFirestoreDb();
  const snap = await db
    .collection(`users/${userId}/decks/${deckId}/cards`)
    .get();

  const rows = snap.docs.map((d) => {
    const data = d.data();
    const updated = toDate(data?.updatedAt ?? data?.createdAt);
    return { row: cardDocToListRow(d.id, data), sortKey: updated.getTime() };
  });
  rows.sort((a, b) => b.sortKey - a.sortKey);
  return rows.map((r) => r.row);
}

export async function insertCardForUser(
  deckId: string,
  userId: string,
  input: { front: string; back: string },
): Promise<CardListRow | null> {
  const deck = await getDeckByIdForUser(deckId, userId);
  if (!deck) {
    return null;
  }

  const db = getFirestoreDb();
  const cardsCol = db.collection(
    `users/${userId}/decks/${deckId}/cards`,
  );
  const ref = cardsCol.doc();
  const now = Timestamp.now();

  await ref.set({
    id: ref.id,
    deckId,
    front: input.front,
    back: input.back,
    createdAt: now,
    updatedAt: now,
  });

  const created = await ref.get();
  return cardDocToListRow(created.id, created.data());
}

export async function updateCardForUser(
  deckId: string,
  cardId: string,
  userId: string,
  input: { front: string; back: string },
): Promise<{ id: string; front: string; back: string } | null> {
  const deck = await getDeckByIdForUser(deckId, userId);
  if (!deck) {
    return null;
  }

  const db = getFirestoreDb();
  const ref = db.doc(
    `users/${userId}/decks/${deckId}/cards/${cardId}`,
  );
  const doc = await ref.get();
  if (!doc.exists) return null;

  await ref.update({
    front: input.front,
    back: input.back,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const next = await ref.get();
  const data = next.data();
  return {
    id: next.id,
    front: String(data?.front ?? ""),
    back: String(data?.back ?? ""),
  };
}

export async function deleteCardForUser(
  deckId: string,
  cardId: string,
  userId: string,
): Promise<boolean> {
  const deck = await getDeckByIdForUser(deckId, userId);
  if (!deck) {
    return false;
  }

  const db = getFirestoreDb();
  const ref = db.doc(
    `users/${userId}/decks/${deckId}/cards/${cardId}`,
  );
  const doc = await ref.get();
  if (!doc.exists) return false;

  await ref.delete();
  return true;
}
