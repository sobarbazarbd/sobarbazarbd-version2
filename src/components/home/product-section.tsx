import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";

export function ProductSection({
  title,
  subtitle,
  viewAllHref,
  products,
  accent,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products: ProductCardData[];
  accent?: "default" | "red" | "amber";
}) {
  if (!products?.length) return null;

  const accentBar =
    accent === "red" ? "bg-red-500" : accent === "amber" ? "bg-amber-500" : "bg-primary";

  return (
    <section className="container mt-3">
      <div className="mb-2 flex items-center justify-between gap-4 rounded-t-md border bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-5 w-1 rounded-full ${accentBar}`} />
          <div>
            <h2 className="text-sm font-bold text-sky-dark sm:text-base">{title}</h2>
            {subtitle && (
              <p className="hidden text-[11px] text-neutral-500 sm:block">{subtitle}</p>
            )}
          </div>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary hover:underline sm:text-xs"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
