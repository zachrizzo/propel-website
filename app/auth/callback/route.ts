import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { site } from "@/lib/site";
import { safeNext } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Where Supabase sends people back after Google sign-in, an email confirmation or
// a password-reset link. A PKCE code (or an email token hash) becomes a session cookie.
/** The origin the person is on: the forwarded host behind Vercel, the Host header locally.
 *  Only this site, its Vercel previews and local hosts are trusted; anything else goes to the site. */
function siteOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const trusted = local || host === new URL(site.url).host || /^[a-z0-9-]+\.vercel\.app$/.test(host);
  if (!trusted) return site.url;
  return `${local ? "http" : "https"}://${host}`;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  // The upcoming Chrome-only extension exchanges its own PKCE code. Never exchange that code into
  // the website's cookie session or redirect it to another page. This uses the existing site callback
  // allowlist and Google provider; the extension checks the exact tab and one-time flow before exchange.
  if ((url.searchParams.get("next") === "/_propel_extension_auth" ||
      /^\/_propel_extension_auth\/[A-Za-z0-9_-]{16}$/.test(url.searchParams.get("next") ?? ""))) {
    return new NextResponse("<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Return to Propel</title><main><h1>Return to Propel</h1><p>Finish signing in from the Propel Chrome side panel. You can close this tab after Propel responds.</p></main></html>", {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  const origin = siteOrigin(request);
  const next = safeNext(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const supabase = await createClient();
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error(url.searchParams.get("error_description") ?? "missing_code") };
  if (error) {
    const retry = new URL("/login", origin);
    retry.searchParams.set("error", "callback");
    retry.searchParams.set("next", next);
    return NextResponse.redirect(retry);
  }
  return NextResponse.redirect(new URL(next, origin));
}
