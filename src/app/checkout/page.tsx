"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle2, Truck, CreditCard, Banknote, Loader2 } from "lucide-react";
import { trackInitiateCheckout, trackPurchase } from "@/components/meta-pixel";
import { API_BASE } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartItems,
    dropshippingItems,
    cartCount,
    checkout,
    deliveryZone,
    setDeliveryZone,
    loading,
  } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [payment, setPayment] = useState<"COD" | "OP">("COD");
  const [icFired, setIcFired] = useState(false);

  // Pre-fill from logged-in customer
  useEffect(() => {
    if (user?.customer) {
      setForm((f) => ({
        ...f,
        name: user.customer?.name || f.name,
        email: user.customer?.email || f.email,
        phone: user.customer?.phone || f.phone,
        address: user.customer?.shipping_address || f.address,
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((s, i) => s + Number(i.discounted_price || i.total_price || 0), 0);
  const exclusiveTotal = dropshippingItems.reduce((s, i) => s + Number(i.subtotal || 0), 0);
  const itemsTotal = subtotal + exclusiveTotal;
  const shipping = deliveryZone === "IN" ? (itemsTotal >= 1000 ? 0 : 60) : 120;
  const grandTotal = itemsTotal + shipping;

  // InitiateCheckout (once when items exist)
  useEffect(() => {
    if (icFired || cartCount === 0) return;
    const contents = [
      ...cartItems.map((i) => ({ id: i.product?.id ?? i.id, quantity: i.quantity })),
      ...dropshippingItems.map((i) => ({ id: i.product_id ?? i.id, quantity: i.quantity })),
    ].filter((c) => c.id != null);
    if (contents.length) {
      trackInitiateCheckout({ contents: contents as any, value: grandTotal });
      setIcFired(true);
    }
  }, [cartCount, cartItems, dropshippingItems, grandTotal, icFired]);

  const validate = () => {
    if (!user) {
      if (!form.name.trim()) return "Name required";
      if (!form.email.trim()) return "Email required";
    }
    if (!/^01[3-9]\d{8}$/.test(form.phone)) return "Valid BD phone required (01XXXXXXXXX)";
    if (!form.address.trim()) return "Address required";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    if (cartCount === 0) return toast.error("Cart is empty");

    setSubmitting(true);
    const result = await checkout({
      paymentMethod: payment,
      area: deliveryZone,
      shippingAddress: form.address,
      guestData: user ? null : { name: form.name, email: form.email, phone: form.phone },
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error || "Checkout failed");
      return;
    }

    // Fire Purchase pixel
    const contents = [
      ...cartItems.map((i) => ({ id: i.product?.id ?? i.id, quantity: i.quantity })),
      ...dropshippingItems.map((i) => ({ id: i.product_id ?? i.id, quantity: i.quantity })),
    ].filter((c) => c.id != null);
    trackPurchase({ contents: contents as any, value: grandTotal });

    if (result.paymentGatewayUrl) {
      toast.success("Redirecting to payment gateway...");
      window.location.href = result.paymentGatewayUrl;
    } else {
      toast.success("Order placed successfully!");
      router.push("/order-success");
    }
  };

  if (loading && cartCount === 0) {
    return (
      <div className="container mt-10 flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container mt-10 text-center">
        <p>Your cart is empty.</p>
        <Button asChild className="mt-4">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4 md:mt-8">
      <h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
      {!user && (
        <p className="mt-1 text-sm text-neutral-500">
          Checking out as guest.{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>{" "}
          to save your details.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5">
          {/* Contact */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold">1. Contact information</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!!user?.customer?.name}
                />
                <Input
                  placeholder="Phone (01XXXXXXXXX) *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="sm:col-span-2"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!user?.email}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold">2. Shipping address</h3>
              <div className="mt-3 space-y-3">
                <textarea
                  placeholder="House #, Road, Area, City *"
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                <div className="grid grid-cols-2 gap-3">
                  <DeliveryOption
                    active={deliveryZone === "IN"}
                    onClick={() => setDeliveryZone("IN")}
                    title="Inside Dhaka"
                    subtitle="1–2 days"
                    price="৳60 (Free over ৳1000)"
                  />
                  <DeliveryOption
                    active={deliveryZone === "OUT"}
                    onClick={() => setDeliveryZone("OUT")}
                    title="Outside Dhaka"
                    subtitle="2–4 days"
                    price="৳120"
                  />
                </div>

                <textarea
                  placeholder="Order notes (optional)"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold">3. Payment method</h3>
              <div className="mt-3 space-y-2">
                <PaymentOption
                  active={payment === "COD"}
                  onClick={() => setPayment("COD")}
                  icon={<Banknote className="h-5 w-5" />}
                  title="Cash on Delivery"
                  subtitle="Pay when you receive the order"
                />
                <PaymentOption
                  active={payment === "OP"}
                  onClick={() => setPayment("OP")}
                  icon={<CreditCard className="h-5 w-5 text-blue-500" />}
                  title="Online Payment (SSLCommerz)"
                  subtitle="Card, bKash, Nagad, Rocket — all supported"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-base font-bold">Order Summary</h3>
              <div className="mt-3 max-h-72 space-y-3 overflow-y-auto">
                {cartItems.map((item) => {
                  const img = item.variant?.image
                    ? item.variant.image.startsWith("http")
                      ? item.variant.image
                      : `${API_BASE}${item.variant.image}`
                    : item.product?.images?.[0]?.image || "";
                  return (
                    <div key={`r-${item.id}`} className="flex gap-3 text-sm">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-50">
                        {img && <Image src={img} alt="" fill className="object-contain p-1" sizes="56px" />}
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-2 text-xs font-medium">{item.product?.name}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold">
                        {formatBDT(Number(item.discounted_price || item.total_price || 0))}
                      </span>
                    </div>
                  );
                })}
                {dropshippingItems.map((item) => {
                  const img = item.product_image_url
                    ? item.product_image_url.startsWith("http")
                      ? item.product_image_url
                      : `${API_BASE}${item.product_image_url}`
                    : "";
                  return (
                    <div key={`d-${item.id}`} className="flex gap-3 text-sm">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-amber-50">
                        {img && <Image src={img} alt="" fill className="object-contain p-1" sizes="56px" />}
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-2 text-xs font-medium">{item.product_name}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold">{formatBDT(item.subtotal || 0)}</span>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">{formatBDT(itemsTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "FREE" : formatBDT(shipping)}</span>
                </div>
                <Separator />
                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatBDT(grandTotal)}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Placing order...
                  </>
                ) : (
                  <>Place Order — {formatBDT(grandTotal)}</>
                )}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <Truck className="h-3.5 w-3.5" /> Secure checkout, fast delivery
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

function DeliveryOption({
  active, onClick, title, subtitle, price,
}: { active: boolean; onClick: () => void; title: string; subtitle: string; price: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border-2 p-3 text-left transition ${
        active ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>
      <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
      <p className="mt-1 text-xs font-medium text-primary">{price}</p>
    </button>
  );
}

function PaymentOption({
  active, onClick, icon, title, subtitle,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition ${
        active ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
      {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
    </button>
  );
}
