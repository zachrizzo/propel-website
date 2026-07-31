export const TRACKED_PAGE_PATHS = [
  "/",
  "/job-application-agent",
  "/how-to-auto-apply-to-jobs",
  "/privacy",
] as const;

export type TrackedPagePath = (typeof TRACKED_PAGE_PATHS)[number];
export type AnalyticsEventName =
  | "page_view"
  | "download_click"
  | "scroll_depth"
  | "section_view";
export type DownloadTarget = "mac" | "windows" | "chrome" | "download_section";
export type ScrollDepth = 25 | 50 | 75 | 90;

export interface AnalyticsEvent {
  id: string;
  visitor_id: string;
  session_id: string;
  event_name: AnalyticsEventName;
  page_path: TrackedPagePath;
  section_key: string | null;
  download_target: DownloadTarget | null;
  scroll_depth: ScrollDepth | null;
}

export const MAX_ANALYTICS_BATCH_SIZE = 20;

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SECTION_KEY = /^[a-z0-9][a-z0-9._-]{0,79}$/;
const DOWNLOAD_TARGETS = new Set<DownloadTarget>([
  "mac",
  "windows",
  "chrome",
  "download_section",
]);
const SCROLL_DEPTHS = new Set<ScrollDepth>([25, 50, 75, 90]);
const TRACKED_PATHS = new Set<string>(TRACKED_PAGE_PATHS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isTrackedPagePath(value: string): value is TrackedPagePath {
  return TRACKED_PATHS.has(value);
}

/**
 * Validate and rebuild an event from its allowlisted fields. Rebuilding is
 * intentional: unexpected client properties (including accidental PII) never
 * reach Supabase.
 */
export function normalizeAnalyticsEvent(value: unknown): AnalyticsEvent | null {
  if (!isRecord(value)) return null;

  const id = value.id;
  const visitorId = value.visitor_id;
  const sessionId = value.session_id;
  const eventName = value.event_name;
  const pagePath = value.page_path;

  if (
    typeof id !== "string" ||
    typeof visitorId !== "string" ||
    typeof sessionId !== "string" ||
    !UUID_V4.test(id) ||
    !UUID_V4.test(visitorId) ||
    !UUID_V4.test(sessionId) ||
    typeof pagePath !== "string" ||
    !isTrackedPagePath(pagePath)
  ) {
    return null;
  }

  const base = {
    id,
    visitor_id: visitorId,
    session_id: sessionId,
    page_path: pagePath,
  };

  if (eventName === "page_view") {
    return {
      ...base,
      event_name: eventName,
      section_key: null,
      download_target: null,
      scroll_depth: null,
    };
  }

  if (eventName === "download_click") {
    const target = value.download_target;
    if (typeof target !== "string" || !DOWNLOAD_TARGETS.has(target as DownloadTarget)) return null;
    return {
      ...base,
      event_name: eventName,
      section_key: null,
      download_target: target as DownloadTarget,
      scroll_depth: null,
    };
  }

  if (eventName === "scroll_depth") {
    const depth = value.scroll_depth;
    if (typeof depth !== "number" || !SCROLL_DEPTHS.has(depth as ScrollDepth)) return null;
    return {
      ...base,
      event_name: eventName,
      section_key: null,
      download_target: null,
      scroll_depth: depth as ScrollDepth,
    };
  }

  if (eventName === "section_view") {
    const sectionKey = value.section_key;
    if (typeof sectionKey !== "string" || !SECTION_KEY.test(sectionKey)) return null;
    return {
      ...base,
      event_name: eventName,
      section_key: sectionKey,
      download_target: null,
      scroll_depth: null,
    };
  }

  return null;
}
