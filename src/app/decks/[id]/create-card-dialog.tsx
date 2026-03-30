"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createCard } from "@/app/actions/cards";
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

type CreateCardDialogProps = {
  deckId: string;
  /** Button label (default: Add Card) */
  label?: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  buttonSize?: React.ComponentProps<typeof Button>["size"];
  showIcon?: boolean;
};

export function CreateCardDialog({
  deckId,
  label = "Add Card",
  buttonVariant = "secondary",
  buttonSize = "sm",
  showIcon = true,
}: CreateCardDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setFront("");
    setBack("");
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
      const result = await createCard({
        deckId,
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
        variant={buttonVariant}
        size={buttonSize}
        className="gap-1.5"
        onClick={openDialog}
      >
        {showIcon ? <Plus className="size-3.5" aria-hidden /> : null}
        {label}
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={!pending}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New card</DialogTitle>
            <DialogDescription>
              Enter the front and back of your flashcard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor={`new-card-front-${deckId}`}>Front</Label>
              <Textarea
                id={`new-card-front-${deckId}`}
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
              <Label htmlFor={`new-card-back-${deckId}`}>Back</Label>
              <Textarea
                id={`new-card-back-${deckId}`}
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
              {pending ? "Adding…" : "Add card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
