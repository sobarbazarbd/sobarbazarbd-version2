"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import type { WishlistEntry } from "@/lib/api";
import { fetchWishlist, isLoggedIn, removeWishlistItem, subscribeWishlist } from "@/lib/wishlist";

function toCardData(item: WishlistEntry): ProductCardData {
  const p = item.product_details || item.product;
  const price = Number(item.product_details?.final_price ?? item.product_details?.price ?? p?.default_variant?.final_price ?? p?.default_variant?.price ?? 0);
  const regularPrice = Number(item.product_details?.price ?? p?.default_variant?.price ?? price);
  return {
    id: p?.id ?? item.id,
    slug: p?.slug,
    name: p?.name || "Product",
    image: item.product_details?.image || p?.images?.[0]?.image || "/placeholder.png",
    regularPrice,
    sellingPrice: price,
    variantId: p?.default_variant?.id ?? null,
  };
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      const list = await fetchWishlist(true);
      if (active) setItems(list);
      setLoading(false);
    };
    load();
    const unsub = subscribeWishlist(load);
    return () => {
      active = false;
      unsub();
    };
  }, [authLoading, user]);

  const handleRemove = async (favoriteId: number | string) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(favoriteId)));
    await removeWishlistItem(favoriteId);
  };

  if (authLoading || loading) {
    return (
      <div className="container mt-8 flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!isLoggedIn() || !user) {
    return (
      <div className="container mt-8 flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Heart className="h-16 w-16 text-neutral-300" />
        <h1 className="mt-3 text-xl font-bold">Please login to view your wishlist</h1>
        <Link href="/login" className="mt-4 text-sm font-semibold text-primary hover:underline">
          Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mt-8 flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Heart className="h-16 w-16 text-neutral-300" />
        <h1 className="mt-3 text-xl font-bold">Your wishlist is empty</h1>
        <p className="mt-1 text-sm text-neutral-500">Save products you love for later</p>
        <Link href="/shop" className="mt-4 text-sm font-semibold text-primary hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 md:mt-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Wishlist</h1>
          <p className="mt-1 text-sm text-neutral-500">{items.length} saved product{items.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
          Continue shopping
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <ProductCard p={toCardData(item)} />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => handleRemove(item.id)}
              aria-label="Remove from wishlist"
              className="absolute right-2 top-2 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
