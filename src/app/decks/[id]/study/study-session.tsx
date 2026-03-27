"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type StudyCard = {
  id: string;
  front: string;
  back: string;
};

function shuffleArray<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

type StudySessionProps = {
  deckId: string;
  deckTitle: string;
  cards: StudyCard[];
};

export function StudySession({ deckId, deckTitle, cards: initialCards }: StudySessionProps) {
  const [order, setOrder] = useState<StudyCard[]>(() => shuffleArray(initialCards));
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = order.length;
  const current = order[index];

  const progressValue = useMemo(() => {
    if (total === 0) return 0;
    return Math.round(((index + 1) / total) * 100);
  }, [index, total]);

  const goPrev = useCallback(() => {
    setFinished(false);
    setIndex((i) => {
      if (i <= 0) return i;
      setIsFlipped(false);
      return i - 1;
    });
  }, []);

  const goNext = useCallback(() => {
    if (!current) return;
    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }
    if (index >= total - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setIsFlipped(false);
  }, [current, index, isFlipped, total]);

  /** Advances to the next card (or completes the session on the last card). Used by keyboard. */
  const goNextCard = useCallback(() => {
    if (finished) return;
    if (!current || total === 0) return;
    if (index >= total - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setIsFlipped(false);
  }, [current, finished, index, total]);

  const reshuffle = useCallback(() => {
    setOrder(shuffleArray(initialCards));
    setIndex(0);
    setIsFlipped(false);
    setFinished(false);
  }, [initialCards]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (finished) return;
        setIsFlipped((f) => !f);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNextCard();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finished, goNextCard, goPrev]);

  if (finished) {
    return (
      <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-10">
        <Link
          href={`/decks/${deckId}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit gap-2 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back to deck
        </Link>
        <Card className="border-border/60 bg-card/80 text-center shadow-lg ring-1 ring-border/40">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Session complete</CardTitle>
            <CardDescription>
              You reviewed all {total} {total === 1 ? "card" : "cards"} in &ldquo;{deckTitle}
              &rdquo;.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" className="gap-2" onClick={reshuffle}>
              <RotateCcw className="size-4 shrink-0" aria-hidden />
              Study again
            </Button>
            <Button
              type="button"
              variant="secondary"
              nativeButton={false}
              render={<Link href={`/decks/${deckId}`} />}
            >
              Return to deck
            </Button>
          </CardFooter>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {deckTitle}
        </h1>
        <p className="text-sm text-muted-foreground">Study session</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Link
          href={`/decks/${deckId}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit gap-2 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back to deck
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Badge variant="secondary">
            Card {index + 1} of {total}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={reshuffle}
          >
            <Shuffle className="size-3.5" aria-hidden />
            Shuffle
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progressValue} className="gap-2">
          <ProgressLabel>Progress</ProgressLabel>
          <ProgressValue>
            {(_formatted, value) => `${Math.round(value ?? 0)}%`}
          </ProgressValue>
        </Progress>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-lg ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <CardDescription>{isFlipped ? "Answer" : "Question"}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] px-4 sm:min-h-[240px] sm:px-6">
          <button
            type="button"
            onClick={() => !finished && setIsFlipped((f) => !f)}
            className={cn(
              "flex min-h-[inherit] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-8 text-center transition-colors hover:bg-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
            aria-label={isFlipped ? "Show question side" : "Show answer side"}
          >
            <p className="text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
              {isFlipped ? current?.back : current?.front}
            </p>
            <span className="mt-4 text-xs text-muted-foreground">
              Click the card to flip · Space flips · ← → for previous / next card
            </span>
          </button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 pt-4">
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={goPrev}
            disabled={index === 0}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </Button>
          <div className="flex flex-wrap gap-2">
            {!isFlipped ? (
              <Button type="button" onClick={() => setIsFlipped(true)}>
                Show answer
              </Button>
            ) : (
              <Button type="button" onClick={goNext} className="gap-1.5">
                {index >= total - 1 ? "Finish" : "Next"}
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
