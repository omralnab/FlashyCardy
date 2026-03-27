"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/** Common typo: /deck/1 → /decks/1 (client redirect for static export). */
export function DeckAliasRedirectClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    router.replace(`/decks/${encodeURIComponent(id)}`);
  }, [id, router]);

  return null;
}
