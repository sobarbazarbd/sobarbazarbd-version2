"use client";

import { API_BASE, endpoints, type WishlistEntry } from "@/lib/api";

const EVENT = "wishlist:changed";

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `JWT ${token}` } : {};
}

export function isLoggedIn() {
  return typeof window !== "undefined" && !!localStorage.getItem("access_token");
}

let cache: WishlistEntry[] = [];
let cacheLoaded = false;

function entryProductId(item: WishlistEntry): string | undefined {
  const id = item.product_details?.id ?? item.product?.id;
  return id != null ? String(id) : undefined;
}

/** Fetches the logged-in user's wishlist from the backend (matches frontend/src/components/WishListSection.jsx). */
export async function fetchWishlist(force = false): Promise<WishlistEntry[]> {
  if (!isLoggedIn()) {
    cache = [];
    cacheLoaded = true;
    return cache;
  }
  if (cacheLoaded && !force) return cache;
  try {
    const res = await fetch(`${API_BASE}${endpoints.favoriteProducts}`, { headers: authHeaders() });
    if (!res.ok) {
      cache = [];
      cacheLoaded = true;
      return cache;
    }
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data ?? json?.results ?? [];
    cache = Array.isArray(list) ? list : [];
    cacheLoaded = true;
    return cache;
  } catch (err) {
    console.error("Fetch wishlist failed:", err);
    cache = [];
    cacheLoaded = true;
    return cache;
  }
}

export function getCachedWishlist() {
  return cache;
}

export async function isWishlisted(productId: number | string): Promise<boolean> {
  if (!isLoggedIn()) return false;
  const list = cacheLoaded ? cache : await fetchWishlist();
  return list.some((item) => entryProductId(item) === String(productId));
}

/**
 * Adds a product to the backend wishlist.
 * NEEDS CONFIRMATION: frontend (legacy) never calls this endpoint with a method
 * other than GET/DELETE, so the POST body shape below is inferred from REST
 * convention, not confirmed against the live API. Fails safely (toast, no crash)
 * if the backend expects a different shape.
 */
export async function addWishlistItem(productId: number | string): Promise<{ success: boolean; error?: string }> {
  if (!isLoggedIn()) return { success: false, error: "login_required" };
  try {
    const res = await fetch(`${API_BASE}${endpoints.favoriteProducts}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ product_id: productId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}) as Record<string, string>);
      throw new Error(err?.message || err?.detail || "Failed to add to wishlist");
    }
    await fetchWishlist(true);
    window.dispatchEvent(new CustomEvent(EVENT));
    return { success: true };
  } catch (err) {
    console.error("Add wishlist failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add to wishlist" };
  }
}

/** Removes a wishlist entry by its favorite-product id (matches frontend/src/components/WishListSection.jsx:51-77). */
export async function removeWishlistItem(favoriteId: number | string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}${endpoints.favoriteProductDetail(favoriteId)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to remove from wishlist");
    cache = cache.filter((item) => String(item.id) !== String(favoriteId));
    window.dispatchEvent(new CustomEvent(EVENT));
    return { success: true };
  } catch (err) {
    console.error("Remove wishlist failed:", err);
    return { success: false };
  }
}

export async function toggleWishlist(product: { id: number | string }): Promise<{ added: boolean; error?: string }> {
  if (!isLoggedIn()) return { added: false, error: "login_required" };
  const list = cacheLoaded ? cache : await fetchWishlist();
  const existing = list.find((item) => entryProductId(item) === String(product.id));
  if (existing) {
    const result = await removeWishlistItem(existing.id);
    return { added: false, error: result.success ? undefined : "Failed to update wishlist" };
  }
  const result = await addWishlistItem(product.id);
  return { added: result.success, error: result.error };
}

export function subscribeWishlist(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
