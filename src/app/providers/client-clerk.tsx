"use client";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/react";

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export function ClientClerk({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur">
          <div className="text-sm font-semibold tracking-tight text-slate-100">
            Flashy Cardy Course
          </div>
          <nav className="flex items-center gap-3">
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="rounded-md bg-sky-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-400">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-md bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-400">
                    Sign Up
                  </button>
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
