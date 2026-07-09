import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, ChevronRight } from "lucide-react";

const WA_NUMBER = "8801348080750";
const CALL_NUMBER = "01348080750";
const SUPPORT_EMAIL = "support@sobar.com";

const contacts = [
  {
    icon: Phone,
    title: "Phone Support",
    desc: CALL_NUMBER,
    action: "Call now",
    href: `tel:${CALL_NUMBER}`,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: SUPPORT_EMAIL,
    action: "Send email",
    href: `mailto:${SUPPORT_EMAIL}`,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "24/7 Available",
    action: "Start chat",
    href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello, I need help with my order.")}`,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const faqs = [
  { label: "How to track my order?", href: "/account/track" },
  { label: "Return policy", href: "/return-policy" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms & conditions", href: "/terms-conditions" },
];

export default function SupportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Customer Support</h1>
        <p className="mt-1 text-sm text-neutral-500">We&apos;re here to help you 24/7</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="text-sm font-semibold">Contact Support</h2>
            {contacts.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-xl border bg-neutral-50 p-3 transition hover:translate-x-1"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${c.bg} ${c.color}`}>
                  <c.icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-neutral-500">{c.desc}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${c.color}`}>
                  {c.action} <ChevronRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <h2 className="text-sm font-semibold">Quick Help</h2>
            {faqs.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm text-neutral-700 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {f.label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
