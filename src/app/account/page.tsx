"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AUTH_API_BASE, endpoints } from "@/lib/api";
import { toast } from "sonner";

export default function AccountProfilePage() {
  const { user, loading, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shipping_address: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.customer?.name || "",
        email: user.email || user.customer?.email || "",
        phone: user.customer?.phone || "",
        shipping_address: user.customer?.shipping_address || "",
      });
    }
  }, [user]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${AUTH_API_BASE}${endpoints.authMe}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            shipping_address: form.shipping_address,
          },
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Profile updated");
      await refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold md:text-2xl">My Profile</h1>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold">Personal information</h2>
          <form onSubmit={onSave} className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              disabled
              title="Email cannot be changed"
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Shipping address"
              className="sm:col-span-2"
              value={form.shipping_address}
              onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
            />
            <Button type="submit" disabled={saving} className="sm:col-span-2 sm:w-auto">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
