"use client";

import { useAuth } from "@clerk/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { StaticExportDeckUnavailable } from "./static-export-deck-unavailable";

type DeckPageClientProps = {
  deckId: string;
};

export function DeckPageClient({ deckId }: DeckPageClientProps) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.replace("/");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div data-deck-id={deckId}>
      <StaticExportDeckUnavailable />
    </div>
  );
}
