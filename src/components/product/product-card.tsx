"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatBDT, discountPercent } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { trackAddToCart } from "@/components/meta-pixel";
import { pushAddToCart } from "@/components/gtm";
import { toast } from "sonner";

export type ProductCardData = {
  id: number | string;
  slug?: string;
  href?: string;
  name: string;
  image: string;
  regularPrice: number;
  sellingPrice: number;
  rating?: number;
  reviews?: number;
  storeName?: string;
  isExclusive?: boolean;
  isVariable?: boolean;
  variantId?: number | null;
};

export function ProductCard({ p, className }: { p: ProductCardData; className?: string }) {
  const { addToCart, addDropshipping } = useCart();
  const [adding, setAdding] = useState(false);
  const off = discountPercent(p.regularPrice, p.sellingPrice);
  const href = p.href || (p.isExclusive ? `/exclusive/${p.id}` : `/product/${p.slug || p.id}`);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Variable products → go to detail to pick variant
    if (p.isVariable) {
      window.location.href = href;
      return;
    }

    setAdding(true);
    let result: { success: boolean };
    if (p.isExclusive) {
      result = await addDropshipping({
        productId: p.id,
        droplooImageId: null,
        unitPrice: p.sellingPrice || p.regularPrice,
        quantity: 1,
      });
    } else {
      if (!p.variantId) {
        toast.error("Please open the product to select options");
        window.location.href = href;
        setAdding(false);
        return;
      }
      result = await addToCart(p.variantId, 1);
    }
    setAdding(false);

    if (result.success) {
      const unitPrice = p.sellingPrice || p.regularPrice;
      trackAddToCart({
        contentId: p.id,
        contentName: p.name,
        value: unitPrice,
        quantity: 1,
      });
      pushAddToCart({
        id: p.id,
        name: p.name,
        price: unitPrice,
        quantity: 1,
        category: p.storeName || "",
      });
      toast.success("Added to cart");
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border bg-white transition-all hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        <Image
          src={p.image || "/placeholder.png"}
          alt={p.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{off}%
          </span>
        )}
        {p.isExclusive && (
          <span className="absolute right-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Exclusive
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-2.5 py-2">
        <h3 className="line-clamp-2 min-h-[2.15rem] text-[12px] font-medium leading-snug text-neutral-800 group-hover:text-primary">
          {p.name}
        </h3>

        {p.storeName && <span className="truncate text-[10px] text-neutral-500">{p.storeName}</span>}

        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-[15px] font-black text-rose-600">{formatBDT(p.sellingPrice || p.regularPrice)}</span>
          {off > 0 && <span className="text-[10px] text-neutral-400 line-through">{formatBDT(p.regularPrice)}</span>}
        </div>

        <span className="text-[10px] font-semibold text-sky-primary">{p.reviews || Math.max(0, Number(p.id) % 900)} Sold</span>

        <div className="mt-1 grid grid-cols-[1fr_auto] gap-1.5">
          <span className="grid h-7 place-items-center rounded bg-primary text-[11px] font-bold text-white">
            View Details
          </span>
          <Button onClick={handleAdd} size="icon" className="h-7 w-8" variant="secondary" disabled={adding} aria-label="Add to cart">
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
