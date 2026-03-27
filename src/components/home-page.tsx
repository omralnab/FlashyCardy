"use client";

import { useAuth } from "@clerk/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { HomeAuthCta } from "@/components/home-auth-cta";

export function HomePage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.replace("/dashboard");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (userId) {
    return null;
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4">
      <h1 className="text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        FlashyCardy
      </h1>
      <p className="mt-3 max-w-md text-center text-base text-muted-foreground sm:text-lg">
        Your personal flashcard platform
      </p>
      <HomeAuthCta />
    </section>
  );
}
