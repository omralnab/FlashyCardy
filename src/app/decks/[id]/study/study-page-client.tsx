"use client";

import Link from "next/link";

import { StudySession } from "./study-session";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StudyPageClientProps = {
  deckId: string;
  deckTitle: string;
  cards: { id: string; front: string; back: string }[];
};

export function StudyPageClient({
  deckId,
  deckTitle,
  cards,
}: StudyPageClientProps) {
  if (cards.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">No cards to study</CardTitle>
            <CardDescription>
              Add at least one card to this deck before starting a study session.
            </CardDescription>
          </CardHeader>
        </Card>
        <Link
          href={`/decks/${deckId}`}
          className={cn(buttonVariants({ variant: "outline" }), "self-start")}
        >
          Back to deck
        </Link>
      </section>
    );
  }

  return <StudySession deckId={deckId} deckTitle={deckTitle} cards={cards} />;
}
