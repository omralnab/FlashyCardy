"use client";

import { useAuth } from "@clerk/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DeckInvalidId } from "../../deck-not-found";
import { StaticExportDeckUnavailable } from "../../static-export-deck-unavailable";
import { parseDeckIdParam } from "@/lib/deck-id";

type NewCardPageClientProps = {
  rawId: string;
};

export function NewCardPageClient({ rawId }: NewCardPageClientProps) {
  const idResult = parseDeckIdParam(rawId);
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.replace("/");
    }
  }, [isLoaded, userId, router]);

  if (!idResult.ok) {
    return <DeckInvalidId />;
  }

  if (!isLoaded) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (!userId) {
    return null;
  }

  return <StaticExportDeckUnavailable />;
}
