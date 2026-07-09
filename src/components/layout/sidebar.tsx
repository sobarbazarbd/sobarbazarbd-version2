"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Grid3X3, Store } from "lucide-react";
import { API_BASE, endpoints, type Category } from "@/lib/api";
import { cn } from "@/lib/utils";

function categoryImage(category: Category) {
  return category.image_url || category.image || category.subcategories?.find((sub) => sub.image_url || sub.image)?.image_url || category.subcategories?.find((sub) => sub.image_url || sub.image)?.image || "";
}

export function LeftSidebar({ className }: { className?: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${API_BASE}${endpoints.categories}?pagination=0`).then((res) => (res.ok ? res.json() : null)),
      fetch(`${API_BASE}${endpoints.exclusiveCategories}`).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([json, exclusiveJson]) => {
        if (cancelled) return;
        const list = json?.data ?? json?.results ?? json ?? [];
        const exclusiveList = exclusiveJson?.data ?? exclusiveJson?.results ?? exclusiveJson ?? [];
        const regular = Array.isArray(list) ? list : [];
        const exclusive = Array.isArray(exclusiveList)
          ? exclusiveList.map((cat: Category) => ({
              ...cat,
              href: `/exclusive?category=${cat.droploo_id || cat.id}`,
              isExclusive: true,
              subcategories: (cat.subcategories || []).map((sub: Category) => ({
                ...sub,
                href: `/exclusive?category=${sub.droploo_id || sub.id}`,
                isExclusive: true,
                image_url: sub.image_url || cat.image_url || cat.image,
              })),
            }))
          : [];
        const next = [
          {
            id: -999,
            name: "RAKAMARI",
            slug: "rakamari",
            href: "/exclusive",
            image: "/assets/images/thumbs/rokomari-logo.png",
            isExclusive: true,
            subcategories: exclusive,
          },
          ...regular,
        ];
        setCategories(next);
        setOpenId(-999);
      })
      .catch(() => setCategories([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-[232px] shrink-0 overflow-y-auto border-r bg-white py-3 shadow-sm scrollbar-none lg:block",
        className
      )}
    >
      <div className="mb-2 px-3">
        <Link href="/shop" className="flex items-center gap-2 rounded-lg bg-[#075f58] px-3 py-2.5 text-sm font-bold text-white">
          <Grid3X3 className="h-4 w-4" />
          All Categories
        </Link>
      </div>
      <nav className="flex flex-col px-2">
        {categories.map((category) => {
          const image = categoryImage(category);
          const hasChildren = Boolean(category.subcategories?.length);
          const isOpen = openId === category.id;

          return (
            <div key={category.id} className="rounded-lg">
              <div className="flex items-center gap-1">
                <Link
                  href={category.href || `/shop?category=${category.id}`}
                  className="group flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-emerald-50 hover:text-primary"
                >
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-md bg-emerald-50 text-primary">
                    {image ? (
                      <Image src={image} alt={category.name} fill className="object-cover" sizes="32px" />
                    ) : (
                      <Store className="h-4 w-4" />
                    )}
                  </span>
                  <span className="truncate">{category.name}</span>
                </Link>
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : category.id)}
                    aria-label={`Toggle ${category.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-primary"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}
              </div>

              {hasChildren && isOpen && (
                <div className="ml-10 border-l border-emerald-100 py-1">
                  {category.subcategories?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={sub.href || `/shop?subcategory=${sub.id}`}
                      className="block truncate px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-primary"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="px-4 py-4 text-xs text-neutral-500">Loading categories...</div>
        )}
      </nav>
    </aside>
  );
}
