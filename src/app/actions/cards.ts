"use server";

import { auth } from "@clerk/nextjs/server";

import {
  deleteCardForUser,
  insertCardForUser,
  updateCardForUser,
} from "@/db/queries/cards";
import {
  createCardSchema,
  deleteCardSchema,
  updateCardSchema,
  type CreateCardInput,
  type DeleteCardInput,
  type UpdateCardInput,
} from "@/lib/validators/card";

export async function createCard(input: CreateCardInput) {
  const parsed = createCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" as const };
  }

  const created = await insertCardForUser(
    parsed.data.deckId,
    userId,
    { front: parsed.data.front, back: parsed.data.back },
  );

  if (!created) {
    return { ok: false as const, error: "Deck not found" as const };
  }

  return { ok: true as const };
}

export async function updateCard(input: UpdateCardInput) {
  const parsed = updateCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" as const };
  }

  const updated = await updateCardForUser(
    parsed.data.deckId,
    parsed.data.cardId,
    userId,
    { front: parsed.data.front, back: parsed.data.back },
  );

  if (!updated) {
    return { ok: false as const, error: "Card not found" as const };
  }

  return { ok: true as const };
}

export async function deleteCard(input: DeleteCardInput) {
  const parsed = deleteCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" as const };
  }

  const removed = await deleteCardForUser(
    parsed.data.deckId,
    parsed.data.cardId,
    userId,
  );

  if (!removed) {
    return { ok: false as const, error: "Card not found" as const };
  }

  return { ok: true as const };
}
