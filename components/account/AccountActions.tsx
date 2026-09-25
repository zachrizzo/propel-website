"use client";

import { useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { price } from "@/lib/account";
import { createClient } from "@/lib/supabase/browser";
import { primaryButton, secondaryButton } from "./ui";

// Checkout and the billing portal are Stripe pages made by the Propel Supabase
// functions; the signed-in session authorizes the call.

async function openStripe(fn: "create-checkout-session" | "create-portal-session", body: Record<string, unknown>) {
  const { data, error } = await createClient().functions.invoke(fn, { body });
  if (error) {
    const detail = error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null;
    throw new Error(typeof detail?.error === "string" ? detail.error : "Stripe didn't open. Please try again.");
  }
  if (typeof data?.url !== "string") throw new Error("Stripe didn't open. Please try again.");
  window.location.assign(data.url);
}

function useStripe() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: Parameters<typeof openStripe>[0], body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await openStripe(fn, body);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };
  return { busy, error, run };
}

const ErrorLine = ({ error }: { error: string | null }) =>
  error ? <p role="alert" className="mt-2 text-[12.5px] text-rose-300">{error}</p> : null;

export function ManageBilling() {
  const { busy, error, run } = useStripe();
  return (
    <div>
      <button type="button" className={secondaryButton} disabled={busy} onClick={() => run("create-portal-session", {})}>
        {busy ? "Opening…" : "Manage billing"}
      </button>
      <ErrorLine error={error} />
    </div>
  );
}

export function ChoosePlan({ planKey, name, current, viaPortal }: { planKey: string; name: string; current: boolean; viaPortal: boolean }) {
  const { busy, error, run } = useStripe();
  if (current) {
    return <button type="button" disabled className={`${secondaryButton} w-full`}>Current plan</button>;
  }
  return (
    <div>
      <button
        type="button"
        className={`${viaPortal ? secondaryButton : primaryButton} w-full`}
        disabled={busy}
        onClick={() => (viaPortal ? run("create-portal-session", {}) : run("create-checkout-session", { planKey, quantity: 1 }))}
      >
        {busy ? "Opening…" : viaPortal ? `Switch to ${name}` : `Choose ${name}`}
      </button>
      <ErrorLine error={error} />
    </div>
  );
}

export function BuyExtraApplications({ planKey, amountCents, currency }: { planKey: string; amountCents: number; currency: string }) {
  const { busy, error, run } = useStripe();
  const [quantity, setQuantity] = useState(10);
  const set = (value: number) => setQuantity(Math.max(1, Math.min(500, Math.floor(value) || 1)));
  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex items-center gap-3">
        <div className="flex h-11 items-center rounded-xl border border-iris-400/20 bg-ink/60">
          <button type="button" aria-label="Fewer" className="h-full w-10 text-lg text-iris-300 hover:text-cream" onClick={() => set(quantity - 1)}>−</button>
          <input aria-label="Extra applications" inputMode="numeric" className="h-full w-12 bg-transparent text-center text-[15px] text-cream outline-none" value={quantity} onChange={(e) => set(Number(e.target.value))} />
          <button type="button" aria-label="More" className="h-full w-10 text-lg text-iris-300 hover:text-cream" onClick={() => set(quantity + 1)}>+</button>
        </div>
        <button type="button" className={primaryButton} disabled={busy} onClick={() => run("create-checkout-session", { planKey, quantity })}>
          {busy ? "Opening…" : `Buy for ${price({ amountCents, currency }, quantity)}`}
        </button>
      </div>
      <ErrorLine error={error} />
    </div>
  );
}

export function SignOut() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className="text-[13.5px] font-semibold text-iris-300 transition hover:text-cream disabled:opacity-50"
      onClick={async () => {
        setBusy(true);
        await createClient().auth.signOut();
        window.location.assign("/login");
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
