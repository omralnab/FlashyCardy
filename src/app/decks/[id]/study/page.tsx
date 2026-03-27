import type { Metadata } from "next";

import { StudyPageClient } from "./study-page-client";

type StudyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [] as { id: string }[];
}

export const revalidate = 0;

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Study | Flashy Cardy Course",
};

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params;
  return <StudyPageClient rawId={id} />;
}
