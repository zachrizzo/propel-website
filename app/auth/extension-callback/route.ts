import { NextResponse } from "next/server";

// The Propel Chrome extension owns this PKCE flow. Keep the code in this tab
// until the extension's background worker exchanges it; never make a site cookie.
export function GET() {
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
