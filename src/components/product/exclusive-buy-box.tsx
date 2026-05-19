"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { trackAddToCart, trackViewContent } from "@/components/meta-pixel";
import { formatBDT, discountPercent } from "@/lib/utils";
import type { ExclusiveProduct } from "@/lib/api";
import { toast } from "sonner";

export function ExclusiveBuyBox({ product }: { product: ExclusiveProduct }) {
  const router = useRouter();
  const { addDropshipping } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const variants = product.product_images || [];
  const hasVariants = product.is_variable && variants.length > 0;
  const [variantIdx, setVariantIdx] = useState<number>(hasVariants ? -1 : 0);

  const selectedVariant = variantIdx >= 0 ? variants[variantIdx] : null;
  const price = useMemo(() => {
    if (selectedVariant?.price) return Number(selectedVariant.price);
    return Number(product.display_price ?? product.selling_price ?? product.regular_price);
  }, [selectedVariant, product]);

  useEffect(() => {
    if (!product?.id) return;
    trackViewContent({
      contentId: product.id,
      contentName: product.name,
      value: price,
    });
  }, [product.id, price]);

  const regular = Number(product.regular_price || 0);
  const off = discountPercent(regular, price);
  const stock = Number(product.qty || 0);

  const handleAdd = async (buyNow = false) => {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    setAdding(true);
    const result = await addDropshipping({
      productId: product.id,
      droplooImageId: selectedVariant?.id ?? null,
      size: selectedVariant?.size || "",
      color: selectedVariant?.color || "",
      unitPrice: price,
      quantity: qty,
    });
    setAdding(false);
    if (result.success) {
      trackAddToCart({
        contentId: product.id,
        contentName: product.name,
        value: price * qty,
        quantity: qty,
      });
      toast.success("Added to cart");
      if (buyNow) router.push("/checkout");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Badge variant="warning" className="self-start">Exclusive · Rakamari Store</Badge>
      <h1 className="text-xl font-bold leading-tight md:text-2xl">{product.name}</h1>

      {product.rating ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${s <= Math.round(product.rating || 0) ? "fill-amber-400 stroke-amber-400" : "stroke-neutral-300"}`}
              />
            ))}
          </span>
          <span className="font-medium">{product.rating.toFixed(1)}</span>
        </div>
      ) : null}

      <Separator />

      <div className="flex items-baseline gap-3 rounded-xl bg-amber-50 px-4 py-3">
        <span className="text-3xl font-bold text-amber-600">{formatBDT(price)}</span>
        {off > 0 && (
          <>
            <span className="text-base text-neutral-400 line-through">{formatBDT(regular)}</span>
            <Badge variant="destructive">-{off}%</Badge>
          </>
        )}
      </div>

      {hasVariants && (
        <div>
          <h4 className="mb-2 text-sm font-semibold">Available variants</h4>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantIdx(i)}
                className={`rounded-md border-2 px-3 py-2 text-xs transition ${
                  variantIdx === i ? "border-amber-500 bg-amber-50" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <span className="block font-semibold">{v.size || v.color || `Option ${i + 1}`}</span>
                <span className="text-neutral-500">{formatBDT(v.price)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm">
        <span className={`inline-flex items-center gap-1.5 font-medium ${stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
          <span className={`h-2 w-2 rounded-full ${stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
          {stock > 0 ? `${stock} available` : "Out of stock"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-md border bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-accent">
            <Minus className="h-4 w-4" />
          </button>
          <span className="grid h-10 w-12 place-items-center text-sm font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center hover:bg-accent">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button onClick={() => handleAdd(false)} size="lg" variant="secondary" className="flex-1" disabled={adding || stock === 0}>
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
        <Button onClick={() => handleAdd(true)} size="lg" className="flex-1" disabled={adding || stock === 0}>
          Buy Now
        </Button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border bg-white p-3 text-center text-xs">
        <div className="flex flex-col items-center gap-1.5">
          <Truck className="h-5 w-5 text-primary" />
          <span className="font-medium">Fast Delivery</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-medium">Quality Checked</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <RotateCcw className="h-5 w-5 text-primary" />
          <span className="font-medium">Easy Returns</span>
        </div>
      </div>
    </div>
  );
}
