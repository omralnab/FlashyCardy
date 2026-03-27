import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function DeckNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Deck not found
      </h1>
      <p className="mt-3 text-pretty text-muted-foreground">
        This deck does not exist, the URL id is invalid, or the deck belongs to
        another account. Rows in Neon must use your Clerk user id in{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">
          clerkUserId
        </code>{" "}
        so they show for the signed-in user.
      </p>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "default" }), "mt-8")}
      >
        Back to dashboard
      </Link>
    </section>
  );
}

export function DeckInvalidId() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Invalid deck link
      </h1>
      <p className="mt-3 text-muted-foreground">
        Use a numeric deck id from the dashboard, for example{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">/decks/1</code>.
      </p>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "default" }), "mt-8")}
      >
        Back to dashboard
      </Link>
    </section>
  );
}
