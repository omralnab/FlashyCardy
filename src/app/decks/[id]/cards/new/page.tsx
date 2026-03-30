import type { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { NewCardPageClient } from "./new-card-page-client";
import { DeckInvalidId } from "../../deck-not-found";
import { buttonVariants } from "@/components/ui/button-variants";
import { parseDeckIdParam } from "@/lib/deck-id";
import { getDeckByIdForUser } from "@/db/queries/decks";
import { cn } from "@/lib/utils";

type NewCardPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New card | Flashy Cardy Course",
};

export default async function NewCardPage({ params }: NewCardPageProps) {
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

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12">
      <div>
        <Link
          href={`/decks/${deck.id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 text-muted-foreground",
          )}
        >
          ← Back to deck
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          New card in &ldquo;{deck.title}&rdquo;
        </h1>
      </div>
      <NewCardPageClient deckId={deck.id} />
    </section>
  );
}
