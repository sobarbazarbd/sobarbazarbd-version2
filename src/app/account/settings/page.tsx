"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AUTH_API_BASE, endpoints } from "@/lib/api";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const { user, loading, logout, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.customer?.name || "",
        phone: user.customer?.phone || "",
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
        body: JSON.stringify({ customer: { name: form.name, phone: form.phone } }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Profile updated");
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not update profile");
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
        <CardContent className="p-6 text-center text-sm text-neutral-600">
          Please sign in to manage account settings.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold md:text-2xl">Settings</h1>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold">Personal information</h2>
          <form onSubmit={onSave} className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input placeholder="Email" type="email" value={user.email || user.username} disabled title="Email cannot be changed" />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
      <Card>
        <CardContent className="space-y-3 p-6">
          <h2 className="text-sm font-semibold">Account</h2>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
