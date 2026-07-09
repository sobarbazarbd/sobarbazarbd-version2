"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, X } from "lucide-react";
import type { Product, Variant } from "@/lib/api";
import { formatBDT } from "@/lib/utils";

const MAX_COMPARE = 3;

function getVariant(product: Product): Variant | undefined {
  if (product.default_variant) return product.default_variant;
  if (product.variants?.length) return product.variants.find((v) => v.id === product.default_variant?.id) || product.variants[0];
  return undefined;
}

/**
 * Ported from frontend/src/components/ProductCompare.jsx and made functional —
 * the legacy component exists but is commented out / never rendered in
 * frontend's ProductDetailsTwo.jsx. Uses the live `related_products` field
 * confirmed present on the product detail API response.
 */
export function ProductCompare({ currentProduct, relatedProducts }: { currentProduct: Product; relatedProducts: Product[] }) {
  const [selected, setSelected] = useState<Array<number | string>>(() => relatedProducts.slice(0, 2).map((p) => p.id));

  if (!relatedProducts?.length) return null;

  const toggle = (id: number | string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : prev.length < MAX_COMPARE ? [...prev, id] : prev
    );
  };

  const compareList = [currentProduct, ...relatedProducts.filter((p) => selected.includes(p.id))];

  return (
    <section className="mt-6 rounded-xl border bg-white p-5 md:p-8">
      <h2 className="mb-4 text-lg font-bold">Compare Similar Products</h2>

      <div className="mb-5 flex flex-wrap gap-2">
        {relatedProducts.slice(0, 8).map((p) => {
          const isSelected = selected.includes(p.id);
          const disabled = !isSelected && selected.length >= MAX_COMPARE;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              disabled={disabled}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected ? "border-primary bg-primary/10 text-primary" : "border-neutral-200 text-neutral-600 hover:border-primary/40"
              }`}
            >
              {isSelected ? <Check className="h-3 w-3" /> : null}
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 p-2 text-left text-xs font-semibold text-neutral-500"> </th>
              {compareList.map((p) => (
                <th key={p.id} className="p-2 text-center">
                  <Link href={`/product/${p.slug || p.id}`} className="block">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-lg bg-neutral-50">
                      {p.images?.[0]?.image && (
                        <Image src={p.images[0].image} alt={p.name} fill className="object-contain p-1" sizes="80px" />
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold text-neutral-800 hover:text-primary">{p.name}</p>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow label="Price" items={compareList} render={(p) => formatBDT(Number(getVariant(p)?.final_price ?? getVariant(p)?.price ?? 0))} />
            <CompareRow
              label="Stock"
              items={compareList}
              render={(p) => {
                const stock = getVariant(p)?.stock ?? 0;
                return stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600"><Check className="h-3.5 w-3.5" /> In stock</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-500"><X className="h-3.5 w-3.5" /> Out of stock</span>
                );
              }}
            />
            <CompareRow label="Rating" items={compareList} render={(p) => `${Number(p.rating || 0).toFixed(1)} ★ (${p.review_count || 0})`} />
            <CompareRow label="Store" items={compareList} render={(p) => p.store?.name || "—"} />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CompareRow({
  label,
  items,
  render,
}: {
  label: string;
  items: Product[];
  render: (p: Product) => React.ReactNode;
}) {
  return (
    <tr className="border-t">
      <td className="p-2 text-xs font-semibold text-neutral-500">{label}</td>
      {items.map((p) => (
        <td key={p.id} className="p-2 text-center font-medium">
          {render(p)}
        </td>
      ))}
    </tr>
  );
}
