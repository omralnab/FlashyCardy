"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createDeck } from "@/app/actions/decks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateDeckDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setTitle("");
    setDescription("");
    setFormError(null);
    setTitleError(null);
    setDescriptionError(null);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setTitleError(null);
    setDescriptionError(null);

    startTransition(async () => {
      const result = await createDeck({
        title,
        description,
      });

      if (result.ok) {
        setOpen(false);
        router.push(`/decks/${result.deckId}`);
        router.refresh();
        return;
      }

      if (typeof result.error === "string") {
        setFormError(result.error);
        return;
      }

      const fe = result.error.fieldErrors;
      if (fe.title?.[0]) setTitleError(fe.title[0]);
      if (fe.description?.[0]) setDescriptionError(fe.description[0]);
      if (result.error.formErrors[0]) {
        setFormError(result.error.formErrors[0]);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        size="lg"
        className="h-11 min-w-[200px] bg-emerald-600 px-6 text-base font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        onClick={openDialog}
      >
        Create New Deck
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={!pending}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new deck</DialogTitle>
            <DialogDescription>
              Add a title and optional description. You can add cards after
              creating the deck.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="create-deck-title">Title</Label>
              <Input
                id="create-deck-title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={pending}
                maxLength={255}
                aria-invalid={Boolean(titleError)}
                required
              />
              {titleError ? (
                <p className="text-sm text-destructive">{titleError}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-deck-description">Description</Label>
              <Textarea
                id="create-deck-description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={pending}
                maxLength={5000}
                rows={4}
                aria-invalid={Boolean(descriptionError)}
              />
              {descriptionError ? (
                <p className="text-sm text-destructive">{descriptionError}</p>
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
              {pending ? "Creating…" : "Create deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
