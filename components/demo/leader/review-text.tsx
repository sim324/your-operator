"use client";

import { useState } from "react";

// Places review text runs up to ~900 chars; clamp so five reviews stay
// scannable.
const CLAMP_AT = 280;

export default function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CLAMP_AT;

  return (
    <p className="text-sm whitespace-pre-line text-muted-foreground">
      {expanded || !isLong ? text : `${text.slice(0, CLAMP_AT).trimEnd()}…`}
      {isLong && (
        <>
          {" "}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {expanded ? "Less" : "More"}
          </button>
        </>
      )}
    </p>
  );
}
