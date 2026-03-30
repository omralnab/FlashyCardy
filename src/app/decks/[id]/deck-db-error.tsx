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

export function DeckDbError() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-16">
      <Card className="border-destructive/40 bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Could not load deck data</CardTitle>
          <CardDescription className="text-pretty">
            The app could not read from Firestore. The server needs a{" "}
            <strong>Firebase service account</strong>, not only the public web
            config. Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON
            </code>{" "}
            (full JSON from Firebase Console → Project settings → Service
            accounts) in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              .env.local
            </code>{" "}
            for local dev, or in your host&apos;s environment variables on
            Vercel. Alternatively set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              GOOGLE_APPLICATION_CREDENTIALS
            </code>{" "}
            locally to the path of that JSON file. Check deployment logs for the
            exact error.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
