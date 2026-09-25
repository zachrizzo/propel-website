// The account's plan and usage, as the get_entitlement RPC reports them, and the
// plan catalog. The shapes follow the Propel Supabase project.

export type Entitlement = {
  planKey: string;
  displayName: string;
  subscriptionStatus: string;
  /** null when the plan has no monthly cap. */
  includedAttempts: number | null;
  usedAttempts: number;
  remainingIncludedAttempts: number | null;
  extraCredits: number;
  canApply: boolean;
  currentPeriodEnd: string | null;
  hasStripeCustomer: boolean;
  hasSubscription: boolean;
};

export type Plan = {
  planKey: string;
  displayName: string;
  description: string;
  billingKind: "free" | "subscription" | "prepaid_credit" | string;
  monthlyAttemptCap: number | null;
  amountCents: number;
  currency: string;
  interval: string | null;
};

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
const text = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);
const count = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

export function toEntitlement(value: unknown): Entitlement {
  const rec = record(value);
  // An included count of -1 means uncapped.
  const included = count(rec.includedAttempts);
  return {
    planKey: text(rec.planKey, "free"),
    displayName: text(rec.displayName, "Free"),
    subscriptionStatus: text(rec.subscriptionStatus, "none"),
    includedAttempts: included === null || included < 0 ? null : included,
    usedAttempts: count(rec.usedAttempts) ?? 0,
    remainingIncludedAttempts: count(rec.remainingIncludedAttempts),
    extraCredits: count(rec.extraCredits) ?? 0,
    canApply: rec.canApply === true,
    currentPeriodEnd: text(rec.currentPeriodResetAt) || text(rec.currentPeriodEnd) || null,
    hasStripeCustomer: Boolean(text(rec.stripeCustomerId)),
    hasSubscription: Boolean(text(rec.stripeSubscriptionId)),
  };
}

export function toPlan(value: unknown): Plan {
  const rec = record(value);
  return {
    planKey: text(rec.plan_key),
    displayName: text(rec.display_name),
    description: text(rec.description),
    billingKind: text(rec.billing_kind, "subscription"),
    monthlyAttemptCap: count(rec.monthly_attempt_cap),
    amountCents: count(rec.amount_cents) ?? 0,
    currency: text(rec.currency, "usd"),
    interval: text(rec.interval) || null,
  };
}

export const PLAN_COLUMNS = "plan_key,display_name,description,billing_kind,monthly_attempt_cap,amount_cents,currency,interval,sort_order";

export function price(plan: Pick<Plan, "amountCents" | "currency">, quantity = 1): string {
  const amount = (plan.amountCents * quantity) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Active, trialing and past-due subscriptions are still subscriptions: plan changes go through the billing portal. */
export const LIVE_SUBSCRIPTION = new Set(["active", "trialing", "past_due"]);
