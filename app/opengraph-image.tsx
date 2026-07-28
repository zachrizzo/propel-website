import { ImageResponse } from "next/og";

export const alt = "Propel — a browser agent for job applications across job boards and employer career sites";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#fbfbff",
          color: "#171729",
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "linear-gradient(145deg, #6366f1, #4f46e5)",
              color: "white",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            ↑
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Propel</span>
            <span style={{ color: "#6366f1", fontSize: 17, fontWeight: 700, letterSpacing: 1.4 }}>
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
            <span style={{ color: "#4f46e5" }}>application from scratch.</span>
          </div>
          <div style={{ marginTop: 26, color: "#57576f", fontSize: 25, lineHeight: 1.35 }}>
            Save your profile, résumé, and answers once. Propel carries them through supported applications across job sites.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {[
            "Job boards",
            "Employer career sites",
            "Easy Apply included",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #c7d2fe",
                borderRadius: 999,
                background: "#eef2ff",
                color: "#3730a3",
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
