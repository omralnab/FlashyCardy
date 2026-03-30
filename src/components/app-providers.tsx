"use client";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/react";
import { Button } from "@/components/ui/button";
import { ClientRuntimeLog } from "@/components/client-runtime-log";

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ClientRuntimeLog />
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur">
          <div className="text-sm font-semibold tracking-tight text-slate-100">
            Flashy Cardy Course
          </div>
          <nav className="flex items-center gap-3">
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </ClerkProvider>
  );
}
