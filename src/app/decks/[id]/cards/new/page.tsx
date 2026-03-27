import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button-variants";
import { getDeckByIdForUser } from "@/db/queries/decks";
import { parseDeckIdParam } from "@/lib/deck-id";
import { cn } from "@/lib/utils";

import { DeckInvalidId, DeckNotFound } from "../../deck-not-found";

type NewCardPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function NewCardPage({ params }: NewCardPageProps) {
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

  const deck = await getDeckByIdForUser(deckId, userId);
  if (!deck) {
    return <DeckNotFound />;
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Add card
      </h1>
      <p className="mt-3 max-w-md text-center text-muted-foreground">
        Card creation for &ldquo;{deck.title}&rdquo; will be available here
        soon.
      </p>
      <Link
        href={`/decks/${deckId}`}
        className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
      >
        Back to deck
      </Link>
    </section>
  );
}
