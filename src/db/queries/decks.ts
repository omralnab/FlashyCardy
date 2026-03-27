import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { getFirestoreDb } from "@/db/firestore-admin";

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

export type DeckRow = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function deckDocToRow(
  id: string,
  data: FirebaseFirestore.DocumentData | undefined,
): DeckRow {
  return {
    id,
    title: String(data?.title ?? ""),
    description:
      data?.description === undefined || data?.description === null
        ? null
        : String(data.description),
    createdAt: toDate(data?.createdAt),
    updatedAt: toDate(data?.updatedAt),
  };
}

export async function listDecksForUser(userId: string): Promise<DeckRow[]> {
  const db = getFirestoreDb();
  const snap = await db.collection(`users/${userId}/decks`).get();

  const rows = snap.docs.map((d) => deckDocToRow(d.id, d.data()));
  rows.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return rows;
}

export async function getDeckByIdForUser(
  deckId: string,
  userId: string,
): Promise<DeckRow | null> {
  const db = getFirestoreDb();
  const ref = db.doc(`users/${userId}/decks/${deckId}`);
  const doc = await ref.get();
  if (!doc.exists) return null;
  return deckDocToRow(doc.id, doc.data());
}

export async function updateDeckForUser(
  deckId: string,
  userId: string,
  input: { title: string; description?: string | null },
): Promise<DeckRow | null> {
  const db = getFirestoreDb();
  const ref = db.doc(`users/${userId}/decks/${deckId}`);
  const doc = await ref.get();
  if (!doc.exists) return null;

  await ref.update({
    title: input.title,
    description: input.description ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const next = await ref.get();
  return deckDocToRow(next.id, next.data());
}

export async function deleteDeckForUser(
  deckId: string,
  userId: string,
): Promise<boolean> {
  const db = getFirestoreDb();
  const ref = db.doc(`users/${userId}/decks/${deckId}`);
  const doc = await ref.get();
  if (!doc.exists) return false;

  await db.recursiveDelete(ref);
  return true;
}

export async function insertDeckForUser(
  userId: string,
  input: { title: string; description?: string | null },
): Promise<DeckRow | null> {
  const db = getFirestoreDb();
  const decksCol = db.collection(`users/${userId}/decks`);
  const ref = decksCol.doc();
  const now = Timestamp.now();

  await ref.set({
    id: ref.id,
    title: input.title,
    description: input.description ?? null,
    createdAt: now,
    updatedAt: now,
  });

  const created = await ref.get();
  return deckDocToRow(created.id, created.data());
}
