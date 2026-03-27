import type { Metadata } from "next";

import { DeckPageClient } from "./deck-page-client";
import { DeckInvalidId } from "./deck-not-found";
import { parseDeckIdParam } from "@/lib/deck-id";

type DeckPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [] as { id: string }[];
}

export const revalidate = 0;

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Deck | Flashy Cardy Course",
};

export default async function DeckPage({ params }: DeckPageProps) {
  const { id } = await params;
  const idResult = parseDeckIdParam(id);
  if (!idResult.ok) {
    return <DeckInvalidId />;
  }
  return <DeckPageClient deckId={idResult.deckId} />;
}
