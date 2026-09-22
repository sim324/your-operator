"use client";

import { useEffect, useRef, useState } from "react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import Script from "next/script";

import "driver.js/dist/driver.css";

// React 19 resolves JSX intrinsics from React.JSX (via "jsx": "react-jsx" in
// tsconfig), not a bare global JSX namespace - augment the "react" module's
// exported namespace directly.
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required shape for augmenting React.JSX.IntrinsicElements
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "agent-id": string;
        "avatar-image-url"?: string;
        "dynamic-variables"?: string;
        dismissible?: "true" | "false";
      };
    }
  }
}

interface ElevenLabsWidgetProps {
  agentId: string;
  // Keys the "have we already pointed this out?" flag, so a new company
  // (after Start over) gets the highlight again even though it's the same
  // browser/localStorage.
  companyId: string;
  avatarImageUrl?: string;
  dynamicVariables?: Record<string, string>;
}

const SEEN_STORAGE_PREFIX = "widget-tour-seen:";

export default function ElevenLabsWidget({
  agentId,
  companyId,
  avatarImageUrl,
  dynamicVariables,
}: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) return;

    const storageKey = `${SEEN_STORAGE_PREFIX}${companyId}`;
    try {
      if (localStorage.getItem(storageKey) === "true") return;
    } catch {
      // Storage unavailable (private browsing, etc.) - skip the tour rather
      // than risk showing it on every load.
      return;
    }

    // The widget is a web component upgraded by an externally loaded script
    // - its shadow DOM takes a moment to render (and get real dimensions)
    // after the script itself finishes loading. A short delay is simpler
    // than polling its bounding rect, and good enough for a one-time hint.
    const timeout = setTimeout(async () => {
      if (!widgetRef.current) return;

      const { driver } = await import("driver.js");
      driver({
        showProgress: false,
        onDestroyStarted: (_element, _step, { driver: instance }) => {
          try {
            localStorage.setItem(storageKey, "true");
          } catch {
            // ignore - worst case the hint shows again next time
          }
          instance.destroy();
        },
      }).highlight({
        element: widgetRef.current,
        popover: {
          title: "Your AI receptionist",
          description:
            "This is what an AI agent could look like on your own site - branded to match, ready to greet visitors and answer questions.",
          side: "left",
          align: "end",
        },
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [scriptLoaded, companyId]);

  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <elevenlabs-convai
        ref={widgetRef}
        agent-id={agentId}
        avatar-image-url={avatarImageUrl}
        dismissible="true"
        dynamic-variables={
          dynamicVariables ? JSON.stringify(dynamicVariables) : undefined
        }
        // Positioned within the nearest `position: relative` ancestor (the
        // iframe preview box) instead of fixed to the whole browser
        // viewport, so it reads as scoped to "their site" rather than our
        // app. Inline style wins over the widget's own internal
        // `:host { position: fixed }`.
        style={{ position: "absolute", bottom: ".5rem", right: ".5rem" }}
      />
    </>
  );
}
