import { z } from "zod";

export const createDeckSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().max(5000).transform((s) => {
    const t = s.trim();
    return t === "" ? null : t;
  }),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;

export const updateDeckSchema = z.object({
  deckId: z.string().trim().min(1),
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().max(5000).transform((s) => {
    const t = s.trim();
    return t === "" ? null : t;
  }),
});

export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export const deleteDeckSchema = z.object({
  deckId: z.string().trim().min(1),
});

export type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;
