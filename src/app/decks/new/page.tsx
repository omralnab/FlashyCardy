import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function NewDeckPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Create new deck
      </h1>
      <p className="mt-3 text-center text-muted-foreground">
        Deck creation will be available here soon.
      </p>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
      >
        Back to dashboard
      </Link>
    </section>
  );
}
