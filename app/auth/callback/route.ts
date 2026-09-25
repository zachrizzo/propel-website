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
