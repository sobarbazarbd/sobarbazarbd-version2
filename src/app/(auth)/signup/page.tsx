"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function SignupPage() {
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    setSubmitting(true);
    await register({
      username: form.username,
      email: form.email,
      password: form.password,
      re_password: form.confirm,
    });
    setSubmitting(false);
  };

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign up and start shopping in minutes</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field icon={<User className="h-4 w-4" />} placeholder="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
          <Field icon={<Mail className="h-4 w-4" />} placeholder="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field icon={<Lock className="h-4 w-4" />} placeholder="Password (min 8 chars)" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <Field icon={<Lock className="h-4 w-4" />} placeholder="Confirm password" type="password" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} />

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-[11px] text-neutral-500">
            By signing up, you agree to our{" "}
            <Link href="/terms-conditions" className="text-primary hover:underline">Terms</Link>{" "}
            &{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function Field({
  icon, placeholder, value, onChange, type = "text",
}: { icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
        required
      />
    </div>
  );
}
