"use server";

import { auth } from "@clerk/nextjs/server";

import {
  deleteDeckForUser,
  insertDeckForUser,
  updateDeckForUser,
} from "@/db/queries/decks";
import {
  createDeckSchema,
  type CreateDeckInput,
  deleteDeckSchema,
  type DeleteDeckInput,
  updateDeckSchema,
  type UpdateDeckInput,
} from "@/lib/validators/deck";

export async function createDeck(input: CreateDeckInput) {
  const parsed = createDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" as const };
  }

  const deck = await insertDeckForUser(userId, {
    title: parsed.data.title,
    description: parsed.data.description,
  });

  if (!deck) {
    return { ok: false as const, error: "Failed to create deck" as const };
  }

  return { ok: true as const, deckId: deck.id };
}

export async function updateDeck(input: UpdateDeckInput) {
  const parsed = updateDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" as const };
  }

  const updated = await updateDeckForUser(parsed.data.deckId, userId, {
    title: parsed.data.title,
    description: parsed.data.description,
  });

  if (!updated) {
    return { ok: false as const, error: "Deck not found" as const };
  }

  return { ok: true as const };
}

export async function deleteDeck(input: DeleteDeckInput) {
  const parsed = deleteDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" as const };
  }

  const removed = await deleteDeckForUser(parsed.data.deckId, userId);
  if (!removed) {
    return { ok: false as const, error: "Deck not found" as const };
  }

  return { ok: true as const };
}
