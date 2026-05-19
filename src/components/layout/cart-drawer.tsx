"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart, MapPin, Truck } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatBDT } from "@/lib/utils";
import { API_BASE } from "@/lib/api";

const resolveImg = (url?: string | null) => {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

export function CartDrawer() {
  const {
    cartItems,
    dropshippingItems,
    cartCount,
    loading,
    updateQuantity,
    removeFromCart,
    removeDropshipping,
    fetchCart,
    isSidebarOpen,
    closeSidebar,
    deliveryZone,
    setDeliveryZone,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");

  // Lock body scroll when open; refresh cart on open
  useEffect(() => {
    if (isSidebarOpen) {
      fetchCart();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const subtotal = cartItems.reduce((s, i) => s + Number(i.discounted_price || i.total_price || 0), 0);
  const exclusiveSubtotal = dropshippingItems.reduce((s, i) => s + Number(i.subtotal || 0), 0);
  const totalDiscount = cartItems.reduce((s, i) => {
    const orig = Number(i.variant?.price || 0) * i.quantity;
    return s + Math.max(0, orig - Number(i.discounted_price || i.total_price || 0));
  }, 0);
  const shipping = deliveryZone === "IN" ? 60 : 120;
  const grandTotal = subtotal + exclusiveSubtotal + shipping;
  const hasItems = cartItems.length > 0 || dropshippingItems.length > 0;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeSidebar}
        className={[
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Drawer panel */}
      <div
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="flex items-center gap-2 text-base font-bold text-neutral-900">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Shopping Cart
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
              {cartCount}
            </span>
          </span>
          <button
            onClick={closeSidebar}
            className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {loading && !hasItems ? (
            <div className="flex h-full items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !hasItems ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingCart className="h-20 w-20 text-neutral-200" />
              <div>
                <p className="font-semibold text-neutral-700">Your cart is empty</p>
                <p className="mt-1 text-sm text-neutral-500">Add products to start shopping</p>
              </div>
              <Link
                href="/shop"
                onClick={closeSidebar}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {/* Regular items */}
              {cartItems.map((item) => {
                const img = resolveImg(item.variant?.image || item.product?.images?.[0]?.image);
                const price = Number(item.discounted_price || item.total_price || 0);
                const origPrice = Number(item.variant?.price || 0) * item.quantity;
                return (
                  <div key={`reg-${item.id}`} className="flex gap-3 px-5 py-4">
                    <Link
                      href={`/product/${item.product?.slug || ""}`}
                      onClick={closeSidebar}
                      className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border bg-neutral-50"
                    >
                      <Image src={img} alt={item.product?.name || ""} fill className="object-contain p-1" sizes="72px" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product?.slug || ""}`}
                          onClick={closeSidebar}
                          className="line-clamp-2 text-xs font-semibold leading-snug text-neutral-800 hover:text-primary"
                        >
                          {item.product?.name || "Product"}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          className="shrink-0 text-neutral-300 hover:text-red-500 transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {item.variant?.name && (
                        <span className="text-[10px] text-neutral-500">{item.variant.name}</span>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center rounded border bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="grid h-6 w-6 place-items-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="grid h-6 w-7 place-items-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="grid h-6 w-6 place-items-center text-neutral-600 hover:bg-neutral-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-primary">৳{price.toFixed(0)}</span>
                          {origPrice > price && (
                            <span className="ml-1.5 text-[10px] text-neutral-400 line-through">৳{origPrice.toFixed(0)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Exclusive / Dropshipping items */}
              {dropshippingItems.map((item) => {
                const img = resolveImg(item.product_image_url);
                return (
                  <div key={`ds-${item.id}`} className="flex gap-3 bg-amber-50/40 px-5 py-4">
                    <Link
                      href={`/exclusive/${item.product_id || ""}`}
                      onClick={closeSidebar}
                      className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border bg-amber-50"
                    >
                      <Image src={img} alt={item.product_name || ""} fill className="object-contain p-1" sizes="72px" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="mb-0.5 inline-block rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            Exclusive
                          </span>
                          <Link
                            href={`/exclusive/${item.product_id || ""}`}
                            onClick={closeSidebar}
                            className="line-clamp-2 block text-xs font-semibold leading-snug text-neutral-800 hover:text-primary"
                          >
                            {item.product_name || "Exclusive Product"}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeDropshipping(item.id)}
                          disabled={loading}
                          className="shrink-0 text-neutral-300 hover:text-red-500 transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {(item.size || item.color) && (
                        <span className="text-[10px] text-neutral-500">
                          {[item.size, item.color].filter(Boolean).join(" / ")}
                        </span>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-primary">
                          ৳{Number(item.subtotal || 0).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasItems && (
          <div className="border-t bg-white px-5 py-4 space-y-3">
            {/* Delivery zone toggle */}
            <div>
              <p className="mb-2 text-xs font-semibold text-neutral-600">Delivery Zone</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryZone("IN")}
                  className={[
                    "flex flex-col items-center gap-0.5 rounded-lg border py-2.5 text-xs font-semibold transition-all",
                    deliveryZone === "IN"
                      ? "border-primary bg-primary text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary",
                  ].join(" ")}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Inside Dhaka</span>
                  <strong className="text-[11px]">৳60</strong>
                </button>
                <button
                  onClick={() => setDeliveryZone("OUT")}
                  className={[
                    "flex flex-col items-center gap-0.5 rounded-lg border py-2.5 text-xs font-semibold transition-all",
                    deliveryZone === "OUT"
                      ? "border-primary bg-primary text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary",
                  ].join(" ")}
                >
                  <Truck className="h-3.5 w-3.5" />
                  <span>Outside Dhaka</span>
                  <strong className="text-[11px]">৳120</strong>
                </button>
              </div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 rounded-lg border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity">
                Apply
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 text-sm">
              {subtotal > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Products</span>
                  <span className="font-medium">৳{subtotal.toFixed(0)}</span>
                </div>
              )}
              {exclusiveSubtotal > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Exclusive</span>
                  <span className="font-medium">৳{exclusiveSubtotal.toFixed(0)}</span>
                </div>
              )}
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">-৳{totalDiscount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Delivery</span>
                <span className="font-medium">৳{shipping}</span>
              </div>
              <div className="flex items-baseline justify-between border-t pt-1.5">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="text-lg font-black text-primary">৳{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Actions */}
            <Link
              href="/checkout"
              onClick={closeSidebar}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              Checkout — ৳{grandTotal.toFixed(0)}
            </Link>
            <Link
              href="/cart"
              onClick={closeSidebar}
              className="flex w-full items-center justify-center rounded-lg border py-2.5 text-sm font-semibold text-neutral-700 hover:border-primary hover:text-primary transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
