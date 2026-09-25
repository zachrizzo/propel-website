import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "./config";

/** A Supabase client for client components, sharing the session cookie with the server. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
