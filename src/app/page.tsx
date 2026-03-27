import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4">
      <h1 className="text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        FlashyCardy
      </h1>
      <p className="mt-3 max-w-md text-center text-base text-muted-foreground sm:text-lg">
        Your personal flashcard platform
      </p>
      <Show when="signed-out">
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button variant="outline" size="default">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="default">Sign Up</Button>
          </SignUpButton>
        </div>
      </Show>
    </section>
  );
}
