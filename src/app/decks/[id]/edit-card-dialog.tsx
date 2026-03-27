"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { updateCard } from "@/lib/mutations/cards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EditCardDialogProps = {
  deckId: string;
  cardId: string;
  initialFront: string;
  initialBack: string;
};

export function EditCardDialog({
  deckId,
  cardId,
  initialFront,
  initialBack,
}: EditCardDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [formError, setFormError] = useState<string | null>(null);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setFront(initialFront);
    setBack(initialBack);
    setFormError(null);
    setFrontError(null);
    setBackError(null);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFrontError(null);
    setBackError(null);

    startTransition(async () => {
      const result = await updateCard({
        deckId,
        cardId,
        front,
        back,
      });

      if (result.ok) {
        setOpen(false);
        router.refresh();
        return;
      }

      if (typeof result.error === "string") {
        setFormError(result.error);
        return;
      }

      const fe = result.error.fieldErrors;
      if (fe.front?.[0]) setFrontError(fe.front[0]);
      if (fe.back?.[0]) setBackError(fe.back[0]);
      if (result.error.formErrors[0]) {
        setFormError(result.error.formErrors[0]);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={openDialog}
      >
        <Pencil className="size-3.5" aria-hidden />
        Edit
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={!pending}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit card</DialogTitle>
            <DialogDescription>
              Update the front and back of this flashcard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor={`edit-card-front-${cardId}`}>Front</Label>
              <Textarea
                id={`edit-card-front-${cardId}`}
                name="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                disabled={pending}
                maxLength={20000}
                rows={3}
                aria-invalid={Boolean(frontError)}
                required
              />
              {frontError ? (
                <p className="text-sm text-destructive">{frontError}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`edit-card-back-${cardId}`}>Back</Label>
              <Textarea
                id={`edit-card-back-${cardId}`}
                name="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                disabled={pending}
                maxLength={20000}
                rows={3}
                aria-invalid={Boolean(backError)}
                required
              />
              {backError ? (
                <p className="text-sm text-destructive">{backError}</p>
              ) : null}
            </div>
          </div>
          <DialogFooter className="border-0 bg-transparent p-0 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
