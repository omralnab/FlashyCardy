"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardSignedOutCard() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  function openSignIn() {
    setSignUpOpen(false);
    setSignInOpen(true);
  }

  function openSignUp() {
    setSignInOpen(false);
    setSignUpOpen(true);
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-muted-foreground/20 bg-card/80 backdrop-blur">
          <CardHeader className="text-center sm:text-left">
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Dashboard
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Sign in to see your decks and study progress.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={openSignIn}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={openSignUp}
            >
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent
          showCloseButton
          className="max-w-[min(100vw-2rem,28rem)] gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Sign in</DialogTitle>
          </DialogHeader>
          <div className="max-h-[min(90vh,720px)] overflow-y-auto px-1 py-4">
            <SignIn
              routing="hash"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none",
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
        <DialogContent
          showCloseButton
          className="max-w-[min(100vw-2rem,28rem)] gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Sign up</DialogTitle>
          </DialogHeader>
          <div className="max-h-[min(90vh,720px)] overflow-y-auto px-1 py-4">
            <SignUp
              routing="hash"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none",
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
