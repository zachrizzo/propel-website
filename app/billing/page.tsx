import { redirect } from "next/navigation";

// The Stripe billing portal returns here. Plans and billing live on the account page.
export default function BillingReturn() {
  redirect("/account");
}
