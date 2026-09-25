import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

// The live plan catalog from the Propel Supabase project, so prices on the site
// always match what checkout charges. Pages that show it re-read it hourly.

export type PublicPlan = {
  key: string;
  name: string;
  kind: "free" | "subscription" | "prepaid_credit";
  /** Applications included each month; null when uncapped or not a monthly plan. */
  monthlyApplications: number | null;
  amountCents: number;
  currency: string;
  interval: string | null;
};

type Row = {
  plan_key: string; display_name: string; billing_kind: string; monthly_attempt_cap: number | null;
  amount_cents: number; currency: string | null; interval: string | null; byo_ai: boolean;
};

export type Catalog = {
  /** The free plan and the monthly subscriptions people pick between, cheapest first. */
  tiers: PublicPlan[];
  /** Pay-as-you-go extra applications, if offered. */
  extra: PublicPlan | null;
};

export async function getCatalog(): Promise<Catalog> {
  const url = `${supabaseUrl}/rest/v1/plans?active=eq.true&order=sort_order&select=plan_key,display_name,billing_kind,monthly_attempt_cap,amount_cents,currency,interval,byo_ai`;
  const response = await fetch(url, { headers: { apikey: supabasePublishableKey }, next: { revalidate: 3600 } });
  // A failed read fails the build (or keeps the last good page on revalidation)
  // rather than publishing prices that might be wrong.
  if (!response.ok) throw new Error(`plan catalog unavailable: ${response.status}`);
  const rows = (await response.json()) as Row[];
  const plans = rows.map((row) => ({
    key: row.plan_key,
    name: row.display_name,
    kind: row.billing_kind as PublicPlan["kind"],
    monthlyApplications: row.monthly_attempt_cap,
    amountCents: row.amount_cents,
    currency: row.currency ?? "usd",
    interval: row.interval,
    byoAi: row.byo_ai,
  }));
  return {
    // Bring-your-own-model plans are a developer option, not a public tier.
    tiers: plans.filter((plan) => (plan.kind === "free" || plan.kind === "subscription") && !plan.byoAi)
      .sort((a, b) => a.amountCents - b.amountCents),
    extra: plans.find((plan) => plan.kind === "prepaid_credit") ?? null,
  };
}

export function formatPrice(plan: Pick<PublicPlan, "amountCents" | "currency">): string {
  const amount = plan.amountCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** "Free plan includes 10 applications a month · paid plans from $19/mo", from the live catalog. */
export function pricingSummary(catalog: Catalog): string {
  const free = catalog.tiers.find((plan) => plan.kind === "free");
  const cheapest = catalog.tiers.find((plan) => plan.kind === "subscription");
  const parts = [
    free?.monthlyApplications ? `Free plan: ${free.monthlyApplications} applications a month` : null,
    cheapest ? `paid plans from ${formatPrice(cheapest)}/mo` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}
