"use client";

import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";

import { CreateCardDialog } from "./create-card-dialog";
import { DeleteDeckDialog } from "@/app/dashboard/delete-deck-dialog";
import { EditDeckDialog } from "./edit-deck-dialog";
import { DeleteCardDialog } from "./delete-card-dialog";
import { EditCardDialog } from "./edit-card-dialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DeckPageClientProps = {
  deck: {
    id: string;
    title: string;
    description: string | null;
  };
  cards: { id: string; front: string; back: string }[];
};

export function DeckPageClient({ deck, cards }: DeckPageClientProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
      <div>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4 -ml-2 gap-1 text-muted-foreground",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Dashboard
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {deck.title}
            </h1>
            {deck.description ? (
              <p className="mt-2 text-pretty text-muted-foreground">
                {deck.description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <EditDeckDialog
              deckId={deck.id}
              initialTitle={deck.title}
              initialDescription={deck.description}
            />
            <DeleteDeckDialog
              deckId={deck.id}
              deckTitle={deck.title}
              afterDelete="/dashboard"
            />
            {cards.length > 0 ? (
              <Link
                href={`/decks/${deck.id}/study`}
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1.5")}
              >
                <BookOpen className="size-3.5" aria-hidden />
                Study
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-foreground">Cards</h2>
        <div className="flex flex-wrap gap-2">
          <CreateCardDialog deckId={deck.id} buttonSize="default" />
          <Link
            href={`/decks/${deck.id}/cards/new`}
            className={cn(buttonVariants({ variant: "outline", size: "default" }))}
          >
            Full-page add
          </Link>
        </div>
      </div>

      {cards.length === 0 ? (
        <Card className="border-dashed border-muted-foreground/25">
          <CardHeader>
            <CardTitle className="text-base">No cards yet</CardTitle>
            <CardDescription>
              Add your first card to start studying this deck.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="grid gap-4">
          {cards.map((card) => (
            <li key={card.id}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Front
                      </p>
                      <CardDescription className="text-base text-foreground">
                        {card.front}
                      </CardDescription>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Back
                      </p>
                      <CardDescription className="text-base text-foreground">
                        {card.back}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <EditCardDialog
                        deckId={deck.id}
                        cardId={card.id}
                        initialFront={card.front}
                        initialBack={card.back}
                      />
                      <DeleteCardDialog
                        deckId={deck.id}
                        cardId={card.id}
                        cardFrontPreview={card.front}
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
