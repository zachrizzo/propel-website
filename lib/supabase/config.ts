// The Propel Supabase project: the same accounts, plans and billing the Propel
// apps use. Neither value is a secret. The publishable key is meant to ship in
// clients; row-level security limits it to what the signed-in user may see.
export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://jhezakjoyxzfcamwqmqz.supabase.co";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_D7jWMD7gIYooMMboKU-j6g_gFKt4E2s";

/** Where to go after signing in: a path on this site only, never another origin. */
export function safeNext(value: string | null | undefined, fallback = "/account"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
