import { ImageResponse } from "@vercel/og";

export const alt = "GhostCard | Physical Crypto Mastercard & Privacy Cards";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  try {
    // Fetch raw Bellota Text Bold (700) font binary
    const fontData = await fetch(
      "https://github.com/google/fonts/raw/main/ofl/bellotatext/BellotaText-Bold.ttf"
    ).then((res) => res.arrayBuffer());

    // Generate deterministic star positions for space background
    const stars = Array.from({ length: 90 }).map((_, i) => ({
      x: (i * 37) % 1200,
      y: (i * 53) % 630,
      size: (i % 3) + 1.5,
      opacity: ((i % 5) + 3) / 10,
    }));

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#070709",
            position: "relative",
            fontFamily: '"Bellota Text", sans-serif',
            color: "#ffffff",
          }}
        >
          {/* Space Background Starfield Points */}
          {stars.map((star, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                opacity: star.opacity,
              }}
            />
          ))}

          {/* Main Content Box - Clean, solid colors, no gradients, bold typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 80px",
            }}
          >
            {/* Top Tagline */}
            <div
              style={{
                color: "#a78bfa",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Physical Crypto Mastercard • No-KYC
            </div>

            {/* Brand Title */}
            <div
              style={{
                fontSize: 88,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.02em",
                lineHeight: 1.0,
                marginBottom: 24,
              }}
            >
              GHOSTCARD
            </div>

            {/* Headline Subtitle */}
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#d4d4d8",
                maxWidth: 820,
                lineHeight: 1.4,
              }}
            >
              Your Money. Your Rules. Funded with Crypto. Built for everyday cash access and total privacy.
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Bellota Text",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OpenGraph image: ${e.message}`, {
      status: 500,
    });
  }
}
