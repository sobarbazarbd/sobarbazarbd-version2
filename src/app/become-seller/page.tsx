import Link from "next/link";
import { BadgeCheck, Banknote, Check, ClipboardCheck, HelpCircle, PackagePlus, ShieldCheck, Store, TrendingUp, UserPlus, Wallet } from "lucide-react";

export const metadata = {
  title: "Become a Seller - SobarbazarBD",
  description: "Join SobarbazarBD as a supplier and grow your business.",
};

const steps = [
  { icon: UserPlus, step: "01", title: "Create Account", desc: "Sign up as a supplier and complete your store profile with your business details." },
  { icon: PackagePlus, step: "02", title: "Add Products", desc: "Upload product photos, descriptions, pricing, and stock levels." },
  { icon: ClipboardCheck, step: "03", title: "Get Approved", desc: "Our admin team reviews your products before they go live." },
  { icon: Banknote, step: "04", title: "Start Earning", desc: "Customers place orders, you fulfil them, and receive payment directly." },
];

const benefits = [
  "Access to thousands of active buyers across Bangladesh",
  "Easy-to-use supplier dashboard to manage products and orders",
  "Real-time stock management and order notifications",
  "Secure payment processing and fast payouts",
  "Dedicated support team to help you grow",
  "Promotional opportunities through flash sales and featured listings",
];

const requirements = [
  "Valid NID or trade license",
  "Active bank account or mobile banking (bKash / Nagad)",
  "Product photos, minimum 1 per product",
  "Commitment to fulfil orders within agreed timeframe",
];

const faqs = [
  { q: "Is there a fee to join?", a: "Registration is free. Commission is applied only on successful sales." },
  { q: "How long does approval take?", a: "Product approval usually takes 1-2 business days after submission." },
  { q: "When do I get paid?", a: "Payouts are processed after order delivery is confirmed by the customer." },
  { q: "Can I sell in multiple categories?", a: "Yes, you can list products across any approved category for your store." },
];

export default function BecomeSellerPage() {
  return (
    <div className="container mt-3">
      <section className="overflow-hidden rounded-lg border bg-white">
        <div className="grid gap-6 bg-[#08766f] p-6 text-white lg:grid-cols-[1fr_380px] lg:p-10">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase text-[#ffd27a]">
              Join Our Marketplace
            </span>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              Start Selling on SobarbazarBD
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
              Reach thousands of customers across Bangladesh. Set up your store in minutes and start earning today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/account" className="inline-flex items-center gap-2 rounded-full bg-[#FF9F29] px-6 py-3 text-sm font-black text-white shadow-sm hover:bg-[#f59e0b]">
                <Store className="h-4 w-4" />
                Register as Seller/Store Owner
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                Talk to Support
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg bg-white/10 p-4">
            {[
              { icon: TrendingUp, label: "Grow faster", value: "Nationwide buyers" },
              { icon: Wallet, label: "Fast payouts", value: "Secure settlement" },
              { icon: ShieldCheck, label: "Seller support", value: "Protected selling" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-md bg-white p-3 text-[#12352f]">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#effaf4] text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-black">{item.label}</span>
                  <span className="text-xs text-neutral-500">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-3 grid gap-2 bg-white p-3 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((item) => (
          <div key={item.step} className="rounded-lg border bg-white p-5 text-center shadow-sm">
            <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#effaf4] text-primary">
              <item.icon className="h-7 w-7" />
              <span className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-black text-white">
                {item.step}
              </span>
            </span>
            <h3 className="mt-4 text-sm font-black text-neutral-900">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-neutral-600">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border bg-[#effaf4] p-6">
          <h2 className="text-xl font-black text-neutral-900">Why Sell With Us?</h2>
          <div className="mt-5 grid gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-black text-neutral-900">Requirements</h2>
          <div className="mt-5 grid gap-3">
            {requirements.map((req) => (
              <div key={req} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-50 text-[#FF9F29]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </span>
                {req}
              </div>
            ))}
          </div>
          <Link href="/signup" className="mt-6 flex w-full items-center justify-center rounded-full bg-[#FF9F29] px-5 py-3 text-sm font-black text-white hover:bg-[#f59e0b]">
            Apply Now
          </Link>
        </div>
      </section>

      <section className="mt-3 rounded-lg border bg-white p-6">
        <div className="mb-5 text-center">
          <h2 className="text-xl font-black text-neutral-900">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-neutral-900">
                <HelpCircle className="h-4 w-4 text-primary" />
                {item.q}
              </h3>
              <p className="mt-2 text-xs leading-5 text-neutral-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
