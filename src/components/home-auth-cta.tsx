"use client";

import { SignInButton, SignUpButton } from "@clerk/react";
import { Button } from "@/components/ui/button";

export function HomeAuthCta() {
  return (
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
  );
}
