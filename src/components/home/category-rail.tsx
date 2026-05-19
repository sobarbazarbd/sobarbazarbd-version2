import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/api";

export function CategoryRail({ categories }: { categories: Category[] }) {
  if (!categories?.length) return null;
  return (
    <section className="container mt-3">
      <div className="flex gap-2 overflow-x-auto bg-white p-2 scrollbar-none">
        {categories.slice(0, 20).map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug || cat.id}`}
            className="group flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold text-neutral-600 transition hover:border-primary/40 hover:bg-sky-light hover:text-primary"
          >
            <div className="relative h-5 w-5 overflow-hidden rounded-full bg-neutral-100">
              {cat.image_url || cat.image ? (
                <Image
                  src={cat.image_url || cat.image || ""}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              ) : (
                <span className="block h-full w-full bg-primary/20" />
              )}
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
        <Link href="/shop" className="shrink-0 rounded-full border border-primary px-3 py-1.5 text-[11px] font-bold text-primary">
          View Sky Gallery +
        </Link>
      </div>
    </section>
  );
}
