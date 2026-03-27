"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteCard } from "@/lib/mutations/cards";
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

type DeleteCardDialogProps = {
  deckId: string;
  cardId: string;
  cardFrontPreview: string;
};

export function DeleteCardDialog({
  deckId,
  cardId,
  cardFrontPreview,
}: DeleteCardDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const preview = truncateText(cardFrontPreview, 120);

  function handleOpenChange(next: boolean) {
    if (!pending) {
      setOpen(next);
      if (!next) setError(null);
    }
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCard({ deckId, cardId });
      if (result.ok) {
        setOpen(false);
        router.refresh();
        return;
      }
      if (typeof result.error === "string") {
        setError(result.error);
        return;
      }
      setError("Could not delete this card.");
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-3.5" aria-hidden />
        Delete
      </Button>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this card?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the card
            {preview ? (
              <>
                {" "}
                <span className="font-medium text-foreground">
                  &ldquo;{preview}&rdquo;
                </span>
              </>
            ) : null}
            . This cannot be undone.
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
            {pending ? "Deleting…" : "Delete card"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
