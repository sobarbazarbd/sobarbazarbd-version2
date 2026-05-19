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
      <div className="grid grid-cols-1 gap-2 bg-white p-2 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link key={f.title} href={f.href} className="flex items-center gap-3 border bg-white p-3 transition hover:border-primary/40">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-light text-primary">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 sm:text-sm">{f.title}</h4>
              <p className="text-[10px] text-neutral-500 sm:text-xs">{f.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
