import { redirect } from "next/navigation";

type DeckRedirectProps = {
  params: Promise<{ id: string }>;
};

/**
 * Common typo: /deck/1 → /decks/1
 */
export default async function DeckAliasRedirect({ params }: DeckRedirectProps) {
  const { id } = await params;
  redirect(`/decks/${encodeURIComponent(id)}`);
}
