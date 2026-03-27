import { NewCardPageClient } from "./new-card-page-client";

type NewCardPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [] as { id: string }[];
}

export const revalidate = 0;

export const dynamicParams = false;

export default async function NewCardPage({ params }: NewCardPageProps) {
  const { id } = await params;
  return <NewCardPageClient rawId={id} />;
}
