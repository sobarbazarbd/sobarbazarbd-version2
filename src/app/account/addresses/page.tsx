"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function AccountAddressesPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-neutral-600">
          Please sign in to manage your address.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold md:text-2xl">Addresses</h1>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold">Default shipping address</h2>
          <div className="mt-4 grid gap-3">
            <Input defaultValue={user.customer?.shipping_address || ""} placeholder="Shipping address" />
            <Button className="w-fit">Save address</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
