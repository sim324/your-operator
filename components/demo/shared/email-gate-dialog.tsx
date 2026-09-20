"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailGateDialog() {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setError("Enter a valid email to continue.");
      return;
    }

    setError(null);
    setValidated(true);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Block dismissal until the email has been validated.
        if (!next && !validated) return;
        setOpen(next);
      }}
    >
      <DialogContent
        className="sm:max-w-4xl bg-background p-8"
        showCloseButton={validated}
        onEscapeKeyDown={(event) => {
          if (!validated) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (!validated) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-5xl font-black font-sans">
            See it in action
          </DialogTitle>
          <DialogDescription className="text-2xl">
            Watch a quick overview, then enter your email to continue into the
            demo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
          Video placeholder (16:9)
        </div>

        {validated ? (
          <p className="text-sm text-muted-foreground">
            Thanks — close this to continue exploring the demo.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
            <Button type="submit" size="lg">
              Continue
            </Button>
          </form>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
