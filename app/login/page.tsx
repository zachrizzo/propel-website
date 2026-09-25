import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/account/LoginForm";
import { AuthCard } from "@/components/account/ui";
import { safeNext } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Propel to manage your plan and connect the Propel extension.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string; mode?: string } }) {
  const next = safeNext(searchParams.next);
  const { data } = await createClient().auth.getUser();
  if (data.user) redirect(next);
  return (
    <AuthCard title="Sign in to Propel" subtitle="Manage your plan and connect the Propel extension.">
      <LoginForm next={next} initialMode={searchParams.mode === "signup" ? "signup" : "signin"} callbackError={searchParams.error ?? null} />
    </AuthCard>
  );
}
