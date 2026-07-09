"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, endpoints } from "@/lib/api";

const PLANS = [
  {
    value: "annual",
    title: "Annual Registration",
    price: "৳5,000 / year",
    desc: "One-time yearly fee, keep 100% of your sales revenue.",
  },
  {
    value: "commission",
    title: "Commission-Based",
    price: "5% + Delivery",
    desc: "No upfront fee — pay a 5% commission per successful sale.",
  },
];

const initialForm = {
  name: "",
  contact_email: "",
  phone_number: "",
  city: "",
  address: "",
  store_type: "Enterprise",
  founder: "",
  description: "",
  website_url: "",
  username: "",
  password: "",
  confirm_password: "",
};

export default function SellerRegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof typeof initialForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirm_password) return toast.error("Passwords don't match");
    if (!plan) return toast.error("Please select a payment plan");

    setSubmitting(true);
    try {
      const payload: Record<string, string> = { ...form, payment_plan: plan };
      delete payload.confirm_password;
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
      });

      const res = await fetch(`${API_BASE}${endpoints.storeRegister}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(true);
        toast.success("Store registered successfully!");
      } else {
        const fieldErrors = data.message && typeof data.message === "object" ? data.message : data;
        const firstError = Object.values(fieldErrors)
          .flat()
          .find((v) => typeof v === "string");
        toast.error((firstError as string) || "Registration failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mt-8 max-w-lg pb-16">
        <Card>
          <CardContent className="p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#effaf4] text-primary">
              <Check className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-xl font-black">Registration Submitted!</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Your store has been registered and is pending admin approval. Your login credentials
              have been emailed to you. Once approved, sign in to the vendor dashboard to start selling.
            </p>
            <a
              href="https://vendor.sobarbazarbd.com/login"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90"
            >
              <Store className="h-4 w-4" />
              Go to Vendor Dashboard
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mt-4 max-w-2xl pb-16 md:mt-8">
      <nav className="mb-3 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/become-seller" className="hover:text-primary">Become a Seller</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">Register</span>
      </nav>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Register Your Store</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Fill in your business details — our team will review and approve your store.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            {/* Store info */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Store Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInput label="Store name *" value={form.name} onChange={set("name")} required />
                <div>
                  <label className="mb-1 block text-sm font-medium">Store type</label>
                  <select
                    value={form.store_type}
                    onChange={set("store_type")}
                    className="h-10 w-full rounded-md border bg-white px-3 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <LabeledInput label="Contact email *" type="email" value={form.contact_email} onChange={set("contact_email")} required />
                <LabeledInput label="Phone number *" type="tel" value={form.phone_number} onChange={set("phone_number")} required />
                <LabeledInput label="City *" value={form.city} onChange={set("city")} required />
                <LabeledInput label="Address" value={form.address} onChange={set("address")} />
                <LabeledInput label="Founder / Owner name" value={form.founder} onChange={set("founder")} />
                <LabeledInput label="Website URL" type="url" value={form.website_url} onChange={set("website_url")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Store description</label>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  className="w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="What do you sell?"
                />
              </div>
            </section>

            {/* Login credentials */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Login Credentials</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInput label="Username *" value={form.username} onChange={set("username")} required />
                <span className="hidden sm:block" />
                <LabeledInput label="Password *" type="password" value={form.password} onChange={set("password")} required />
                <LabeledInput label="Confirm password *" type="password" value={form.confirm_password} onChange={set("confirm_password")} required />
              </div>
            </section>

            {/* Payment plan */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Payment Plan *</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {PLANS.map((p) => {
                  const isActive = plan === p.value;
                  return (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setPlan(p.value)}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${isActive ? "border-primary bg-[#effaf4]" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-sm font-black">{p.title}</span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${isActive ? "border-primary bg-primary text-white" : "border-neutral-300"}`}>
                          {isActive && <Check className="h-3 w-3" />}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm font-bold text-primary">{p.price}</span>
                      <span className="mt-1 block text-xs text-neutral-600">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Register Store"
              )}
            </Button>

            <p className="text-center text-[11px] text-neutral-500">
              By registering, you agree to our{" "}
              <Link href="/terms-conditions" className="text-primary hover:underline">Terms</Link>{" "}
              &{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LabeledInput({
  label, value, onChange, type = "text", required = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <Input type={type} value={value} onChange={onChange} required={required} />
    </div>
  );
}
