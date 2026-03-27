import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function frontendApiHostFromPublishableKey(pk: string): string | null {
  const m = pk.match(/^pk_(?:test|live)_(.+)$/);
  if (!m) return null;
  const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  try {
    const s = Buffer.from(b64 + pad, "base64").toString("utf8");
    return s.replace(/\$/g, "").trim() || null;
  } catch {
    return null;
  }
}

export default async function DevClerkPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const secret = process.env.CLERK_SECRET_KEY;
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!secret || !pk) {
    return (
      <div className="mx-auto max-w-lg p-6 text-sm text-muted-foreground">
        Missing <code className="text-foreground">CLERK_SECRET_KEY</code> or{" "}
        <code className="text-foreground">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> in
        the environment.
      </div>
    );
  }

  const [instRes, usersRes] = await Promise.all([
    fetch("https://api.clerk.com/v1/instance", {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    }),
    fetch("https://api.clerk.com/v1/users?limit=500", {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    }),
  ]);

  const instance = await instRes.json();
  const usersJson: unknown = await usersRes.json();
  const users = Array.isArray(usersJson)
    ? usersJson
    : Array.isArray((usersJson as { data?: unknown }).data)
      ? (usersJson as { data: unknown[] }).data
      : [];

  const host = frontendApiHostFromPublishableKey(pk);

  return (
    <div className="mx-auto max-w-lg p-6">
      <Card>
        <CardHeader>
          <CardTitle>Clerk (local dev check)</CardTitle>
          <CardDescription>
            Same API your server uses. If this shows users but the Clerk website does
            not, you are logged into the wrong Clerk application or viewing Production
            instead of Development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="font-medium text-foreground">Instance</div>
            <div className="mt-1 text-muted-foreground">
              <code className="text-xs">{String(instance.id ?? "—")}</code>
              {" · "}
              <span className="capitalize">
                {String(instance.environment_type ?? "unknown")}
              </span>
            </div>
          </div>
          {host ? (
            <div>
              <div className="font-medium text-foreground">Frontend API host</div>
              <div className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {host}
              </div>
              <p className="mt-2 text-muted-foreground">
                In Clerk Dashboard → API keys, confirm this matches the Frontend API for
                the app you have selected.
              </p>
            </div>
          ) : null}
          <div>
            <div className="font-medium text-foreground">Users (this app)</div>
            <div className="mt-1 text-muted-foreground">
              {users.length} user{users.length === 1 ? "" : "s"} returned by the API
            </div>
          </div>
          <a
            href="https://dashboard.clerk.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open Clerk Dashboard
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
