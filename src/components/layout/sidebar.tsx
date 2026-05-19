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
  Baby,
  Watch,
  Smartphone,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryItem = {
  label: string;
  slug: string;
  icon: LucideIcon;
};

const categories: CategoryItem[] = [
  { label: "Bags", slug: "bags", icon: ShoppingBag },
  { label: "Jewelry", slug: "jewelry", icon: Gem },
  { label: "Shoes", slug: "shoes", icon: Footprints },
  { label: "Beauty", slug: "beauty", icon: Sparkles },
  { label: "Mens Wear", slug: "mens-wear", icon: Shirt },
  { label: "Women Wear", slug: "women-wear", icon: Shirt },
  { label: "Eyewear", slug: "eyewear", icon: Eye },
  { label: "Baby Items", slug: "baby-items", icon: Baby },
  { label: "Watches", slug: "watches", icon: Watch },
  { label: "Gadgets", slug: "gadgets", icon: Smartphone },
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
          const href = `/shop?category=${c.slug}`;
          const active = pathname?.includes(`category=${c.slug}`);
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={href}
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
