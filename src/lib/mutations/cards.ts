import type { z } from "zod";

import {
  createCardSchema,
  deleteCardSchema,
  updateCardSchema,
  type CreateCardInput,
  type DeleteCardInput,
  type UpdateCardInput,
} from "@/lib/validators/card";

const staticExportError =
  "Mutations are not available in this static deployment. Run Next.js without output: export, or wire a remote API." as const;

export type CreateCardResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof createCardSchema>
        | typeof staticExportError;
    };

export type UpdateCardResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof updateCardSchema>
        | typeof staticExportError;
    };

export type DeleteCardResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | z.inferFlattenedErrors<typeof deleteCardSchema>
        | typeof staticExportError;
    };

export async function createCard(input: CreateCardInput): Promise<CreateCardResult> {
  const parsed = createCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: false as const, error: staticExportError };
}

export async function updateCard(input: UpdateCardInput): Promise<UpdateCardResult> {
  const parsed = updateCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: false as const, error: staticExportError };
}

export async function deleteCard(input: DeleteCardInput): Promise<DeleteCardResult> {
  const parsed = deleteCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: false as const, error: staticExportError };
}
