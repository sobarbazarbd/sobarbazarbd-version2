"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Gem,
  Footprints,
  Sparkles,
  Shirt,
  Eye,
  Watch,
  Smartphone,
  Store,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const categories: CategoryItem[] = [
  { label: "Apparel", href: "/shop?category=11", icon: Shirt },
  { label: "Electronics", href: "/shop?category=12", icon: Smartphone },
  { label: "Grocery", href: "/shop?category=10", icon: ShoppingBag },
  { label: "Home Appliances", href: "/shop?category=13", icon: Sparkles },
  { label: "Furniture", href: "/shop?category=14", icon: Store },
  { label: "Bags", href: "/shop?subcategory=100", icon: ShoppingBag },
  { label: "Cameras", href: "/shop?subcategory=85", icon: Eye },
  { label: "Men's Clothing", href: "/shop?subcategory=75", icon: Shirt },
  { label: "Women's Clothing", href: "/shop?subcategory=76", icon: Shirt },
  { label: "Watches", href: "/shop?search=watch", icon: Watch },
];

export function LeftSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-[210px] shrink-0 overflow-y-auto border-r bg-white py-3 scrollbar-none lg:block",
        className
      )}
    >
      <nav className="flex flex-col">
        {categories.map((c) => {
          const active = false;
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors",
                active
                  ? "bg-sky-light text-sky-primary"
                  : "text-neutral-700 hover:bg-sky-light hover:text-sky-primary"
              )}
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-sky-light text-sky-primary group-hover:bg-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 truncate">{c.label}</span>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-sky-primary" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
