import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 20%, rgba(229,9,20,0.35), transparent 45%), #0a0a0a",
          color: "white",
          padding: "56px",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 36, color: "#e50914", fontWeight: 700 }}>
          StreamVault
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
            Movie Streaming
            <br />
            Services Directory
          </div>
          <div style={{ fontSize: 28, color: "#d1d5db" }}>
            251+ sites with live uptime status and preview snapshots
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#9ca3af" }}>streamvault directory</div>
      </div>
    ),
    size,
  )
}
