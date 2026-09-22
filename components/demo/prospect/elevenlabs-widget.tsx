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
        variant?: "tiny" | "compact" | "expanded" | "full";
        dismissible?: "true" | "false";
        "override-first-message"?: string;
      };
    }
  }
}

interface ElevenLabsWidgetProps {
  agentId: string;
  avatarImageUrl?: string;
  companyName?: string;
  dynamicVariables?: Record<string, string>;
}

export default function ElevenLabsWidget({
  agentId,
  avatarImageUrl,
  companyName,
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
        variant="expanded"
        dismissible="true"
        override-first-message={
          companyName
            ? `Hey! Thanks for checking out the demo — I see you're from ${companyName}. Want to chat about what Your Operator could do for your team?`
            : undefined
        }
        dynamic-variables={
          dynamicVariables ? JSON.stringify(dynamicVariables) : undefined
        }
      />
    </>
  );
}
