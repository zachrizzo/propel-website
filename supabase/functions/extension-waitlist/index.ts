declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const SITE_ORIGINS = new Set(["https://propeljobagent.com", "https://www.propeljobagent.com"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

function response(origin: string | null, status: number, code: string): Response {
  return new Response(status === 204 ? null : JSON.stringify({ code }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Vary": "Origin",
      ...(origin && SITE_ORIGINS.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "apikey, content-type",
    },
  });
}

function clientAddress(req: Request): string | null {
  // The gateway supplies the address. Never accept one from the JSON payload.
  const value = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return value && value.length <= 64 && /^[0-9a-fA-F:.]+$/u.test(value) ? value : null;
}

async function digest(address: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(address)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function handleWaitlist(req: Request, env = Deno.env, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const origin = req.headers.get("Origin");
  if (!origin || !SITE_ORIGINS.has(origin)) return response(null, 403, "origin_refused");
  if (req.method === "OPTIONS") return response(origin, 204, "ok");
  if (req.method !== "POST") return response(origin, 405, "method_not_allowed");
  if (!req.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return response(origin, 415, "invalid_request");
  }
  if (Number(req.headers.get("Content-Length") ?? 0) > 512) return response(origin, 413, "invalid_request");
  const address = clientAddress(req);
  if (!address) return response(origin, 503, "waitlist_unavailable");

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 512) return response(origin, 413, "invalid_request");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw Error("invalid_body");
    body = parsed as Record<string, unknown>;
  } catch { return response(origin, 400, "invalid_request"); }

  // A non-visible field discourages generic form bots without sending mail or creating an account.
  if (body.website !== "" || typeof body.email !== "string") return response(origin, 400, "invalid_request");
  const email = body.email.trim().toLowerCase();
  if (email.length < 3 || email.length > 254 || !EMAIL.test(email)) return response(origin, 400, "invalid_email");

  const url = env.get("SUPABASE_URL"), key = env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return response(origin, 503, "waitlist_unavailable");
  try {
    const result = await fetchImpl(`${url}/rest/v1/rpc/join_extension_waitlist`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_email: email, p_rate_key: await digest(address, key) }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!result.ok) return response(origin, 503, "waitlist_unavailable");
    const code: unknown = await result.json();
    if (code === "joined") return response(origin, 201, "joined");
    if (code === "already_joined") return response(origin, 200, "already_joined");
    if (code === "rate_limited") return response(origin, 429, "rate_limited");
    return response(origin, 503, "waitlist_unavailable");
  } catch { return response(origin, 503, "waitlist_unavailable"); }
}

Deno.serve(req => handleWaitlist(req));
