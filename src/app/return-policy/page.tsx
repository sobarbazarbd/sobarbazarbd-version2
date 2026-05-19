import Link from "next/link";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy — SobarbazarBD",
  description: "Read SobarbazarBD return and refund policy. Learn how to return products and get your refund.",
};

const Section = ({ id, num, title, numColor = "bg-primary", children }: { id: string; num: string; title: string; numColor?: string; children: React.ReactNode }) => (
  <div id={id} className="mb-10 scroll-mt-24">
    <div className="mb-4 flex items-center gap-3">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${numColor} text-sm font-bold text-white`}>{num}</span>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

export default function ReturnPolicyPage() {
  return (
    <div className="container mt-4 md:mt-8">
      <nav className="mb-4 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">Return Policy</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-white p-5">
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              {[
                { label: "Return Eligibility", id: "eligibility" },
                { label: "Return Process", id: "process" },
                { label: "Refund Policy", id: "refund" },
                { label: "Exchange Policy", id: "exchange" },
                { label: "Non-Returnable Items", id: "non-returnable" },
                { label: "Damaged Products", id: "damaged" },
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
              <RefreshCw className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Return & Refund Policy</h1>
              <p className="mt-0.5 text-sm text-neutral-500">Last updated: January 2025</p>
            </div>
          </div>

          <p className="mb-8 text-sm leading-7 text-neutral-700">
            At SobarbazarBD, we want you to be completely satisfied with your purchase. If you are not happy with your order, we are here to help. Please read our return and refund policy carefully.
          </p>

          <Section id="eligibility" num="1" title="Return Eligibility">
            <p className="mb-3 text-sm text-neutral-700">You may return most items within <strong>7 days</strong> of delivery. To be eligible:</p>
            <ul className="space-y-2">
              {["The item must be unused and in the same condition as received.", "The item must be in its original packaging.", "You must have the order ID or proof of purchase.", "The return request must be made within 7 days of delivery."].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="process" num="2" title="Return Process">
            <p className="mb-3 text-sm text-neutral-700">Follow these steps to return a product:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { step: "Step 1", title: "Submit Request", desc: "Log in to your account, go to Orders, and click \"Return\" on the item.", icon: "📋" },
                { step: "Step 2", title: "Wait for Approval", desc: "Our team reviews your request within 24–48 hours and notifies you.", icon: "⏱️" },
                { step: "Step 3", title: "Ship the Item", desc: "Pack the item securely and ship it back to the provided address.", icon: "📦" },
                { step: "Step 4", title: "Get Refund", desc: "After inspection, your refund is processed within 5–7 business days.", icon: "💰" },
              ].map((c) => (
                <div key={c.title} className="rounded-lg bg-neutral-50 p-4">
                  <span className="text-xl">{c.icon}</span>
                  <p className="mt-1.5 text-xs font-semibold text-primary">{c.step}</p>
                  <h5 className="text-sm font-semibold">{c.title}</h5>
                  <p className="mt-1 text-xs text-neutral-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="refund" num="3" title="Refund Policy">
            <p className="mb-3 text-sm text-neutral-700">Refund timelines by payment method:</p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-neutral-50">
                  <tr>
                    {["Payment Method", "Timeline", "Refund To"].map((h) => (
                      <th key={h} className="border-b px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[["bKash / Nagad", "3–5 business days", "Original mobile wallet"], ["Bank Transfer", "5–7 business days", "Original bank account"], ["Cash on Delivery", "5–7 business days", "bKash / Bank account"], ["Card Payment", "7–10 business days", "Original card"]].map(([m, t, r], idx) => (
                    <tr key={idx} className={idx % 2 ? "bg-neutral-50" : ""}>
                      <td className="border-b px-4 py-2.5">{m}</td>
                      <td className="border-b px-4 py-2.5">{t}</td>
                      <td className="border-b px-4 py-2.5">{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="exchange" num="4" title="Exchange Policy">
            <p className="text-sm leading-7 text-neutral-700">
              If you received a defective, damaged, or wrong product, we will exchange it free of charge. Submit a return request and select <strong>"Exchange"</strong> as the reason. The replacement will be shipped once we receive the returned item. If unavailable, you'll receive a full refund.
            </p>
          </Section>

          <Section id="non-returnable" num="5" title="Non-Returnable Items" numColor="bg-red-500">
            <p className="mb-3 text-sm text-neutral-700">The following items cannot be returned or exchanged:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Perishable goods (food, flowers, etc.)", "Personal care & hygiene products", "Undergarments & innerwear", "Customized or personalized items", "Products with broken seals or tags removed", "Gift cards & vouchers"].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> {t}
                </div>
              ))}
            </div>
          </Section>

          <Section id="damaged" num="6" title="Damaged or Wrong Products">
            <div className="rounded-lg bg-primary/5 p-5">
              <p className="mb-3 text-sm text-neutral-700">If you received a damaged or wrong product, please:</p>
              <ol className="space-y-2.5">
                {["Take photos/video of the damaged product and packaging.", "Submit a return request within 48 hours of delivery.", "Our team will arrange a free pickup and replacement/refund."].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </Section>

          <Section id="contact" num="7" title="Need Help?">
            <p className="mb-4 text-sm text-neutral-700">Questions about our return policy? Contact us:</p>
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
