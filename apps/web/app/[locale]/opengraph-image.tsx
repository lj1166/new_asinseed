import { ImageResponse } from "next/og";

/**
 * A technical fallback for homepage shares when Studio has no page-specific
 * social asset yet. It deliberately contains only stable brand and product
 * category language; a Studio-provided 1200x630 asset always takes priority.
 */
export const alt = "AsinSeed｜亚马逊关键词研究";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "#24180f",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#FF9200",
            borderRadius: "999px",
            color: "#24180f",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            padding: "12px 20px",
          }}
        >
          ASINSeed
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "920px" }}>
          <div style={{ color: "#FF9200", display: "flex", fontSize: 30, fontWeight: 700 }}>亚马逊关键词研究</div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.15 }}>
            从竞品线索出发，建立更清晰的研究路径
          </div>
        </div>
        <div style={{ color: "#f3d6a5", display: "flex", fontSize: 24 }}>面向真实业务问题的关键词研究起点</div>
      </div>
    ),
    { ...size },
  );
}
