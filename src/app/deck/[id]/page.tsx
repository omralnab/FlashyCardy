import { DeckAliasRedirectClient } from "./deck-alias-redirect-client";

/** Typo alias: `/deck/[id]` → `/decks/[id]` (client-side). */
export default function DeckAliasRedirectPage() {
  return <DeckAliasRedirectClient />;
}
