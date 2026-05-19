import Link from "next/link";
import { FileText, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions — SobarbazarBD",
  description: "Read SobarbazarBD terms and conditions of service.",
};

const Section = ({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) => (
  <div id={id} className="mb-10 scroll-mt-24">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{num}</span>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

export default function TermsConditionsPage() {
  return (
    <div className="container mt-4 md:mt-8">
      <nav className="mb-4 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">Terms & Conditions</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-white p-5">
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              {[
                { label: "Acceptance of Terms", id: "acceptance" },
                { label: "User Accounts", id: "accounts" },
                { label: "Products & Ordering", id: "products" },
                { label: "Payment & Pricing", id: "payment" },
                { label: "Shipping & Delivery", id: "shipping" },
                { label: "Intellectual Property", id: "ip" },
                { label: "Prohibited Activities", id: "prohibited" },
                { label: "Limitation of Liability", id: "liability" },
                { label: "Contact Us", id: "contact" },
              ].map((i) => (
                <li key={i.id}><a href={`#${i.id}`} className="hover:text-primary">{i.label}</a></li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="rounded-xl border bg-white p-6 md:p-8">
          <div className="mb-8 flex items-center gap-4 border-b pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Terms & Conditions</h1>
              <p className="mt-0.5 text-sm text-neutral-500">Last updated: January 2025</p>
            </div>
          </div>

          <p className="mb-8 text-sm leading-7 text-neutral-700">
            Welcome to SobarbazarBD. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchases.
          </p>

          <Section id="acceptance" num="1" title="Acceptance of Terms">
            <p className="text-sm leading-7 text-neutral-700">
              By accessing and using SobarbazarBD, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the website constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section id="accounts" num="2" title="User Accounts">
            <p className="mb-3 text-sm text-neutral-700">When creating an account on SobarbazarBD, you agree to:</p>
            <ul className="space-y-2">
              {["Provide accurate, current, and complete information.", "Maintain the security of your password and account.", "Be responsible for all activities under your account.", "Notify us immediately of any unauthorized use.", "Not create accounts for fraudulent purposes."].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="products" num="3" title="Products & Ordering">
            <div className="space-y-3 text-sm leading-7 text-neutral-700">
              <p>All products listed on SobarbazarBD are subject to availability. We reserve the right to limit quantities and to discontinue products at any time.</p>
              <p>Product images are for illustrative purposes only. Actual products may vary slightly from images shown. We strive to display colors accurately, but cannot guarantee your display will be accurate.</p>
              <p>By placing an order, you confirm that you are of legal age and authorized to make purchases.</p>
            </div>
          </Section>

          <Section id="payment" num="4" title="Payment & Pricing">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Pricing", desc: "All prices are in BDT (Bangladeshi Taka). Prices may change without prior notice." },
                { title: "Payment Methods", desc: "We accept Cash on Delivery, bKash, Nagad, Rocket, and card payments via SSLCommerz." },
                { title: "Order Confirmation", desc: "An order is confirmed only after successful payment or COD acceptance." },
                { title: "Price Errors", desc: "We reserve the right to cancel orders placed at incorrect prices due to system errors." },
              ].map((c) => (
                <div key={c.title} className="rounded-lg bg-neutral-50 p-4">
                  <h5 className="text-sm font-semibold">{c.title}</h5>
                  <p className="mt-1 text-xs text-neutral-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="shipping" num="5" title="Shipping & Delivery">
            <p className="mb-3 text-sm text-neutral-700">Our shipping terms:</p>
            <ul className="space-y-2">
              {["Delivery within Dhaka: 1–2 business days (৳60, free over ৳1000).", "Delivery outside Dhaka: 2–4 business days (৳120).", "Delivery times are estimates and may vary due to circumstances beyond our control.", "We are not responsible for delays caused by courier services.", "Risk of loss passes to you upon delivery."].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="ip" num="6" title="Intellectual Property">
            <p className="text-sm leading-7 text-neutral-700">
              All content on SobarbazarBD, including but not limited to text, graphics, logos, images, and software, is the property of SobarbazarBD or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </Section>

          <Section id="prohibited" num="7" title="Prohibited Activities">
            <p className="mb-3 text-sm text-neutral-700">You agree not to engage in any of the following activities:</p>
            <ul className="space-y-2">
              {["Using the service for any illegal purpose.", "Attempting to gain unauthorized access to any part of the website.", "Transmitting viruses or any malicious code.", "Collecting user information without consent.", "Engaging in fraudulent transactions.", "Interfering with the security features of the website."].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="liability" num="8" title="Limitation of Liability">
            <div className="rounded-lg bg-amber-50 p-5">
              <p className="text-sm leading-7 text-neutral-700">
                SobarbazarBD shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use our services. Our liability is limited to the purchase price of the products involved. We make no warranties, express or implied, regarding the accuracy or completeness of information on our website.
              </p>
            </div>
          </Section>

          <Section id="contact" num="9" title="Contact Us">
            <p className="mb-4 text-sm text-neutral-700">For questions about these Terms & Conditions:</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
                Contact Support
              </Link>
              <a href="mailto:support24@sobarbazarbd.com" className="inline-flex items-center rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5">
                Email Us
              </a>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
