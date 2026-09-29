import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/site/logo";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

/** The 1200x630 share card used by every page's opengraph-image. */
export function ogCard({
  headline,
  dim,
  sub,
  fontSize = 92,
}: {
  headline: string;
  dim: string;
  sub: string;
  fontSize?: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          color: "#f7f8fb",
          background:
            "radial-gradient(900px 520px at 8% 0%, rgba(96,165,250,0.28), rgba(96,165,250,0) 70%), linear-gradient(180deg, #0b1120 0%, #0a0f1c 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <LogoMark width={52} />
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>
            {SITE.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize,
              lineHeight: 1.06,
              fontWeight: 700,
              letterSpacing: -fontSize * 0.038,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>{headline}</span>
            <span style={{ color: "#7d89a6" }}>{dim}</span>
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#c9d2e3",
              maxWidth: 900,
            }}
          >
            {sub}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
