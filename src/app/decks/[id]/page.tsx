import type { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { DeckPageClient } from "./deck-page-client";
import { DeckInvalidId } from "./deck-not-found";
import { parseDeckIdParam } from "@/lib/deck-id";
import { listCardsForDeck } from "@/db/queries/cards";
import { getDeckByIdForUser } from "@/db/queries/decks";

type DeckPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Deck | Flashy Cardy Course",
};

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { id } = await params;
  const idResult = parseDeckIdParam(id);
  if (!idResult.ok) {
    return <DeckInvalidId />;
  }

  const deck = await getDeckByIdForUser(idResult.deckId, userId);
  if (!deck) {
    notFound();
  }

  const cards = await listCardsForDeck(idResult.deckId, userId);

  return (
    <DeckPageClient
      deck={{
        id: deck.id,
        title: deck.title,
        description: deck.description,
      }}
      cards={cards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
      }))}
    />
  );
}
