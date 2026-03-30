"use server";

import { auth } from "@clerk/nextjs/server";
import type { z } from "zod";

import {
  createCardSchema,
  deleteCardSchema,
  updateCardSchema,
  type CreateCardInput,
  type DeleteCardInput,
  type UpdateCardInput,
} from "@/lib/validators/card";
import {
  deleteCardForUser,
  insertCardForUser,
  updateCardForUser,
} from "@/db/queries/cards";
import { logFirestoreFailure } from "@/lib/firestore-log";
import { FIRESTORE_SERVER_ERROR } from "@/lib/firestore-server-error";

const unauthorized = "Unauthorized" as const;
const notFound = "Deck or card not found" as const;

export type CreateCardResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof createCardSchema>
        | typeof unauthorized
        | typeof notFound
        | typeof FIRESTORE_SERVER_ERROR;
    };

export type UpdateCardResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof updateCardSchema>
        | typeof unauthorized
        | typeof notFound
        | typeof FIRESTORE_SERVER_ERROR;
    };

export type DeleteCardResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof deleteCardSchema>
        | typeof unauthorized
        | typeof notFound
        | typeof FIRESTORE_SERVER_ERROR;
    };

export async function createCard(input: CreateCardInput): Promise<CreateCardResult> {
  const parsed = createCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: unauthorized };
  }
  try {
    const row = await insertCardForUser(parsed.data.deckId, userId, {
      front: parsed.data.front,
      back: parsed.data.back,
    });
    if (!row) {
      return { ok: false as const, error: notFound };
    }
    return { ok: true as const };
  } catch (err) {
    logFirestoreFailure("createCard insertCardForUser", err);
    return { ok: false as const, error: FIRESTORE_SERVER_ERROR };
  }
}

export async function updateCard(input: UpdateCardInput): Promise<UpdateCardResult> {
  const parsed = updateCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: unauthorized };
  }
  try {
    const row = await updateCardForUser(
      parsed.data.deckId,
      parsed.data.cardId,
      userId,
      {
        front: parsed.data.front,
        back: parsed.data.back,
      },
    );
    if (!row) {
      return { ok: false as const, error: notFound };
    }
    return { ok: true as const };
  } catch (err) {
    logFirestoreFailure("updateCard updateCardForUser", err);
    return { ok: false as const, error: FIRESTORE_SERVER_ERROR };
  }
}

export async function deleteCard(input: DeleteCardInput): Promise<DeleteCardResult> {
  const parsed = deleteCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: unauthorized };
  }
  try {
    const ok = await deleteCardForUser(
      parsed.data.deckId,
      parsed.data.cardId,
      userId,
    );
    if (!ok) {
      return { ok: false as const, error: notFound };
    }
    return { ok: true as const };
  } catch (err) {
    logFirestoreFailure("deleteCard deleteCardForUser", err);
    return { ok: false as const, error: FIRESTORE_SERVER_ERROR };
  }
}
