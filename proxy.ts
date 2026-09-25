import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

// Keeps the Supabase session fresh on the pages that use it. Marketing pages are
// left out so they stay static. (Next.js 16 calls this file proxy; it was middleware.)
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });
  // Refreshes an expiring session; the new tokens reach the browser through setAll.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/account/:path*", "/login", "/auth/:path*", "/billing/:path*"],
};
