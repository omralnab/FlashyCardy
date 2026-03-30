import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FirestoreConfigError() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-16">
      <Card className="border-destructive/40 bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Could not load your decks</CardTitle>
          <CardDescription className="text-pretty">
            Firestore is not configured for the server. Add{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON
            </code>{" "}
            with the full JSON from Firebase Console → Project settings →
            Service accounts → Generate new private key. For local development,
            put it in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              .env.local
            </code>{" "}
            and restart the dev server. On Vercel, add the same variable under
            Project → Settings → Environment Variables (Production / Preview as
            needed). Public{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_FIREBASE_*
            </code>{" "}
            keys are not enough for server-side reads and writes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Home
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
