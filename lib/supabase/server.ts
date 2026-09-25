import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "./config";

/** A Supabase client for server components, route handlers and server actions, signed in by cookie. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // A server component cannot set cookies. The middleware refreshes the session instead.
        }
      },
    },
  });
}
