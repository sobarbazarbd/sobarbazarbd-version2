"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();

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
        <CardContent className="space-y-4 p-6">
          <div>
            <h2 className="text-sm font-semibold">Account</h2>
            <p className="mt-1 text-sm text-neutral-600">{user.email || user.username}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
