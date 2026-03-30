import type { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";

import { DashboardClient } from "./dashboard-client";
import { DeckDbError } from "@/app/decks/[id]/deck-db-error";
import { FirestoreConfigError } from "./firestore-config-error";
import { listDecksForUser } from "@/db/queries/decks";
import {
  isFirebaseAdminConfigError,
  logFirestoreFailure,
} from "@/lib/firestore-log";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Dashboard | Flashy Cardy Course",
  description: "Manage your flashcard decks and study progress.",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <DashboardClient initialDecks={[]} />;
  }

  try {
    const rows = await listDecksForUser(userId);
    const initialDecks = rows.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      updatedAt: d.updatedAt.toISOString(),
    }));
    return <DashboardClient initialDecks={initialDecks} />;
  } catch (err) {
    logFirestoreFailure("dashboard listDecksForUser", err);
    if (isFirebaseAdminConfigError(err)) {
      return <FirestoreConfigError />;
    }
    return <DeckDbError />;
  }
}
