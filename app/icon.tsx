import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1C1917",
        display: "flex",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="23" cy="10" r="3.5" fill="#D4614A" />
        <polygon points="0,32 16,10 32,32" fill="#C8973E" />
      </svg>
    </div>,
    { ...size },
  );
}
