import { NextResponse } from "next/server";
import { releaseDownloads, site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Platform = keyof typeof releaseDownloads;
type DownloadConfig = (typeof releaseDownloads)[Platform];

function isPlatform(value: string): value is Platform {
  return value === "mac" || value === "windows";
}

async function exists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", cache: "no-store" });
    return res.ok && !new URL(res.url).pathname.startsWith("/login");
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function unavailableHtml(platform: Platform, downloads: DownloadConfig): string {
  const otherPlatform = platform === "mac" ? "windows" : "mac";
  const otherHref = escapeHtml(site.downloads[otherPlatform]);
  const chromeHref = escapeHtml(site.downloads.chrome);
  const mailHref = escapeHtml(
    `mailto:${site.email}?subject=${encodeURIComponent(`Propel ${downloads.label} download`)}`,
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(downloads.unavailableTitle)} | Propel</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f3ff; color: #101226; }
      main { width: min(92vw, 560px); border: 1px solid #dedcf2; border-radius: 24px; background: #fff; padding: 42px; box-shadow: 0 24px 70px rgba(45, 41, 91, 0.16); }
      .mark { display: inline-grid; height: 48px; width: 48px; place-items: center; border-radius: 16px; background: #7b61ff; color: #fff; font-size: 24px; font-weight: 800; }
      h1 { margin: 22px 0 12px; font-size: clamp(30px, 6vw, 44px); line-height: 1; letter-spacing: 0; }
      p { margin: 0; color: #5f6680; font-size: 17px; line-height: 1.55; }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
      a { border-radius: 999px; padding: 12px 18px; font-weight: 700; text-decoration: none; }
      .primary { background: #101226; color: #fff; }
      .secondary { border: 1px solid #d7d5e8; color: #101226; }
      .note { margin-top: 20px; font-size: 13px; color: #7a8199; }
    </style>
  </head>
  <body>
    <main>
      <div class="mark">P</div>
      <h1>${escapeHtml(downloads.unavailableTitle)}</h1>
      <p>${escapeHtml(downloads.unavailableMessage)}</p>
      <div class="actions">
        <a class="primary" href="${otherHref}">Download for ${escapeHtml(releaseDownloads[otherPlatform].label)}</a>
        <a class="secondary" href="${chromeHref}">Get Chrome extension</a>
        <a class="secondary" href="${mailHref}">Email us</a>
      </div>
      <p class="note">No GitHub account is required to download Propel.</p>
    </main>
  </body>
</html>`;
}

export async function GET(_request: Request, { params }: { params: { platform: string } }) {
  if (!isPlatform(params.platform)) {
    return new Response("Unknown download platform", { status: 404 });
  }

  const downloads = releaseDownloads[params.platform];
  for (const target of downloads.candidates) {
    if (await exists(target)) {
      return NextResponse.redirect(target, 302);
    }
  }

  return new Response(unavailableHtml(params.platform, downloads), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
