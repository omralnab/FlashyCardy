import type { z } from "zod";

import {
  createDeckSchema,
  deleteDeckSchema,
  updateDeckSchema,
  type CreateDeckInput,
  type DeleteDeckInput,
  type UpdateDeckInput,
} from "@/lib/validators/deck";

const staticExportError =
  "Mutations are not available in this static deployment. Run Next.js without output: export, or wire a remote API." as const;

export type CreateDeckResult =
  | { ok: true; deckId: string }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof createDeckSchema>
        | typeof staticExportError;
    };

export type UpdateDeckResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof updateDeckSchema>
        | typeof staticExportError;
    };

export type DeleteDeckResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof deleteDeckSchema>
        | typeof staticExportError;
    };

export async function createDeck(input: CreateDeckInput): Promise<CreateDeckResult> {
  const parsed = createDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: false as const, error: staticExportError };
}

export async function updateDeck(input: UpdateDeckInput): Promise<UpdateDeckResult> {
  const parsed = updateDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: false as const, error: staticExportError };
}

export async function deleteDeck(input: DeleteDeckInput): Promise<DeleteDeckResult> {
  const parsed = deleteDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: false as const, error: staticExportError };
}
