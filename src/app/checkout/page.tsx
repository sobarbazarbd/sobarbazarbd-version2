"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle2, Truck, CreditCard, Banknote, Loader2, Package, Bike } from "lucide-react";
import { trackInitiateCheckout, trackPurchase } from "@/components/meta-pixel";
import { pushBeginCheckout, type DLItem } from "@/components/gtm";
import { API_BASE, endpoints } from "@/lib/api";

const BD_PHONE = /^01[3-9]\d{8}$/;

const DELIVERY_LABELS: Record<string, { name: string; eta: string; icon: typeof Truck }> = {
  steadfast: { name: "Steadfast", eta: "2–3 business days", icon: Truck },
  pathao: { name: "Pathao", eta: "1–2 business days", icon: Bike },
  custom: { name: "Custom Delivery", eta: "Varies", icon: Package },
};

function buildCheckoutSchema(isGuest: boolean) {
  return z.object({
    name: isGuest ? z.string().trim().min(1, "Full name is required") : z.string().optional(),
    email: isGuest ? z.string().trim().min(1, "Email is required") : z.string().optional(),
    phone: z.string().trim().regex(BD_PHONE, "Enter a valid Bangladesh phone number (01XXXXXXXXX)"),
    address: z.string().trim().min(1, "Shipping address is required"),
    notes: z.string().optional(),
  });
}

type CheckoutFormValues = z.infer<ReturnType<typeof buildCheckoutSchema>>;

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
  const [payment, setPayment] = useState<"COD" | "OP">("COD");
  const [icFired, setIcFired] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const isGuest = !user;
  const schema = useMemo(() => buildCheckoutSchema(isGuest), [isGuest]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", address: "", notes: "" },
  });

  // Pre-fill from logged-in customer
  useEffect(() => {
    if (user?.customer) {
      reset({
        name: user.customer.name || "",
        email: user.customer.email || user.email || "",
        phone: user.customer.phone || "",
        address: user.customer.shipping_address || "",
        notes: "",
      });
    }
  }, [user, reset]);

  // Fetch available delivery methods (matches frontend/src/components/Checkout.jsx:66-76)
  useEffect(() => {
    fetch(`${API_BASE}${endpoints.deliveryMethods}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.methods?.length) {
          setAvailableMethods(data.methods);
          setSelectedDelivery(data.methods[0]);
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + Number(i.discounted_price || i.total_price || 0), 0);
  const exclusiveTotal = dropshippingItems.reduce((s, i) => s + Number(i.subtotal || 0), 0);
  const itemsTotal = subtotal + exclusiveTotal;
  const shipping = deliveryZone === "IN" ? (itemsTotal >= 1000 ? 0 : 60) : 120;
  const grandTotal = itemsTotal + shipping;

  const dlItems: DLItem[] = [
    ...cartItems.map((i) => ({
      id: i.product?.id ?? i.id,
      name: i.product?.name || "",
      price: Number(i.variant?.final_price || i.variant?.price || i.discounted_price || i.total_price || 0) / Math.max(1, i.quantity || 1),
      quantity: i.quantity,
      category: i.product?.category?.name || i.product?.short_description || "",
    })),
    ...dropshippingItems.map((i) => ({
      id: i.product_id ?? i.id,
      name: i.product_name || "",
      price: Number(i.unit_price) || 0,
      quantity: i.quantity,
      category: i.size || i.color || "",
    })),
  ].filter((c) => c.id != null);

  useEffect(() => {
    if (icFired || cartCount === 0) return;
    const contents = [
      ...cartItems.map((i) => ({ id: i.product?.id ?? i.id, quantity: i.quantity })),
      ...dropshippingItems.map((i) => ({ id: i.product_id ?? i.id, quantity: i.quantity })),
    ].filter((c) => c.id != null);
    if (contents.length) {
      trackInitiateCheckout({ contents: contents as any, value: grandTotal });
      pushBeginCheckout(dlItems, itemsTotal);
      setIcFired(true);
    }
  }, [cartCount, cartItems, dropshippingItems, grandTotal, icFired]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cartCount === 0) return toast.error("Cart is empty");

    setSubmitting(true);
    const result = await checkout({
      paymentMethod: payment,
      area: deliveryZone,
      shippingAddress: values.address,
      deliveryMethod: selectedDelivery,
      guestData: user ? null : { name: values.name || "", email: values.email || "", phone: values.phone },
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error || "Checkout failed");
      return;
    }

    const contents = [
      ...cartItems.map((i) => ({ id: i.product?.id ?? i.id, quantity: i.quantity })),
      ...dropshippingItems.map((i) => ({ id: i.product_id ?? i.id, quantity: i.quantity })),
    ].filter((c) => c.id != null);
    trackPurchase({ contents: contents as any, value: grandTotal });

    try {
      const orderObj = result.order || {};
      const txId =
        orderObj.transaction_id || orderObj.order_id || orderObj.id || orderObj.data?.id || orderObj.data?.order_id || orderObj.order?.id || "";
      const payload = {
        transactionId: String(txId || Date.now()),
        items: dlItems,
        value: grandTotal,
        shipping,
        tax: 0,
        newCustomer: !user,
        userData: {
          first_name: values.name?.split(" ")[0] || "",
          email: values.email || user?.email || "",
          street: values.address || "",
          city: "",
          region: deliveryZone === "IN" ? "BD-13" : "",
          postal_code: "",
          country: "BD",
        },
      };
      sessionStorage.setItem("dl_purchase", JSON.stringify(payload));
    } catch {
      /* ignore */
    }

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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5">
          {/* Contact */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold">1. Contact information</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    placeholder="Full name *"
                    disabled={!!user?.customer?.name}
                    {...register("name")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    placeholder="Phone (01XXXXXXXXX) *"
                    {...register("phone")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input
                    placeholder="Email"
                    type="email"
                    disabled={!!user?.email}
                    {...register("email")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold">2. Shipping address</h3>
              <div className="mt-3 space-y-3">
                <div>
                  <textarea
                    placeholder="House #, Road, Area, City *"
                    rows={3}
                    {...register("address")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                </div>

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

                {availableMethods.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-neutral-600">Delivery Method</p>
                    <div className="flex flex-col gap-2">
                      {availableMethods.map((method) => {
                        const info = DELIVERY_LABELS[method] || { name: method, eta: "", icon: Truck };
                        const Icon = info.icon;
                        const active = selectedDelivery === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedDelivery(method)}
                            className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition ${
                              active ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                              <Icon className="h-4 w-4 text-primary" />
                            </span>
                            <span className="flex-1">
                              <p className="text-sm font-semibold">{info.name}</p>
                              {info.eta && <p className="text-xs text-neutral-500">{info.eta}</p>}
                            </span>
                            {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <textarea
                  placeholder="Order notes (optional)"
                  rows={2}
                  {...register("notes")}
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
