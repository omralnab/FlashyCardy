import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { CreateDeckDialog } from "./create-deck-dialog";
import { DeleteDeckDialog } from "./delete-deck-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDecksForUser } from "@/db/queries/decks";

import { DashboardSignedOutCard } from "./dashboard-signed-out-card";
import { FirestoreConfigError } from "./firestore-config-error";

export const metadata: Metadata = {
  title: "Dashboard | Flashy Cardy Course",
  description: "Manage your flashcard decks and study progress.",
};

/** Deck list depends on Clerk session; never cache an empty or stale result. */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <DashboardSignedOutCard />;
  }

  let decks: Awaited<ReturnType<typeof listDecksForUser>>;
  try {
    decks = await listDecksForUser(userId);
  } catch {
    return <FirestoreConfigError />;
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
                  <CardContent className="pt-0">
                    <p className="text-xs text-slate-500">
                      Updated:{" "}
                      {deck.updatedAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
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
