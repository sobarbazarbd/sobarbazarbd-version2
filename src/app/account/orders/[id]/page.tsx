"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2, Package, ShoppingCart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { API_BASE, endpoints } from "@/lib/api";
import { formatBDT } from "@/lib/utils";

type OrderItem = {
  product_title?: string;
  product_image?: string;
  variant?: { name?: string };
  quantity?: number;
  final_unit_price?: number;
  original_unit_price?: number;
  total_price?: number;
};

type OrderDetail = {
  id: number | string;
  order_number?: string;
  order_date?: string;
  status?: string;
  total_amount?: number;
  total_price?: number;
  deliver_charge?: number;
  coupon_discount?: number;
  shipping_address?: string;
  payment_method?: string;
  items?: OrderItem[];
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please sign in to view this order.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}${endpoints.orderDetail(params.id)}`, {
      headers: { Authorization: `JWT ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Order not found");
        const json = await res.json();
        setOrder(json?.data ?? json);
      })
      .catch((err) => setError(err.message || "Unable to load order"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const total = Number(order?.total_amount ?? order?.total_price ?? 0);
  const deliverCharge = Number(order?.deliver_charge ?? 0);
  const couponDiscount = Number(order?.coupon_discount ?? 0);
  const subtotal = useMemo(() => total - deliverCharge + couponDiscount, [total, deliverCharge, couponDiscount]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-neutral-600">{error || "Order not found"}</p>
          <Link href="/account/orders" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
            Back to orders
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        <ChevronLeft className="h-4 w-4" /> Orders
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold md:text-2xl">Order #{order.order_number || order.id}</h1>
                  {order.order_date && (
                    <p className="mt-1 text-sm text-neutral-500">{new Date(order.order_date).toLocaleString("en-BD")}</p>
                  )}
                </div>
                {order.status && <Badge>{order.status}</Badge>}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Order Date</p>
                  <p className="mt-1 font-semibold">{order.order_date ? new Date(order.order_date).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="rounded-lg border bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Payment Method</p>
                  <p className="mt-1 font-semibold">{order.payment_method || "N/A"}</p>
                </div>
                <div className="rounded-lg border bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Delivery Charge</p>
                  <p className="mt-1 font-semibold">{formatBDT(deliverCharge)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="border-b px-5 py-4">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Package className="h-4 w-4" /> Order Items
                </h2>
              </div>
              {order.items?.length ? (
                <div className="divide-y">
                  {order.items.map((item, idx) => {
                    const unitPrice = Number(item.final_unit_price ?? item.original_unit_price ?? 0);
                    const lineTotal = Number(item.total_price ?? unitPrice * Number(item.quantity || 1));
                    return (
                      <div key={idx} className="flex items-center gap-4 px-5 py-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-primary/10">
                          {item.product_image ? (
                            <Image src={item.product_image} alt={item.product_title || ""} fill className="object-cover" sizes="64px" />
                          ) : (
                            <ShoppingCart className="absolute inset-0 m-auto h-6 w-6 text-primary/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product_title || "Product"}</p>
                          {item.variant?.name && <p className="text-xs text-neutral-500">{item.variant.name}</p>}
                          <p className="mt-1 text-xs text-neutral-500">
                            Qty {item.quantity || 1} × {formatBDT(unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">{formatBDT(lineTotal)}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-neutral-500">No items in this order</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 font-semibold">Shipping Address</h2>
              <div className="flex items-start gap-2 text-sm text-neutral-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{order.shipping_address || "No address provided"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium">{formatBDT(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatBDT(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Delivery Charge</span>
                  <span className="font-medium">{formatBDT(deliverCharge)}</span>
                </div>
                <Separator />
                <div className="flex justify-between pt-1">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">{formatBDT(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
