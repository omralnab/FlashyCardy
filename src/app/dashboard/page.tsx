import type { Metadata } from "next";

import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard | Flashy Cardy Course",
  description: "Manage your flashcard decks and study progress.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
