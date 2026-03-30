"use client";

import Link from "next/link";
import { useAuth } from "@clerk/react";

import { CreateDeckDialog } from "./create-deck-dialog";
import { DeleteDeckDialog } from "./delete-deck-dialog";
import { DashboardSignedOutCard } from "./dashboard-signed-out-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type DashboardDeckItem = {
  id: string;
  title: string;
  description: string | null;
  updatedAt: string;
};

type DashboardClientProps = {
  initialDecks: DashboardDeckItem[];
};

export function DashboardClient({ initialDecks }: DashboardClientProps) {
  const { userId, isLoaded } = useAuth();
  const decks = initialDecks;

  if (!isLoaded) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (!userId) {
    return <DashboardSignedOutCard />;
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
      <div className="mb-8 text-center sm:text-left">
        <CardTitle className="block text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Dashboard
        </CardTitle>
        <CardDescription className="mt-2 text-base sm:text-lg">
          Manage your flashcard decks and study progress.
        </CardDescription>
      </div>

      {decks.length === 0 ? (
        <Card className="mb-8 border-dashed border-muted-foreground/20 bg-card/40">
          <CardHeader className="text-center sm:text-left">
            <CardTitle className="text-lg">No decks yet</CardTitle>
            <CardDescription>
              You don&apos;t have any decks yet. Create one to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {decks.map((deck) => (
            <div key={deck.id} className="relative rounded-xl">
              <Link
                href={`/decks/${deck.id}`}
                className="group block rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full cursor-pointer border-0 bg-white pr-12 text-slate-900 shadow-lg ring-1 ring-black/5 transition-shadow group-hover:shadow-xl dark:bg-white dark:text-slate-900">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {deck.title}
                    </CardTitle>
                    {deck.description ? (
                      <CardDescription className="text-slate-600">
                        {deck.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                </Card>
              </Link>
              <div className="absolute top-3 right-3 z-10">
                <DeleteDeckDialog deckId={deck.id} deckTitle={deck.title} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <CreateDeckDialog />
      </div>
    </section>
  );
}
