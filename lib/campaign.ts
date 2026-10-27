export const CAMPAIGN_STORAGE_KEY = "propel.campaign.v1";
export const CAMPAIGN_WINDOW_MS = 30 * 60 * 1000;

export type Campaign = { source: "tiktok"; capturedAt: number };

const MARKETING_PATHS = new Set([
  "/", "/tiktok", "/pricing", "/job-application-agent", "/how-to-auto-apply-to-jobs", "/privacy",
]);

export function campaignAt(url: URL, stored: string | null, now: number): Campaign | null {
  if (!MARKETING_PATHS.has(url.pathname)) return null;
  if (url.pathname === "/tiktok" || url.searchParams.get("utm_source") === "tiktok") {
    return { source: "tiktok", capturedAt: now };
  }
  // An explicitly different campaign must not inherit TikTok attribution.
  if (url.searchParams.has("utm_source")) return null;
  try {
    const value: unknown = JSON.parse(stored ?? "null");
    if (value && typeof value === "object" && "source" in value && value.source === "tiktok" &&
      "capturedAt" in value && typeof value.capturedAt === "number" &&
      now >= value.capturedAt && now - value.capturedAt < CAMPAIGN_WINDOW_MS) {
      return { source: "tiktok", capturedAt: value.capturedAt };
    }
  } catch { /* Invalid or blocked storage never prevents navigation. */ }
  return null;
}

export function campaignHref(href: string, currentUrl: URL): string {
  try {
    const target = new URL(href, currentUrl);
    if (target.origin !== currentUrl.origin || !MARKETING_PATHS.has(target.pathname)) return href;
    if (target.searchParams.has("utm_source") && target.searchParams.get("utm_source") !== "tiktok") return href;
    target.searchParams.set("utm_source", "tiktok");
    target.searchParams.set("utm_medium", "social");
    target.searchParams.set("utm_campaign", "bio");
    return `${target.pathname}${target.search}${target.hash}`;
  } catch { return href; }
}

export function publicAnalyticsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (!MARKETING_PATHS.has(url.pathname)) return null;
    const tiktok = url.searchParams.get("utm_source") === "tiktok";
    url.search = "";
    url.hash = "";
    if (tiktok) {
      url.searchParams.set("utm_source", "tiktok");
      url.searchParams.set("utm_medium", "social");
      url.searchParams.set("utm_campaign", "bio");
    }
    return url.href;
  } catch { return null; }
}
