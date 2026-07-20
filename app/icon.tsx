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
        <circle
          cx="16"
          cy="16"
          r="9"
          fill="none"
          stroke="#C8973E"
          strokeWidth="6"
        />
      </svg>
    </div>,
    { ...size },
  );
}
