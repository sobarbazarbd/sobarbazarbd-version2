import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Order Failed" };

export default function OrderFailedPage() {
  return (
    <div className="container mt-10 flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">Payment Failed</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Something went wrong while processing your payment. Your order was not placed. Please try again or choose a different payment method.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/checkout">Try Again</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        Need help?{" "}
        <Link href="/contact" className="font-medium text-primary hover:underline">
          Contact Support
        </Link>
      </p>
    </div>
  );
}
