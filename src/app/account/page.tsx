"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Clock, Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { API_BASE, endpoints, type WishlistEntry } from "@/lib/api";
import { formatBDT } from "@/lib/utils";

type Order = {
  id: number | string;
  order_number?: string;
  order_date?: string;
  status?: string;
  total_amount?: number;
  total_price?: number;
  items?: unknown[];
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary" | "destructive" | "default"> = {
  delivered: "success",
  paid: "success",
  pending: "warning",
  processing: "warning",
  placed: "warning",
  shipped: "default",
  cancelled: "destructive",
};

export default function AccountOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let cancelled = false;
    setLoading(true);
    const headers = { Authorization: `JWT ${token}` };

    Promise.all([
      fetch(`${API_BASE}${endpoints.myOrders}`, { headers }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE}${endpoints.favoriteProducts}`, { headers }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([ordersJson, wishJson]) => {
        if (cancelled) return;
        const orderList = ordersJson?.data?.results ?? ordersJson?.data ?? ordersJson?.results ?? ordersJson ?? [];
        const wishList = wishJson?.data ?? wishJson?.results ?? wishJson ?? [];
        setOrders(Array.isArray(orderList) ? orderList : []);
        setWishlist(Array.isArray(wishList) ? wishList : []);
      })
      .catch((err) => console.error("Fetch account overview failed:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-neutral-600">
          Please sign in to view your account.
        </CardContent>
      </Card>
    );
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ["Pending", "Processing", "Placed"].includes(o.status || "")).length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.order_date || 0).getTime() - new Date(a.order_date || 0).getTime())
    .slice(0, 3);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: pendingOrders, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Wishlist", value: wishlist.length, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Delivered", value: deliveredOrders, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Welcome back, {user.customer?.name || user.username}!</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col gap-2 p-4">
              <span className={`grid h-10 w-10 place-items-center rounded-lg ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-extrabold leading-none">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : s.value}</p>
                <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-neutral-500">Loading...</div>
          ) : recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-neutral-500">No recent orders</div>
          ) : (
            <div className="divide-y">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/account/orders/${o.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary">#{o.order_number || o.id}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {o.order_date ? new Date(o.order_date).toLocaleDateString() : ""} · {o.items?.length || 0} items
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-bold">{formatBDT(Number(o.total_amount ?? o.total_price ?? 0))}</span>
                    {o.status && <Badge variant={STATUS_VARIANT[o.status.toLowerCase()] || "secondary"}>{o.status}</Badge>}
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold">My Wishlist</h2>
            <Link href="/wishlist" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-neutral-500">Loading...</div>
          ) : wishlist.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-neutral-500">No wishlist items</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-3">
              {wishlist.slice(0, 3).map((item) => {
                const p = item.product_details || item.product;
                const price =
                  item.product_details?.final_price ??
                  item.product_details?.price ??
                  item.product?.default_variant?.final_price ??
                  item.product?.default_variant?.price ??
                  0;
                return (
                  <div key={item.id} className="rounded-lg border p-3">
                    <p className="line-clamp-1 text-sm font-semibold">{p?.name || "Product"}</p>
                    <p className="mt-1 font-bold text-primary">{formatBDT(Number(price))}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="outline" size="sm">
        <Link href="/account/settings">Edit profile</Link>
      </Button>
    </div>
  );
}
