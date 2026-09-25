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

/** Must match DELETE_CONFIRMATION in the delete-account edge function. */
const DELETE_PHRASE = "delete my account";

export function DeleteAccount() {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmed = typed.trim().toLowerCase() === DELETE_PHRASE;

  async function remove() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: failure } = await supabase.functions.invoke("delete-account", { body: { confirm: DELETE_PHRASE } });
    if (failure) {
      setError("Your account couldn't be deleted just now. Nothing was removed; please try again or email us.");
      setBusy(false);
      return;
    }
    // The session belonged to the deleted user; clear it from this browser.
    await supabase.auth.signOut({ scope: "local" });
    window.location.assign("/account/deleted");
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-mist">
          Type <span className="font-mono text-cream">{DELETE_PHRASE}</span> to confirm
        </span>
        <input
          className="h-11 w-full max-w-sm rounded-xl border border-rose-400/25 bg-ink/60 px-3.5 text-[15px] text-cream outline-none transition focus:border-rose-400/60 focus:ring-4 focus:ring-rose-500/10"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <button
        type="button"
        disabled={!confirmed || busy}
        onClick={remove}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/10 px-5 text-[14px] font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Deleting…" : "Delete my account"}
      </button>
      {error ? <p role="alert" className="text-[13px] text-rose-300">{error}</p> : null}
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
