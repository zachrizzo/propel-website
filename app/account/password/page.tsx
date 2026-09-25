import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PasswordForm from "@/components/account/PasswordForm";
import { AuthCard } from "@/components/account/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function PasswordPage() {
  const { data } = await (await createClient()).auth.getUser();
  if (!data.user) redirect("/login?next=/account/password");
  return (
    <AuthCard title="Choose a new password" subtitle={`For ${data.user.email ?? "your account"}.`}>
      <PasswordForm />
    </AuthCard>
  );
}
