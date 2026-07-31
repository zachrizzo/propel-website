import type { NextRequest } from "next/server";
import {
  MAX_ANALYTICS_BATCH_SIZE,
  normalizeAnalyticsEvent,
  type AnalyticsEvent,
} from "@/lib/analytics-events";
import { websiteSupabaseConfig } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 32_768;

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const requestHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
    ?.split(",", 1)[0]
    .trim();
  if (!origin || !requestHost) return false;

  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

function parseBatch(value: unknown): AnalyticsEvent[] | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const events = (value as { events?: unknown }).events;
  if (!Array.isArray(events) || events.length > MAX_ANALYTICS_BATCH_SIZE) return null;

  const normalized = events.map(normalizeAnalyticsEvent);
  if (normalized.some((event) => event === null)) return null;

  const valid = normalized as AnalyticsEvent[];
  if (new Set(valid.map((event) => event.id)).size !== valid.length) return null;
  return valid;
}

async function isDuplicate(response: Response): Promise<boolean> {
  if (response.status !== 409) return false;
  try {
    const body = (await response.json()) as { code?: unknown };
    return body.code === "23505";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: "origin_not_allowed" }, { status: 403 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return Response.json({ error: "request_too_large" }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) {
    return Response.json({ error: "request_too_large" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const events = parseBatch(parsed);
  if (!events) {
    return Response.json({ error: "invalid_events" }, { status: 400 });
  }
  if (events.length === 0) return new Response(null, { status: 204 });

  const { url, publishableKey } = websiteSupabaseConfig();
  const insert = (batch: AnalyticsEvent[]) => fetch(`${url}/rest/v1/website_analytics_events`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(batch),
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });

  try {
    const upstream = await insert(events);
    if (upstream.ok) return new Response(null, { status: 204 });

    // A request may have reached Supabase even if the browser never received
    // its response. On that rare retry, recover from a duplicate in the batch
    // by inserting events individually and treating only primary-key conflicts
    // as already delivered. This preserves idempotency without granting anon
    // SELECT access, which PostgREST upserts would otherwise require.
    if (await isDuplicate(upstream)) {
      const retries = await Promise.all(events.map((event) => insert([event])));
      const accepted = await Promise.all(
        retries.map(async (response) => response.ok || isDuplicate(response)),
      );
      if (accepted.every(Boolean)) return new Response(null, { status: 204 });
    }
  } catch {
    return Response.json({ error: "analytics_unavailable" }, { status: 503 });
  }

  // Do not include the upstream response body: it can contain implementation
  // details and is not useful to the fire-and-forget browser client.
  return Response.json({ error: "analytics_unavailable" }, { status: 503 });
}
