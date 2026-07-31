import "server-only";

// These are the same project URL and browser-safe publishable key embedded in
// the Propel desktop app. They are identifiers, not privileged credentials.
// Server environment variables allow rotation without a source change.
const DEFAULT_SUPABASE_URL = "https://jhezakjoyxzfcamwqmqz.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_D7jWMD7gIYooMMboKU-j6g_gFKt4E2s";

export function websiteSupabaseConfig(): { url: string; publishableKey: string } {
  return {
    url: (process.env.PROPEL_SUPABASE_URL ?? DEFAULT_SUPABASE_URL).replace(/\/+$/, ""),
    publishableKey:
      process.env.PROPEL_SUPABASE_PUBLISHABLE_KEY ??
      process.env.PROPEL_SUPABASE_ANON_KEY ??
      DEFAULT_SUPABASE_PUBLISHABLE_KEY,
  };
}
