import Link from "next/link";
import { Search, ShieldCheck, Store, Truck } from "lucide-react";

const features = [
  { icon: Store, title: "Sobarbazar Mall", subtitle: "Verified local sellers", href: "/stores" },
  { icon: Truck, title: "Fast Shipment", subtitle: "Inside and outside Dhaka", href: "/shop" },
  { icon: Search, title: "Find Products", subtitle: "Search by name or category", href: "/shop" },
  { icon: ShieldCheck, title: "Safe Orders", subtitle: "Cash on delivery available", href: "/contact" },
];

export function FeatureBar() {
  return (
    <section className="container mt-3">
      <div className="grid grid-cols-1 gap-2 rounded-lg border bg-white p-2 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link key={f.title} href={f.href} className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-4 transition hover:border-primary/40 hover:shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary ring-1 ring-emerald-100">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">{f.title}</h4>
              <p className="text-[10px] text-neutral-500 sm:text-xs">{f.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
