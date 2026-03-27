import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Play } from "lucide-react";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listCardsForDeck } from "@/db/queries/cards";
import { getDeckByIdForUser } from "@/db/queries/decks";
import { cn } from "@/lib/utils";

import { parseDeckIdParam } from "@/lib/deck-id";

import { DeckDbError } from "./deck-db-error";
import { CreateCardDialog } from "./create-card-dialog";
import { DeleteCardDialog } from "./delete-card-dialog";
import { EditCardDialog } from "./edit-card-dialog";
import { EditDeckDialog } from "./edit-deck-dialog";
import { DeckInvalidId, DeckNotFound } from "./deck-not-found";

type DeckPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export const dynamic = "force-dynamic";

const dateOpts: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export async function generateMetadata({
  params,
}: DeckPageProps): Promise<Metadata> {
  const { userId } = await auth();
  if (!userId) {
    return {
      title: "Deck | Flashy Cardy Course",
    };
  }

  const { id } = await Promise.resolve(params);
  const idResult = parseDeckIdParam(id);
  if (!idResult.ok) {
    return {
      title: "Deck | Flashy Cardy Course",
    };
  }

  try {
    const deck = await getDeckByIdForUser(idResult.deckId, userId);
    if (!deck) {
      return {
        title: "Deck | Flashy Cardy Course",
      };
    }
    return {
      title: `${deck.title} | Flashy Cardy Course`,
      description: deck.description ?? undefined,
    };
  } catch {
    return {
      title: "Deck | Flashy Cardy Course",
    };
  }
}

export default async function DeckPage({ params }: DeckPageProps) {
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

  const createdLabel = deck.createdAt.toLocaleDateString(undefined, dateOpts);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-fit gap-2 text-muted-foreground hover:text-foreground",
        )}
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        Back to Dashboard
      </Link>

      <Card className="border-border/60 bg-card/80 shadow-lg ring-1 ring-border/40 backdrop-blur-sm">
        <CardHeader className="gap-3">
          <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {deck.title}
          </CardTitle>
          <CardAction>
            <EditDeckDialog
              deckId={deckId}
              initialTitle={deck.title}
              initialDescription={deck.description}
            />
          </CardAction>
          {deck.description ? (
            <CardDescription className="text-base">
              {deck.description}
            </CardDescription>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </Badge>
            <Badge variant="secondary">Created {createdLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            size="lg"
            className="w-full gap-2 sm:min-h-11"
            nativeButton={false}
            render={
              <Link href={`/decks/${deckId}/study`}>
                <Play className="size-4 shrink-0" aria-hidden />
                Start Study Session
              </Link>
            }
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Cards
          </h2>
          <CreateCardDialog deckId={deckId} />
        </div>

        {cards.length === 0 ? (
          <Card className="border-dashed border-muted-foreground/25 bg-card/40">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center text-muted-foreground">
              <p>No cards in this deck yet</p>
              <CreateCardDialog
                deckId={deckId}
                label="Add your first card"
                buttonVariant="default"
                buttonSize="default"
              />
            </CardContent>
          </Card>
        ) : (
          <ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Cards in deck"
          >
            {cards.map((card) => (
              <li key={card.id}>
                <Card className="h-full border-border/60 bg-card/60 ring-1 ring-border/30">
                  <CardHeader className="gap-2 pb-2">
                    <CardTitle className="text-base font-semibold leading-snug text-foreground">
                      {card.front}
                    </CardTitle>
                    <CardAction className="flex flex-wrap gap-2">
                      <EditCardDialog
                        deckId={deckId}
                        cardId={card.id}
                        initialFront={card.front}
                        initialBack={card.back}
                      />
                      <DeleteCardDialog
                        deckId={deckId}
                        cardId={card.id}
                        cardFrontPreview={card.front}
                      />
                    </CardAction>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {card.back}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
