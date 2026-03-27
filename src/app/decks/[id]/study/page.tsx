import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listCardsForDeck } from "@/db/queries/cards";
import { getDeckByIdForUser } from "@/db/queries/decks";
import { parseDeckIdParam } from "@/lib/deck-id";
import { cn } from "@/lib/utils";

import { DeckDbError } from "../deck-db-error";
import { DeckInvalidId, DeckNotFound } from "../deck-not-found";

import { StudySession } from "./study-session";

type StudyPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: StudyPageProps): Promise<Metadata> {
  const { userId } = await auth();
  if (!userId) {
    return {
      title: "Study | Flashy Cardy Course",
    };
  }

  const { id } = await Promise.resolve(params);
  const idResult = parseDeckIdParam(id);
  if (!idResult.ok) {
    return {
      title: "Study | Flashy Cardy Course",
    };
  }

  try {
    const deck = await getDeckByIdForUser(idResult.deckId, userId);
    if (!deck) {
      return {
        title: "Study | Flashy Cardy Course",
      };
    }
    return {
      title: `Study: ${deck.title} | Flashy Cardy Course`,
      description: deck.description ?? undefined,
    };
  } catch {
    return {
      title: "Study | Flashy Cardy Course",
    };
  }
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { id } = await Promise.resolve(params);
  const idResult = parseDeckIdParam(id);
  if (!idResult.ok) {
    return <DeckInvalidId />;
  }
  const deckId = idResult.deckId;

  let deck: Awaited<ReturnType<typeof getDeckByIdForUser>>;
  let cards: Awaited<ReturnType<typeof listCardsForDeck>>;
  try {
    [deck, cards] = await Promise.all([
      getDeckByIdForUser(deckId, userId),
      listCardsForDeck(deckId, userId),
    ]);
  } catch {
    return <DeckDbError />;
  }

  if (!deck) {
    return <DeckNotFound />;
  }

  if (cards.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-10">
        <Link
          href={`/decks/${deckId}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit text-muted-foreground hover:text-foreground",
          )}
        >
          ← Back to deck
        </Link>
        <Card className="border-border/60 bg-card/80 text-center shadow-lg ring-1 ring-border/40">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">No cards to study</CardTitle>
            <CardDescription>
              Add at least one card to &ldquo;{deck.title}&rdquo; before starting a session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              nativeButton={false}
              render={<Link href={`/decks/${deckId}`} />}
            >
              Add a card
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const studyCards = cards.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
  }));

  return (
    <StudySession deckId={deckId} deckTitle={deck.title} cards={studyCards} />
  );
}
