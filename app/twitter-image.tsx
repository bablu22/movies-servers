import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #141414 60%, #2a0a0c 100%)",
          color: "white",
          padding: "60px",
          fontFamily: "Arial",
          gap: "18px",
        }}
      >
        <div style={{ fontSize: 34, color: "#e50914", fontWeight: 700 }}>StreamVault</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08 }}>
          Discover Streaming
          <br />
          Sites Instantly
        </div>
        <div style={{ fontSize: 28, color: "#d4d4d8" }}>
          Live status checking, filters, previews, and pagination
        </div>
      </div>
    ),
    size,
  )
}
