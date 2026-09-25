import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Propel — a browser agent for LinkedIn Easy Apply and Indeed applications";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const logoDataUrl = `data:image/png;base64,${readFileSync(
    join(process.cwd(), "public", "propel-logo.png"),
  ).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#10151b",
          backgroundImage: "linear-gradient(135deg, #10151b, #171d25)",
          color: "#edf2f7",
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={logoDataUrl} width={58} height={58} alt="" />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Propel</span>
            <span style={{ color: "#2386e7", fontSize: 17, fontWeight: 700, letterSpacing: 1.4 }}>
              AI JOB APPLICATION AGENT
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 990 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 63,
              fontWeight: 800,
              letterSpacing: -2.8,
              lineHeight: 1.04,
            }}
          >
            <span>Stop starting every job</span>
            <span style={{ color: "#3193e9" }}>application from scratch.</span>
          </div>
          <div style={{ marginTop: 26, color: "#a1afbd", fontSize: 25, lineHeight: 1.35 }}>
            Save your profile, résumé, and answers once. Propel fills LinkedIn Easy Apply and Indeed in your Chrome tab.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {[
            "LinkedIn Easy Apply",
            "Indeed applications",
            "Profile saved once",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(35, 134, 231, 0.28)",
                borderRadius: 999,
                background: "rgba(35, 134, 231, 0.12)",
                color: "#4a9eed",
                padding: "10px 17px",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
