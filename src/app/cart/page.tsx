"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { API_BASE } from "@/lib/api";

export default function CartPage() {
  const {
    cartItems,
    dropshippingItems,
    updateQuantity,
    removeFromCart,
    removeDropshipping,
    loading,
    cartCount,
  } = useCart();

  const subtotal = cartItems.reduce((s, i) => s + Number(i.discounted_price || i.total_price || 0), 0);
  const exclusiveTotal = dropshippingItems.reduce((s, i) => s + Number(i.subtotal || 0), 0);
  const itemsTotal = subtotal + exclusiveTotal;
  const shipping = itemsTotal > 0 ? (itemsTotal >= 1000 ? 0 : 60) : 0;
  const grandTotal = itemsTotal + shipping;

  if (loading && cartCount === 0) {
    return (
      <div className="container mt-10 flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container mt-10 flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="h-20 w-20 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-neutral-500">Add some products to get started</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4 md:mt-8">
      <h1 className="text-2xl font-bold md:text-3xl">Shopping Cart</h1>
      <p className="mt-1 text-sm text-neutral-500">{cartCount} item{cartCount > 1 ? "s" : ""}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cartItems.map((item) => {
            const img = item.variant?.image
              ? item.variant.image.startsWith("http")
                ? item.variant.image
                : `${API_BASE}${item.variant.image}`
              : item.product?.images?.[0]?.image || "";
            const originalPrice = Number((item.variant?.price || 0) * item.quantity);
            const finalPrice = Number(item.discounted_price || item.total_price || 0);
            return (
              <Card key={`reg-${item.id}`} className="overflow-hidden">
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-50 sm:h-28 sm:w-28">
                    {img && (
                      <Image src={img} alt={item.product?.name || ""} fill className="object-contain p-2" sizes="112px" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {item.product?.name || "Product"}
                      </h3>
                      {item.product?.store?.name && (
                        <p className="mt-0.5 text-xs text-neutral-500">By {item.product.store.name}</p>
                      )}
                      {item.variant?.name && (
                        <p className="mt-0.5 text-xs text-neutral-500">{item.variant.name}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-md border bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center hover:bg-accent"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="grid h-8 w-9 place-items-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center hover:bg-accent"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-bold">{formatBDT(finalPrice)}</span>
                          {originalPrice > finalPrice && (
                            <span className="ml-2 text-xs text-neutral-400 line-through">{formatBDT(originalPrice)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-500"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Dropshipping (Exclusive) items */}
          {dropshippingItems.map((item) => {
            const img = item.product_image_url
              ? item.product_image_url.startsWith("http")
                ? item.product_image_url
                : `${API_BASE}${item.product_image_url}`
              : "";
            return (
              <Card key={`ds-${item.id}`} className="overflow-hidden border-amber-200/50">
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-amber-50 sm:h-28 sm:w-28">
                    {img && (
                      <Image src={img} alt={item.product_name || ""} fill className="object-contain p-2" sizes="112px" />
                    )}
                    <span className="absolute left-1 top-1 rounded-md bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      Exclusive
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {item.product_name || "Exclusive Product"}
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {[item.size, item.color].filter(Boolean).join(" • ") || "Default"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-neutral-500">Qty: {item.quantity}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{formatBDT(item.subtotal || item.unit_price * item.quantity)}</span>
                        <button
                          onClick={() => removeDropshipping(item.id)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between pt-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/shop">← Continue shopping</Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-base font-bold">Order Summary</h3>
              <div className="mt-4 space-y-2.5 text-sm">
                {subtotal > 0 && <Row label={`Products (${cartItems.length})`} value={formatBDT(subtotal)} />}
                {exclusiveTotal > 0 && (
                  <Row label={`Exclusive (${dropshippingItems.length})`} value={formatBDT(exclusiveTotal)} />
                )}
                <Row label="Shipping" value={shipping === 0 ? "FREE" : formatBDT(shipping)} />
                <Separator />
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatBDT(grandTotal)}</span>
                </div>
              </div>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {shipping > 0 && (
                <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add {formatBDT(1000 - itemsTotal)} more for FREE shipping
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-neutral-600">
      <span>{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}
