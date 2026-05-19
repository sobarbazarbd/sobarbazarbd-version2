import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Order Confirmed" };

export default function OrderSuccessPage() {
  return (
    <div className="container mt-10 flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      </div>
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">Order Placed Successfully!</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Thank you for shopping with us. We'll send a confirmation call/SMS shortly with delivery details.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/account/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  );
}
