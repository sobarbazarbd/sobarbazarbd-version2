"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORTS = [
  { value: "", label: "Featured" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

export function ShopSortBar({ total, currentSort }: { total: number; currentSort?: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  const onChange = (val: string) => {
    const params = new URLSearchParams(sp.toString());
    if (val) params.set("sort", val);
    else params.delete("sort");
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3 px-4">
      <span className="text-sm text-neutral-600">
        <strong className="text-neutral-900">{total}</strong> products
      </span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-neutral-500">Sort:</span>
        <select
          value={currentSort || ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-md border bg-white px-2 text-sm font-medium focus:border-primary focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
