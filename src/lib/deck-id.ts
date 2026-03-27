export type DeckIdParseResult =
  | { ok: true; deckId: string }
  | { ok: false };

export function parseDeckIdParam(raw: unknown): DeckIdParseResult {
  const s = String(raw ?? "").trim();
  if (s.length === 0) {
    return { ok: false };
  }
  return { ok: true, deckId: s };
}

/** Matches `app/decks/[id]` — `id` is the route param. `deckId` kept for compatibility. */
export async function parseDeckIdFromParams(
  params:
    | Promise<{ id?: string; deckId?: string }>
    | { id?: string; deckId?: string },
): Promise<DeckIdParseResult> {
  const p = await Promise.resolve(params);
  const raw = p?.id ?? p?.deckId;
  return parseDeckIdParam(raw);
}
