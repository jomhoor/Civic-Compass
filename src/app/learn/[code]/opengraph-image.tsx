import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Civic Compass — Learn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const API_BASE =
  process.env.SERVER_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001/api";

const parastooPromise = fetch(
  "https://cdn.jsdelivr.net/npm/@fontsource/parastoo@5.2.3/files/parastoo-arabic-700-normal.woff"
).then((res) => res.arrayBuffer());

export default async function OGImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let parastooData: ArrayBuffer | null = null;
  try {
    parastooData = await parastooPromise;
  } catch {
    // Fallback without Persian font
  }

  let titleFa = "";
  let titleEn = "";
  let icon = "📜";
  let cardCount = 0;
  let description = "";

  try {
    const res = await fetch(`${API_BASE}/flashcards/decks/${encodeURIComponent(code)}`, {
      next: { revalidate: 600 },
    });
    if (res.ok) {
      const data = await res.json();
      titleFa = data.titleFa ?? "";
      titleEn = data.titleEn ?? "";
      icon = data.icon ?? "📜";
      cardCount = data.cards?.length ?? 0;
      description = data.description ?? "";
    }
  } catch {
    // Fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
          fontFamily: parastooData ? "Parastoo, sans-serif" : "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,187,144,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Icon */}
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          {icon}
        </div>

        {/* Persian title */}
        {titleFa && (
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center",
              direction: "rtl",
              marginBottom: "8px",
              display: "flex",
            }}
          >
            {titleFa}
          </div>
        )}

        {/* English title */}
        {titleEn && (
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {titleEn}
          </div>
        )}

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              maxWidth: "800px",
              marginBottom: "24px",
              direction: "rtl",
              display: "flex",
            }}
          >
            {description}
          </div>
        )}

        {/* Card count badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            borderRadius: "999px",
            background: "rgba(14,187,144,0.2)",
            border: "1px solid rgba(14,187,144,0.3)",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "18px", color: "#0EBB90", fontWeight: 600, display: "flex" }}>
            {cardCount} cards
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "absolute",
            bottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 500,
              display: "flex",
            }}
          >
            🧭 Civic Compass — Learn & Earn
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: parastooData
        ? [
            {
              name: "Parastoo",
              data: parastooData,
              weight: 700 as const,
              style: "normal" as const,
            },
          ]
        : [],
    }
  );
}
