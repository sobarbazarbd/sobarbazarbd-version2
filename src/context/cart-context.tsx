"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { API_BASE, endpoints, type CartItem, type DropshippingItem } from "@/lib/api";

type CheckoutPayload = {
  paymentMethod: "COD" | "OP";
  area: "IN" | "OUT";
  shippingAddress: string;
  deliveryMethod?: string | null;
  guestData?: { name: string; email: string; phone: string } | null;
};

type CheckoutResult = {
  success: boolean;
  paymentGatewayUrl?: string;
  order?: any;
  error?: string;
};

type CartContextValue = {
  cartId: string | null;
  cartItems: CartItem[];
  dropshippingItems: DropshippingItem[];
  cartCount: number;
  loading: boolean;
  error: string | null;
  deliveryZone: "IN" | "OUT";
  setDeliveryZone: (z: "IN" | "OUT") => void;
  addToCart: (variantId: number | string, quantity?: number) => Promise<{ success: boolean }>;
  addDropshipping: (args: {
    productId: number | string;
    droplooImageId?: number | string | null;
    size?: string;
    color?: string;
    unitPrice: number;
    quantity?: number;
  }) => Promise<{ success: boolean }>;
  updateQuantity: (itemId: number | string, qty: number) => Promise<void>;
  removeFromCart: (itemId: number | string) => Promise<void>;
  removeDropshipping: (itemId: number | string) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<CheckoutResult>;
};

const CartContext = createContext<CartContextValue | null>(null);

function authHeaders() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `JWT ${token}` } : {};
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [dropshippingItems, setDropshippingItems] = useState<DropshippingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryZone, setDeliveryZone] = useState<"IN" | "OUT">("IN");

  // Restore cartId
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cart_id");
    if (saved) setCartId(saved);
  }, []);

  const createCart = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}${endpoints.carts}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
      });
      const json = await res.json();
      if (json.success && json.data) {
        const newId = String(json.data.id);
        localStorage.setItem("cart_id", newId);
        setCartId(newId);
        return newId;
      }
      throw new Error("Failed to create cart");
    } catch (err: any) {
      console.error("Create cart failed:", err);
      setError(err.message);
      return null;
    }
  }, []);

  const fetchCart = useCallback(async () => {
    const id = cartId;
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${endpoints.carts}${id}/`, {
        headers: { "Content-Type": "application/json", ...authHeaders() },
      });
      if (res.status === 404 || res.status === 400) {
        localStorage.removeItem("cart_id");
        setCartId(null);
        setCartItems([]);
        setDropshippingItems([]);
        return;
      }
      if (!res.ok) return;
      const json = await res.json();
      const data = json?.data ?? json;
      setCartItems(Array.isArray(data?.items) ? data.items : []);
      setDropshippingItems(Array.isArray(data?.dropshipping_items) ? data.dropshipping_items : []);
    } catch (err) {
      console.error("Fetch cart failed:", err);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    if (cartId) fetchCart();
  }, [cartId, fetchCart]);

  const addToCart = async (variantId: number | string, quantity = 1) => {
    setLoading(true);
    try {
      let id = cartId;
      if (!id) {
        id = await createCart();
        if (!id) throw new Error("Cart unavailable");
      }
      const res = await fetch(`${API_BASE}${endpoints.cartItems(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ variant_id: variantId, quantity }),
      });
      const json = await res.json();
      if (!res.ok) {
        // Try recovery: bad cart id → create fresh
        if (
          json?.details?.action === "create_new_cart" ||
          (json?.message || "").includes("Invalid cart")
        ) {
          localStorage.removeItem("cart_id");
          setCartId(null);
          const newId = await createCart();
          if (newId) {
            await fetch(`${API_BASE}${endpoints.cartItems(newId)}`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...authHeaders() },
              body: JSON.stringify({ variant_id: variantId, quantity }),
            });
            await fetchCart();
            return { success: true };
          }
        }
        throw new Error(json.message || json.error || "Failed to add to cart");
      }
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      console.error("Add to cart failed:", err);
      toast.error(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const addDropshipping = async ({ productId, droplooImageId, size = "", color = "", unitPrice, quantity = 1 }: any) => {
    setLoading(true);
    try {
      let id = cartId;
      if (!id) {
        id = await createCart();
        if (!id) throw new Error("Cart unavailable");
      }
      const res = await fetch(`${API_BASE}${endpoints.addDropshipping(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          product_id: productId,
          droploo_image_id: droplooImageId ?? null,
          size,
          color,
          unit_price: unitPrice,
          quantity,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed");
      const ds = json.data?.dropshipping_items || [];
      setDropshippingItems(Array.isArray(ds) ? ds : []);
      return { success: true };
    } catch (err: any) {
      console.error("Add dropshipping failed:", err);
      toast.error(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number | string, qty: number) => {
    if (!cartId) return;
    const q = Math.max(1, qty);
    try {
      await fetch(`${API_BASE}${endpoints.cartItemDetail(cartId, itemId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ quantity: q }),
      });
      await fetchCart();
    } catch (err) {
      console.error("Update qty failed:", err);
    }
  };

  const removeFromCart = async (itemId: number | string) => {
    if (!cartId) return;
    try {
      await fetch(`${API_BASE}${endpoints.cartItemDetail(cartId, itemId)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await fetchCart();
    } catch (err) {
      console.error("Remove item failed:", err);
    }
  };

  const removeDropshipping = async (itemId: number | string) => {
    if (!cartId) return;
    try {
      const res = await fetch(`${API_BASE}${endpoints.removeDropshipping(cartId, itemId)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const ds = json?.data?.dropshipping_items || [];
        setDropshippingItems(Array.isArray(ds) ? ds : []);
      }
    } catch (err) {
      console.error("Remove dropshipping failed:", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setDropshippingItems([]);
    setCartId(null);
    localStorage.removeItem("cart_id");
  };

  const checkout = async (payload: CheckoutPayload): Promise<CheckoutResult> => {
    if (!cartId) return { success: false, error: "Empty cart" };
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const body: any = {
        cart_id: cartId,
        payment_method: payload.paymentMethod,
        area: payload.area,
        shipping_address: payload.shippingAddress,
      };
      if (payload.deliveryMethod) body.delivery_method = payload.deliveryMethod;
      if (!token && payload.guestData) {
        body.name = payload.guestData.name;
        body.email = payload.guestData.email;
        body.phone = payload.guestData.phone;
      }

      const res = await fetch(`${API_BASE}${endpoints.createOrder}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || "Checkout failed");

      clearCart();

      if (payload.paymentMethod === "OP" && json.GatewayPageURL) {
        return { success: true, paymentGatewayUrl: json.GatewayPageURL };
      }
      return { success: true, order: json };
    } catch (err: any) {
      console.error("Checkout failed:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cartCount =
    cartItems.reduce((s, i) => s + (i.quantity || 0), 0) +
    dropshippingItems.reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartId,
        cartItems,
        dropshippingItems,
        cartCount,
        loading,
        error,
        deliveryZone,
        setDeliveryZone,
        addToCart,
        addDropshipping,
        updateQuantity,
        removeFromCart,
        removeDropshipping,
        clearCart,
        fetchCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
