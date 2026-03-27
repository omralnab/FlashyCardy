"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteDeck } from "@/app/actions/decks";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function truncateText(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

type DeleteDeckDialogProps = {
  deckId: string;
  deckTitle: string;
};

export function DeleteDeckDialog({ deckId, deckTitle }: DeleteDeckDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const titlePreview = truncateText(deckTitle, 80);

  function handleOpenChange(next: boolean) {
    if (!pending) {
      setOpen(next);
      if (!next) setError(null);
    }
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteDeck({ deckId });
      if (result.ok) {
        setOpen(false);
        router.refresh();
        return;
      }
      if (typeof result.error === "string") {
        setError(result.error);
        return;
      }
      setError("Could not delete this deck.");
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9 shrink-0 border-slate-200 bg-white/90 text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive dark:border-slate-200"
        aria-label={`Delete deck ${deckTitle}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this deck?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">
              &ldquo;{titlePreview}&rdquo;
            </span>{" "}
            and all cards in it. This cannot be undone.
          </AlertDialogDescription>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending ? "Deleting…" : "Delete deck"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
