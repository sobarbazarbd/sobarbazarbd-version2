"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { AUTH_API_BASE, endpoints } from "@/lib/api";
import { toast } from "sonner";

export default function AccountAddressesPage() {
  const { user, refresh } = useAuth();
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAddress(user?.customer?.shipping_address || "");
  }, [user?.customer?.shipping_address]);

  const saveAddress = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${AUTH_API_BASE}${endpoints.authMe}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ customer: { shipping_address: address } }),
      });
      if (!res.ok) throw new Error("Address update failed");
      await refresh();
      toast.success("Address saved");
    } catch (err: any) {
      toast.error(err.message || "Could not save address");
    } finally {
      setSaving(false);
    }
  };

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
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shipping address" />
            <Button onClick={saveAddress} disabled={saving} className="w-fit">
              {saving ? "Saving..." : "Save address"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
