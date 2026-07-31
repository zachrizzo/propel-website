"use client";

import {
  MAX_ANALYTICS_BATCH_SIZE,
  normalizeAnalyticsEvent,
  type AnalyticsEvent,
  type DownloadTarget,
  type ScrollDepth,
  type TrackedPagePath,
} from "@/lib/analytics-events";

const VISITOR_STORAGE_KEY = "propel.analytics.visitor.v1";
const SESSION_STORAGE_KEY = "propel.analytics.session.v1";
const QUEUE_STORAGE_KEY = "propel.analytics.queue.v1";
const SEEN_STORAGE_KEY = "propel.analytics.seen.v1";
const MAX_QUEUE_SIZE = 100;
const DO_NOT_TRACK_VALUES = new Set(["1", "yes"]);

let memoryVisitorId: string | null = null;
let memorySessionId: string | null = null;
let memoryQueue: AnalyticsEvent[] = [];
const memorySeen = new Set<string>();
let flushTimer: number | null = null;
let flushInFlight = false;
let retryDelayMs = 1_000;

function uuidV4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function storedId(storage: Storage, key: string, fallback: "visitor" | "session"): string {
  try {
    const existing = storage.getItem(key);
    if (existing && normalizeAnalyticsEvent({
      id: existing,
      visitor_id: existing,
      session_id: existing,
      event_name: "page_view",
      page_path: "/",
    })) {
      return existing;
    }
    const created = uuidV4();
    storage.setItem(key, created);
    return created;
  } catch {
    if (fallback === "visitor") return (memoryVisitorId ??= uuidV4());
    return (memorySessionId ??= uuidV4());
  }
}

function queue(): AnalyticsEvent[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(QUEUE_STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return memoryQueue;
    return parsed
      .map(normalizeAnalyticsEvent)
      .filter((event): event is AnalyticsEvent => event !== null)
      .slice(-MAX_QUEUE_SIZE);
  } catch {
    return memoryQueue;
  }
}

function saveQueue(events: AnalyticsEvent[]): void {
  const bounded = events.slice(-MAX_QUEUE_SIZE);
  memoryQueue = bounded;
  try {
    sessionStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(bounded));
  } catch {
    // The in-memory queue remains available when storage is blocked.
  }
}

function alreadySeen(key: string): boolean {
  if (memorySeen.has(key)) return true;

  try {
    const parsed = JSON.parse(sessionStorage.getItem(SEEN_STORAGE_KEY) ?? "[]") as unknown;
    const seen = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string").slice(-300)
      : [];
    if (seen.includes(key)) {
      memorySeen.add(key);
      return true;
    }
    seen.push(key);
    sessionStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(seen.slice(-300)));
    memorySeen.add(key);
    return false;
  } catch {
    memorySeen.add(key);
    return false;
  }
}

export function analyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const navigatorWithPrivacy = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const windowWithDnt = window as Window & { doNotTrack?: string };
  return !(
    navigatorWithPrivacy.globalPrivacyControl === true ||
    DO_NOT_TRACK_VALUES.has(navigator.doNotTrack ?? "") ||
    DO_NOT_TRACK_VALUES.has(navigatorWithPrivacy.msDoNotTrack ?? "") ||
    DO_NOT_TRACK_VALUES.has(windowWithDnt.doNotTrack ?? "")
  );
}

function eventBase(pagePath: TrackedPagePath) {
  return {
    id: uuidV4(),
    visitor_id: storedId(localStorage, VISITOR_STORAGE_KEY, "visitor"),
    session_id: storedId(sessionStorage, SESSION_STORAGE_KEY, "session"),
    page_path: pagePath,
  };
}

function scheduleFlush(delayMs = 1_200): void {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushAnalytics();
  }, delayMs);
}

function enqueue(event: AnalyticsEvent, immediate = false): void {
  if (!analyticsEnabled()) return;
  saveQueue([...queue(), event]);
  if (immediate) void flushAnalytics(true);
  else if (queue().length >= 10) void flushAnalytics();
  else scheduleFlush();
}

export async function flushAnalytics(keepalive = false): Promise<void> {
  if (!analyticsEnabled() || flushInFlight) return;
  const batch = queue().slice(0, MAX_ANALYTICS_BATCH_SIZE);
  if (batch.length === 0) return;

  flushInFlight = true;
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
      credentials: "same-origin",
      cache: "no-store",
      keepalive,
    });
    if (!response.ok) throw new Error(`analytics request failed: ${response.status}`);

    const sentIds = new Set(batch.map((event) => event.id));
    saveQueue(queue().filter((event) => !sentIds.has(event.id)));
    retryDelayMs = 1_000;
  } catch {
    retryDelayMs = Math.min(retryDelayMs * 2, 30_000);
  } finally {
    flushInFlight = false;
    if (queue().length > 0) scheduleFlush(retryDelayMs);
  }
}

export function trackPageView(pagePath: TrackedPagePath): void {
  enqueue({
    ...eventBase(pagePath),
    event_name: "page_view",
    section_key: null,
    download_target: null,
    scroll_depth: null,
  });
}

export function trackSectionView(pagePath: TrackedPagePath, sectionKey: string): void {
  if (alreadySeen(`section:${pagePath}:${sectionKey}`)) return;
  const event = normalizeAnalyticsEvent({
    ...eventBase(pagePath),
    event_name: "section_view",
    section_key: sectionKey,
  });
  if (event) enqueue(event);
}

export function trackScrollDepth(pagePath: TrackedPagePath, depth: ScrollDepth): void {
  if (alreadySeen(`scroll:${pagePath}:${depth}`)) return;
  enqueue({
    ...eventBase(pagePath),
    event_name: "scroll_depth",
    section_key: null,
    download_target: null,
    scroll_depth: depth,
  });
}

export function trackDownloadClick(pagePath: TrackedPagePath, target: DownloadTarget): void {
  const event = normalizeAnalyticsEvent({
    ...eventBase(pagePath),
    event_name: "download_click",
    download_target: target,
  });
  if (event) enqueue(event, true);
}
