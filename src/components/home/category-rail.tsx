import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/api";

export function CategoryRail({ categories }: { categories: Category[] }) {
  if (!categories?.length) return null;
  return (
    <section className="container mt-3">
      <div className="flex gap-2 overflow-x-auto rounded-lg border bg-white p-2 shadow-sm scrollbar-none">
        {categories.slice(0, 28).map((cat) => (
          <Link
            key={cat.id}
            href={cat.href || `/shop?subcategory=${cat.id}`}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-neutral-650 transition hover:border-primary/40 hover:bg-emerald-50 hover:text-primary"
          >
            <div className="relative h-6 w-6 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-100">
              {cat.image_url || cat.image ? (
                <Image
                  src={cat.image_url || cat.image || ""}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              ) : (
                <span className="block h-full w-full bg-primary/20" />
              )}
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
        <Link href="/shop" className="shrink-0 rounded-full border border-primary bg-primary px-3 py-1.5 text-[11px] font-bold text-white">
          View All Categories
        </Link>
        <Link href="/exclusive" className="shrink-0 rounded-full border border-amber-400 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700">
          RAKAMARI
        </Link>
      </div>
    </section>
  );
}
