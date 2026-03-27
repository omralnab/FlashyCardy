"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { updateDeck } from "@/app/actions/decks";
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

type EditDeckDialogProps = {
  deckId: string;
  initialTitle: string;
  initialDescription: string | null;
};

export function EditDeckDialog({
  deckId,
  initialTitle,
  initialDescription,
}: EditDeckDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(
    initialDescription ?? "",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setTitle(initialTitle);
    setDescription(initialDescription ?? "");
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
      const result = await updateDeck({
        deckId,
        title,
        description,
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
            <DialogTitle>Edit deck</DialogTitle>
            <DialogDescription>
              Update the title and description for this deck.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="edit-deck-title">Title</Label>
              <Input
                id="edit-deck-title"
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
              <Label htmlFor="edit-deck-description">Description</Label>
              <Textarea
                id="edit-deck-description"
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
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
