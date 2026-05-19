"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { API_BASE, endpoints } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { formatBDT } from "@/lib/utils";

type Order = {
  id: number | string;
  order_id?: string;
  created_at?: string;
  status?: string;
  total?: number;
  items_count?: number;
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary" | "destructive" | "default"> = {
  pending: "warning",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
  failed: "destructive",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE}${endpoints.myOrders}`, {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        const list = json?.data?.results ?? json?.data ?? json?.results ?? json ?? [];
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error("Fetch orders failed:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p>Please sign in to view your orders.</p>
          <Link href="/login" className="mt-3 text-sm font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold md:text-2xl">My Orders</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-neutral-300" />
            <h3 className="mt-3 text-lg font-semibold">No orders yet</h3>
            <p className="mt-1 text-sm text-neutral-500">Your order history will appear here</p>
            <Link href="/shop" className="mt-4 text-sm font-semibold text-primary hover:underline">
              Start shopping
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold md:text-2xl">My Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Order #{o.order_id || o.id}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {o.created_at ? new Date(o.created_at).toLocaleDateString() : ""}
                  {o.items_count ? ` · ${o.items_count} items` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {o.status && (
                  <Badge variant={STATUS_VARIANT[o.status?.toLowerCase()] || "secondary"}>
                    {o.status}
                  </Badge>
                )}
                {o.total !== undefined && <span className="font-bold">{formatBDT(o.total)}</span>}
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
