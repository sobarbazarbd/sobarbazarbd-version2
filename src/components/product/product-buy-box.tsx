"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { trackAddToCart, trackViewContent } from "@/components/meta-pixel";
import { formatBDT, discountPercent } from "@/lib/utils";
import type { Product, Variant } from "@/lib/api";
import { toast } from "sonner";

export function ProductBuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const variants = product.variants || (product.default_variant ? [product.default_variant] : []);
  const [variantId, setVariantId] = useState<number | undefined>(product.default_variant?.id);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const selected: Variant | undefined =
    variants.find((v) => v.id === variantId) || product.default_variant || variants[0];

  useEffect(() => {
    if (!product?.id || !selected) return;
    trackViewContent({
      contentId: product.id,
      contentName: product.name,
      value: selected.final_price || selected.price || 0,
    });
  }, [product.id, selected]);

  const regular = Number(selected?.price || 0);
  const selling = Number(selected?.final_price || regular);
  const stock = Number(selected?.stock || 0);
  const off = discountPercent(regular, selling);

  const handleAdd = async (buyNow = false) => {
    if (!selected?.id) {
      toast.error("Please select a variant");
      return;
    }
    setAdding(true);
    const result = await addToCart(selected.id, qty);
    setAdding(false);
    if (result.success) {
      trackAddToCart({
        contentId: product.id,
        contentName: product.name,
        value: (selling || regular) * qty,
        quantity: qty,
      });
      toast.success("Added to cart");
      if (buyNow) router.push("/checkout");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {product.store?.name && (
        <Link href={`/stores/${product.store.id}`} className="text-xs font-medium text-primary hover:underline">
          {product.store.name}
        </Link>
      )}

      <h1 className="text-xl font-bold leading-tight md:text-2xl">{product.name}</h1>

      <div className="flex items-center gap-2 text-sm">
        {product.rating ? (
          <>
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${s <= Math.round(product.rating || 0) ? "fill-amber-400 stroke-amber-400" : "stroke-neutral-300"}`}
                />
              ))}
            </span>
            <span className="font-medium">{product.rating.toFixed(1)}</span>
          </>
        ) : null}
        {product.review_count !== undefined && (
          <span className="text-neutral-500">({product.review_count} reviews)</span>
        )}
      </div>

      <Separator />

      <div className="flex items-baseline gap-3 rounded-xl bg-primary/5 px-4 py-3">
        <span className="text-3xl font-bold text-primary">{formatBDT(selling || regular)}</span>
        {off > 0 && (
          <>
            <span className="text-base text-neutral-400 line-through">{formatBDT(regular)}</span>
            <Badge variant="destructive">-{off}%</Badge>
          </>
        )}
      </div>

      {variants.length > 1 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold">Choose variant</h4>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-md border-2 px-3 py-2 text-xs transition ${
                  variantId === v.id ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <span className="block font-semibold">{v.name || `Option ${v.id}`}</span>
                <span className="text-neutral-500">{formatBDT(v.final_price || v.price)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm">
        <span className={`inline-flex items-center gap-1.5 font-medium ${stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
          <span className={`h-2 w-2 rounded-full ${stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-md border bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-accent">
            <Minus className="h-4 w-4" />
          </button>
          <span className="grid h-10 w-12 place-items-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
            className="grid h-10 w-10 place-items-center hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button onClick={() => handleAdd(false)} disabled={adding || stock === 0} size="lg" variant="secondary" className="flex-1">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
        <Button onClick={() => handleAdd(true)} disabled={adding || stock === 0} size="lg" className="flex-1">
          Buy Now
        </Button>
        <Button variant="outline" size="lg" className="px-3">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border bg-white p-3 text-center text-xs">
        <div className="flex flex-col items-center gap-1.5">
          <Truck className="h-5 w-5 text-primary" />
          <span className="font-medium">Fast Delivery</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-medium">100% Authentic</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <RotateCcw className="h-5 w-5 text-primary" />
          <span className="font-medium">7-Day Returns</span>
        </div>
      </div>

      {product.short_description && (
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{product.short_description}</p>
      )}
    </div>
  );
}
