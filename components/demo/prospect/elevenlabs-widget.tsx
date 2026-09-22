import type { DetailedHTMLProps, HTMLAttributes } from "react";
import Script from "next/script";

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
  avatarImageUrl?: string;
  dynamicVariables?: Record<string, string>;
}

export default function ElevenLabsWidget({
  agentId,
  avatarImageUrl,
  dynamicVariables,
}: ElevenLabsWidgetProps) {
  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
      />
      <elevenlabs-convai
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
        style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
      />
    </>
  );
}
