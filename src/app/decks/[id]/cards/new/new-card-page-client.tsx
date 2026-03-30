"use client";

import { CreateCardDialog } from "../../create-card-dialog";

type NewCardPageClientProps = {
  deckId: string;
};

export function NewCardPageClient({ deckId }: NewCardPageClientProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-muted-foreground">
        Add the front and back of your flashcard below.
      </p>
      <CreateCardDialog
        deckId={deckId}
        label="Add card"
        buttonVariant="default"
        buttonSize="lg"
        showIcon={false}
      />
    </div>
  );
}
