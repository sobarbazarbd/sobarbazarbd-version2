import Link from "next/link";
import { Shield, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — SobarbazarBD",
  description: "Read SobarbazarBD privacy policy. Learn how we collect, use, and protect your personal information.",
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

const Check = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2.5 text-sm text-neutral-700">
    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {text}
  </li>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="container mt-4 md:mt-8">
      <nav className="mb-4 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">Privacy Policy</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-white p-5">
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              {[
                { label: "Information We Collect", id: "collect" },
                { label: "How We Use It", id: "use" },
                { label: "Information Sharing", id: "sharing" },
                { label: "Data Security", id: "security" },
                { label: "Cookies", id: "cookies" },
                { label: "Your Rights", id: "rights" },
                { label: "Contact Us", id: "contact" },
              ].map((i) => (
                <li key={i.id}>
                  <a href={`#${i.id}`} className="hover:text-primary">{i.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="rounded-xl border bg-white p-6 md:p-8">
          <div className="mb-8 flex items-center gap-4 border-b pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="mt-0.5 text-sm text-neutral-500">Last updated: January 2025</p>
            </div>
          </div>

          <p className="mb-8 text-sm leading-7 text-neutral-700">
            At SobarbazarBD, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <Section id="collect" num="1" title="Information We Collect">
            <p className="mb-3 text-sm text-neutral-700">We collect information you provide directly and information collected automatically:</p>
            <ul className="mb-5 space-y-2">
              {["Full name, email address, and phone number", "Shipping and billing address", "Payment information (processed securely)", "Account login credentials", "Order history and preferences"].map((t, i) => <Check key={i} text={t} />)}
            </ul>
            <p className="mb-3 text-sm font-semibold text-neutral-700">Automatically Collected:</p>
            <ul className="space-y-2">
              {["IP address and browser type", "Device information and operating system", "Pages visited and time spent", "Referring website addresses"].map((t, i) => <Check key={i} text={t} />)}
            </ul>
          </Section>

          <Section id="use" num="2" title="How We Use Your Information">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Order Processing", desc: "To process and fulfill your orders, manage payments, and deliver products." },
                { title: "Customer Support", desc: "To respond to inquiries, resolve issues, and provide assistance." },
                { title: "Personalization", desc: "To personalize your shopping experience and recommend products." },
                { title: "Communication", desc: "To send order updates, promotional offers, and important notifications." },
              ].map((c) => (
                <div key={c.title} className="rounded-lg bg-neutral-50 p-4">
                  <h5 className="text-sm font-semibold">{c.title}</h5>
                  <p className="mt-1 text-xs text-neutral-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="sharing" num="3" title="Information Sharing & Disclosure">
            <p className="mb-3 text-sm text-neutral-700">We do not sell, trade, or rent your personal information. We may share it only in these circumstances:</p>
            <ul className="space-y-2">
              {["With delivery partners to fulfill your orders.", "With payment processors to complete transactions.", "With vendors who fulfill your product orders.", "When required by law or legal processes.", "To protect the rights, property, or safety of SobarbazarBD."].map((t, i) => <Check key={i} text={t} />)}
            </ul>
          </Section>

          <Section id="security" num="4" title="Data Security">
            <div className="rounded-lg bg-primary/5 p-5">
              <p className="mb-3 text-sm text-neutral-700">We implement security measures to maintain the safety of your information:</p>
              <ul className="space-y-2">
                {["SSL encryption for all data transmissions.", "Secure payment processing through trusted gateways.", "Regular security audits and vulnerability assessments.", "Access controls to limit employee access to personal data.", "Secure data storage with industry-standard protection."].map((t, i) => <Check key={i} text={t} />)}
              </ul>
            </div>
          </Section>

          <Section id="cookies" num="5" title="Cookies & Tracking Technologies">
            <p className="mb-3 text-sm text-neutral-700">We use cookies to enhance your browsing experience:</p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-neutral-50">
                  <tr>
                    {["Cookie Type", "Purpose", "Duration"].map((h) => (
                      <th key={h} className="border-b px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[["Essential", "Required for website functionality", "Session"], ["Analytics", "Understand how visitors use our site", "1 year"], ["Preferences", "Remember your settings", "1 year"], ["Marketing", "Deliver relevant advertisements", "6 months"]].map(([type, purpose, dur], idx) => (
                    <tr key={idx} className={idx % 2 ? "bg-neutral-50" : ""}>
                      <td className="border-b px-4 py-2.5">{type}</td>
                      <td className="border-b px-4 py-2.5">{purpose}</td>
                      <td className="border-b px-4 py-2.5">{dur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="rights" num="6" title="Your Rights">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Access and view your personal information at any time.", "Request correction of inaccurate data.", "Request deletion of your account and data.", "Opt out of marketing communications.", "Request a copy of data we hold about you.", "Withdraw consent for data processing."].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                </div>
              ))}
            </div>
          </Section>

          <Section id="contact" num="7" title="Contact Us">
            <p className="mb-4 text-sm text-neutral-700">If you have questions about this Privacy Policy, please contact us:</p>
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
