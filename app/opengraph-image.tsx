import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f8f9f8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 40,
            fontWeight: 900,
            color: "#0e6b4a",
            marginBottom: 32,
          }}
        >
          VibeFix
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 900,
            color: "#111827",
            lineHeight: 1.25,
            maxWidth: 950,
          }}
        >
          {SITE_TITLE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#6b7280",
            marginTop: 28,
            maxWidth: 950,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
