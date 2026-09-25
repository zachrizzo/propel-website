import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { BuyExtraApplications, ChoosePlan, DeleteAccount, ManageBilling, SignOut } from "@/components/account/AccountActions";
import { Notice } from "@/components/account/ui";
import { LIVE_SUBSCRIPTION, PLAN_COLUMNS, price, toEntitlement, toPlan, type Entitlement, type Plan } from "@/lib/account";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your Propel plan, usage and billing.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" },
  trialing: { label: "Trial", className: "border-iris-400/30 bg-iris-500/10 text-iris-300" },
  past_due: { label: "Payment due", className: "border-amber-400/35 bg-amber-500/10 text-amber-300" },
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  // Billing periods start and end at midnight UTC.
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
}

/** A catalog description that only restates the monthly cap adds nothing to the cap line. */
function extraDescription(plan: Plan): string | null {
  return plan.description && !/attempts per month/i.test(plan.description) ? plan.description : null;
}

function capText(plan: Plan): string {
  return plan.monthlyAttemptCap === null ? "Uncapped applications" : `${plan.monthlyAttemptCap} applications a month`;
}

function Usage({ entitlement }: { entitlement: Entitlement }) {
  const resets = formatDate(entitlement.currentPeriodEnd);
  if (entitlement.includedAttempts === null) {
    return <p className="mt-5 text-[15px] text-mist">Uncapped applications on this plan.</p>;
  }
  const used = Math.min(entitlement.usedAttempts, entitlement.includedAttempts);
  const percent = entitlement.includedAttempts ? Math.round((used / entitlement.includedAttempts) * 100) : 100;
  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between gap-4 text-[14px]">
        <span className="text-cream">
          <strong className="font-display text-[22px] font-bold">{entitlement.usedAttempts}</strong>
          <span className="text-mist"> of {entitlement.includedAttempts} applications used</span>
        </span>
        {resets ? <span className="text-[13px] text-fog">Resets {resets}</span> : null}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-600" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={entitlement.includedAttempts} aria-label="Applications used this period">
        <div className={`h-full rounded-full ${percent >= 100 ? "bg-amber-400" : "bg-gradient-to-r from-iris-600 to-iris-400"}`} style={{ width: `${percent}%` }} />
      </div>
      {entitlement.extraCredits > 0 ? (
        <p className="mt-3 text-[13.5px] text-mist">
          Plus <strong className="text-cream">{entitlement.extraCredits}</strong> extra {entitlement.extraCredits === 1 ? "application" : "applications"} for when these run out.
        </p>
      ) : null}
      {!entitlement.canApply ? (
        <div className="mt-4">
          <Notice tone="info">You&rsquo;ve used this period&rsquo;s applications. Upgrade or buy extra applications to keep going.</Notice>
        </div>
      ) : null}
    </div>
  );
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/account");

  const [entitlementResult, plansResult] = await Promise.all([
    supabase.rpc("get_entitlement"),
    supabase.from("plans").select(PLAN_COLUMNS).eq("active", true).order("sort_order"),
  ]);
  const entitlement = entitlementResult.error ? null : toEntitlement(entitlementResult.data);
  const plans = (plansResult.data ?? []).map(toPlan);
  const subscriptionPlans = plans.filter((plan) => plan.billingKind === "subscription");
  const extraPlan = plans.find((plan) => plan.billingKind === "prepaid_credit");
  // A live subscription changes plan in the Stripe portal, so nobody ends up paying for two.
  const subscribed = Boolean(entitlement && entitlement.hasSubscription && LIVE_SUBSCRIPTION.has(entitlement.subscriptionStatus));
  const status = STATUS[entitlement?.subscriptionStatus ?? "none"];

  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-20 pt-8">
      <header className="flex items-center justify-between gap-4">
        <a href="/" aria-label="Propel home"><Logo /></a>
        <div className="flex items-center gap-4">
          <span className="hidden max-w-[240px] truncate text-[13.5px] text-mist sm:inline">{auth.user.email}</span>
          <SignOut />
        </div>
      </header>

      <p className="mt-14 font-mono text-[12px] uppercase tracking-[0.18em] text-iris-400">Account</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream">Your plan</h1>

      {query.password === "updated" ? <div className="mt-6"><Notice tone="success">Your password was updated.</Notice></div> : null}

      <section className="ring-grad glass mt-8 rounded-3xl p-6 sm:p-8">
        {entitlement ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold text-cream">{entitlement.displayName}</h2>
                {status ? <span className={`rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${status.className}`}>{status.label}</span> : null}
              </div>
              {entitlement.hasStripeCustomer ? <ManageBilling /> : null}
            </div>
            <Usage entitlement={entitlement} />
          </>
        ) : (
          <Notice tone="error">We couldn&rsquo;t load your plan just now. Refresh the page, or email {site.email} if it keeps happening.</Notice>
        )}
      </section>

      {subscriptionPlans.length ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-cream">{subscribed ? "Change plan" : "Upgrade"}</h2>
          <p className="mt-1.5 text-[14px] text-mist">
            An application counts only when Propel reaches its final submit. Skipped and mismatched jobs are free.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const current = plan.planKey === entitlement?.planKey;
              return (
                <div key={plan.planKey} className={`flex flex-col rounded-2xl border p-5 ${current ? "border-iris-400/50 bg-iris-500/10" : "border-iris-400/15 bg-ink-800/70"}`}>
                  <h3 className="font-display text-[17px] font-semibold text-cream">{plan.displayName}</h3>
                  <p className="mt-2 text-cream">
                    <span className="font-display text-3xl font-bold">{price(plan)}</span>
                    {plan.interval ? <span className="text-[14px] text-fog"> / {plan.interval}</span> : null}
                  </p>
                  <p className="mt-2 text-[13.5px] font-medium text-iris-300">{capText(plan)}</p>
                  {extraDescription(plan) ? <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-fog">{extraDescription(plan)}</p> : <div className="flex-1" />}
                  <div className="mt-5">
                    <ChoosePlan planKey={plan.planKey} name={plan.displayName} current={current} viaPortal={subscribed} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {extraPlan ? (
        <section className="mt-12 flex flex-col gap-5 rounded-2xl border border-iris-400/15 bg-ink-800/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-cream">Extra applications</h2>
            <p className="mt-1 text-[14px] text-mist">
              {price(extraPlan)} each, used after your plan&rsquo;s applications run out.
            </p>
          </div>
          <BuyExtraApplications planKey={extraPlan.planKey} amountCents={extraPlan.amountCents} currency={extraPlan.currency} />
        </section>
      ) : null}

      <section className="mt-16 rounded-2xl border border-rose-400/15 bg-rose-500/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold text-cream">Delete your account</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-mist">
          This cancels your subscription immediately and permanently deletes your profile, saved answers and application
          history from your Propel account. It can&rsquo;t be undone. Files on your Mac stay until you uninstall Propel.
        </p>
        <DeleteAccount />
      </section>

      <p className="mt-12 text-[13px] text-fog">
        Questions about billing? Email <a className="text-iris-300 underline-offset-4 hover:underline" href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </main>
  );
}
