import type { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { DeckInvalidId } from "../deck-not-found";
import { StudyPageClient } from "./study-page-client";
import { parseDeckIdParam } from "@/lib/deck-id";
import { listCardsForDeck } from "@/db/queries/cards";
import { getDeckByIdForUser } from "@/db/queries/decks";

type StudyPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Study | Flashy Cardy Course",
};

export default async function StudyPage({ params }: StudyPageProps) {
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

  const cardRows = await listCardsForDeck(idResult.deckId, userId);
  const cards = cardRows.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
  }));

  return (
    <StudyPageClient deckId={deck.id} deckTitle={deck.title} cards={cards} />
  );
}
