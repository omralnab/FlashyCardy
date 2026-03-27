import { DeckAliasRedirectClient } from "./deck-alias-redirect-client";

export async function generateStaticParams() {
  return [] as { id: string }[];
}

/** Allows static export when params list is empty (see Next.js `output: "export"` + dynamic routes). */
export const revalidate = 0;

export const dynamicParams = false;

export default function DeckAliasRedirectPage() {
  return <DeckAliasRedirectClient />;
}
