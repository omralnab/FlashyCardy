import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Shown when `output: "export"` prevents server-side Firestore reads for deck routes. */
export function StaticExportDeckUnavailable() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-16">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Deck data unavailable here</CardTitle>
          <CardDescription className="text-pretty">
            This static deployment cannot load deck data from the server. Run the
            app with <code className="rounded bg-muted px-1 py-0.5 text-xs">npm
            run dev</code> (without static export) or host a Node deployment to
            use Firestore-backed pages.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to dashboard
          </Link>
        </div>
      </Card>
    </section>
  );
}
