import { z } from "zod";

export const createCardSchema = z.object({
  deckId: z.string().trim().min(1),
  front: z.string().trim().min(1, "Front is required").max(20000),
  back: z.string().trim().min(1, "Back is required").max(20000),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;

export const updateCardSchema = z.object({
  deckId: z.string().trim().min(1),
  cardId: z.string().trim().min(1),
  front: z.string().trim().min(1, "Front is required").max(20000),
  back: z.string().trim().min(1, "Back is required").max(20000),
});

export type UpdateCardInput = z.infer<typeof updateCardSchema>;

export const deleteCardSchema = z.object({
  deckId: z.string().trim().min(1),
  cardId: z.string().trim().min(1),
});

export type DeleteCardInput = z.infer<typeof deleteCardSchema>;
