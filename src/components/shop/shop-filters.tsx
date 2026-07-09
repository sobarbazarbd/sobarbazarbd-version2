"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import type { FilterOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Active = {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
};

const RATINGS = [4, 3, 2, 1];

export function ShopFilters({ options, active }: { options: FilterOptions | null; active: Active }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [minP, setMinP] = useState(active.minPrice || "");
  const [maxP, setMaxP] = useState(active.maxPrice || "");

  const categories = options?.categories || [];
  const brands = options?.brands || [];
  const priceRange = options?.price_range;

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const applyPrice = () => {
    const params = new URLSearchParams(sp.toString());
    if (minP) params.set("min_price", minP); else params.delete("min_price");
    if (maxP) params.set("max_price", maxP); else params.delete("max_price");
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const clearAll = () => router.push("/shop");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Filters</h3>
        <Button variant="link" size="sm" onClick={clearAll} className="h-auto p-0 text-xs">
          Clear all
        </Button>
      </div>

      {/* Categories */}
      <div className="rounded-xl border bg-white p-4">
        <h4 className="mb-2 text-sm font-semibold">Categories</h4>
        <ul className="space-y-1 text-sm">
          {categories.map((cat) => {
            const isActive = String(active.category) === String(cat.id) || String(active.category) === String(cat.slug);
            const isExpanded = expanded[String(cat.id)] ?? isActive;
            return (
              <li key={cat.id}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setParam("category", isActive ? undefined : String(cat.id))}
                    className={`flex-1 truncate py-1 text-left transition-colors ${isActive ? "font-semibold text-primary" : "text-neutral-700 hover:text-primary"}`}
                  >
                    {cat.name}
                  </button>
                  {cat.subcategories?.length ? (
                    <button
                      onClick={() => setExpanded((p) => ({ ...p, [String(cat.id)]: !isExpanded }))}
                      className="ml-1 text-neutral-400"
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : null}
                </div>
                {isExpanded && cat.subcategories?.length ? (
                  <ul className="ml-3 mt-1 space-y-0.5 border-l border-neutral-100 pl-3 text-[13px]">
                    {cat.subcategories.map((s) => {
                      const isSub = String(active.subcategory) === String(s.id);
                      return (
                        <li key={s.id}>
                          <button
                            onClick={() => setParam("subcategory", isSub ? undefined : String(s.id))}
                            className={`block w-full truncate py-0.5 text-left ${isSub ? "font-medium text-primary" : "text-neutral-600 hover:text-primary"}`}
                          >
                            {s.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="rounded-xl border bg-white p-4">
          <h4 className="mb-2 text-sm font-semibold">Brands</h4>
          <ul className="max-h-56 space-y-1 overflow-y-auto text-sm">
            {brands.map((brand) => {
              const isActive = String(active.brand) === String(brand.id);
              return (
                <li key={brand.id}>
                  <button
                    onClick={() => setParam("brand", isActive ? undefined : String(brand.id))}
                    className={`block w-full truncate py-1 text-left transition-colors ${isActive ? "font-semibold text-primary" : "text-neutral-700 hover:text-primary"}`}
                  >
                    {brand.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Price */}
      <div className="rounded-xl border bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold">Price (৳)</h4>
        <div className="flex gap-2">
          <Input
            placeholder={priceRange ? String(Math.floor(priceRange.min)) : "Min"}
            type="number"
            value={minP}
            onChange={(e) => setMinP(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            placeholder={priceRange ? String(Math.ceil(priceRange.max)) : "Max"}
            type="number"
            value={maxP}
            onChange={(e) => setMaxP(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <Button onClick={applyPrice} size="sm" className="mt-3 w-full">
          Apply
        </Button>
      </div>

      {/* Rating */}
      <div className="rounded-xl border bg-white p-4">
        <h4 className="mb-2 text-sm font-semibold">Rating</h4>
        <ul className="space-y-1 text-sm">
          {RATINGS.map((r) => {
            const isActive = active.minRating === String(r);
            return (
              <li key={r}>
                <button
                  onClick={() => setParam("min_rating", isActive ? undefined : String(r))}
                  className={`flex w-full items-center gap-1.5 py-1 text-left transition-colors ${isActive ? "font-semibold text-primary" : "text-neutral-700 hover:text-primary"}`}
                >
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < r ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`}
                      />
                    ))}
                  </span>
                  <span className="text-xs">&amp; up</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
