"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserData {
  id: string;
  email: string;
  subscribed: boolean;
  expiresAt: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
        }
        setLoading(false);
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight mb-6">My Account</h1>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-mono">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Access</span>
              <Badge variant="default">Full Access</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Your Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/trends"
              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">Trends & Market Intelligence</p>
                <p className="text-xs text-muted-foreground">Live data, charts, and news</p>
              </div>
              <span className="text-muted-foreground">&rarr;</span>
            </a>
            <a
              href="/registry"
              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">Registry</p>
                <p className="text-xs text-muted-foreground">All fintech, banks, investors data</p>
              </div>
              <span className="text-muted-foreground">&rarr;</span>
            </a>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["fintech", "investors", "banks"].map((type) => (
                <a
                  key={type}
                  href={`/api/export?type=${type}`}
                  className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 transition-colors text-sm"
                >
                  <span className="text-muted-foreground">&darr;</span>
                  Export {type.charAt(0).toUpperCase() + type.slice(1)} CSV
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
