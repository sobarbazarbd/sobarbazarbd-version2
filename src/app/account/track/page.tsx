"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Truck, MapPin, CheckCircle2, Clock, Package } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, endpoints } from "@/lib/api";
import { formatBDT } from "@/lib/utils";

type TrackingHistoryItem = { status?: string; event?: string; date?: string; location?: string };

type TrackingOrder = {
  order_number?: string;
  status?: string;
  shipping_address?: string;
  payment_method?: string;
  items?: unknown[];
  total_amount?: number;
};

type TrackingData = {
  order?: TrackingOrder;
  tracking_history?: TrackingHistoryItem[];
};

const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

function activeStep(status?: string) {
  const map: Record<string, number> = { Placed: 0, Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 };
  return status ? map[status] ?? 0 : 0;
}

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrackingData | null>(null);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}${endpoints.orderTrack(trackingId.trim())}`, {
        headers: { "Content-Type": "application/json", Authorization: `JWT ${token || ""}` },
      });
      const json = await res.json();
      if (res.ok) {
        setData(json?.data ?? null);
        toast.success("Order found!");
      } else {
        setError(json?.error || "Order not found");
        toast.error(json?.error || "Order not found");
        setData(null);
      }
    } catch {
      setError("Failed to track order. Please try again.");
      toast.error("Failed to track order. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const order = data?.order;
  const step = activeStep(order?.status);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Track Your Order</h1>
        <p className="mt-1 text-sm text-neutral-500">Real-time tracking for your orders</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Enter Tracking ID</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your order tracking ID (e.g., ABC123XYZ0)"
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              />
              <Button onClick={handleTrack} disabled={loading} className="sm:w-auto">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track Order"}
              </Button>
            </div>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
            )}

            {order ? (
              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Order Status</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{order.status}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(step / 3) * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1 text-center">
                  {STEPS.map((label, idx) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                          idx <= step ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className={`text-[11px] ${idx <= step ? "font-semibold text-neutral-800" : "text-neutral-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>

                {data?.tracking_history && data.tracking_history.length > 0 && (
                  <div className="rounded-xl border bg-neutral-50 p-4">
                    <h3 className="mb-3 text-sm font-semibold">Delivery Timeline</h3>
                    <div className="space-y-3">
                      {data.tracking_history.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border bg-white">
                            {item.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : item.status === "in_progress" ? (
                              <Truck className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-amber-500" />
                            )}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{item.event}</p>
                            {item.date && <p className="text-xs text-neutral-500">{new Date(item.date).toLocaleString()}</p>}
                            {item.location && (
                              <p className="flex items-center gap-1 text-xs text-neutral-500">
                                <MapPin className="h-3 w-3" /> {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center py-8 text-center text-neutral-400">
                <Truck className="h-12 w-12" />
                <p className="mt-2 text-sm">Enter your tracking ID to see order details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {order && (
          <Card className="lg:self-start lg:sticky lg:top-24">
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-neutral-500">Tracking ID</p>
                  <p className="font-bold text-primary">#{order.order_number}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Delivery Address</p>
                  <p>{order.shipping_address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Payment Method</p>
                  <p>{order.payment_method || "N/A"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-neutral-500" />
                  <p>{order.items?.length || 0} Product{order.items?.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-neutral-500">Total Amount</p>
                  <p className="text-lg font-bold text-primary">{formatBDT(Number(order.total_amount || 0))}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
