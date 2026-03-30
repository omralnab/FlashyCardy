"use server";

import { auth } from "@clerk/nextjs/server";
import type { z } from "zod";

import {
  createDeckSchema,
  deleteDeckSchema,
  updateDeckSchema,
  type CreateDeckInput,
  type DeleteDeckInput,
  type UpdateDeckInput,
} from "@/lib/validators/deck";
import {
  deleteDeckForUser,
  insertDeckForUser,
  updateDeckForUser,
} from "@/db/queries/decks";
import { logFirestoreFailure } from "@/lib/firestore-log";
import { FIRESTORE_SERVER_ERROR } from "@/lib/firestore-server-error";

const unauthorized = "Unauthorized" as const;
const notFound = "Deck not found" as const;

export type CreateDeckResult =
  | { ok: true; deckId: string }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof createDeckSchema>
        | typeof unauthorized
        | typeof FIRESTORE_SERVER_ERROR;
    };

export type UpdateDeckResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof updateDeckSchema>
        | typeof unauthorized
        | typeof notFound
        | typeof FIRESTORE_SERVER_ERROR;
    };

export type DeleteDeckResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof deleteDeckSchema>
        | typeof unauthorized
        | typeof notFound
        | typeof FIRESTORE_SERVER_ERROR;
    };

export async function createDeck(input: CreateDeckInput): Promise<CreateDeckResult> {
  const parsed = createDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: unauthorized };
  }
  try {
    const row = await insertDeckForUser(userId, {
      title: parsed.data.title,
      description: parsed.data.description,
    });
    if (!row) {
      return { ok: false as const, error: unauthorized };
    }
    return { ok: true as const, deckId: row.id };
  } catch (err) {
    logFirestoreFailure("createDeck insertDeckForUser", err);
    return { ok: false as const, error: FIRESTORE_SERVER_ERROR };
  }
}

export async function updateDeck(input: UpdateDeckInput): Promise<UpdateDeckResult> {
  const parsed = updateDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: unauthorized };
  }
  try {
    const row = await updateDeckForUser(parsed.data.deckId, userId, {
      title: parsed.data.title,
      description: parsed.data.description,
    });
    if (!row) {
      return { ok: false as const, error: notFound };
    }
    return { ok: true as const };
  } catch (err) {
    logFirestoreFailure("updateDeck updateDeckForUser", err);
    return { ok: false as const, error: FIRESTORE_SERVER_ERROR };
  }
}

export async function deleteDeck(input: DeleteDeckInput): Promise<DeleteDeckResult> {
  const parsed = deleteDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: unauthorized };
  }
  try {
    const ok = await deleteDeckForUser(parsed.data.deckId, userId);
    if (!ok) {
      return { ok: false as const, error: notFound };
    }
    return { ok: true as const };
  } catch (err) {
    logFirestoreFailure("deleteDeck deleteDeckForUser", err);
    return { ok: false as const, error: FIRESTORE_SERVER_ERROR };
  }
}
