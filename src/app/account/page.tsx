"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [payLoading, setPayLoading] = useState(false);

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

  async function handleSubscribe() {
    setPayLoading(true);
    const res = await fetch("/api/momo", { method: "POST" });
    const data = await res.json();
    setPayLoading(false);

    if (data.payUrl) {
      window.location.href = data.payUrl;
    } else {
      alert(data.error || "Payment failed. Please configure MoMo keys.");
    }
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
              <span className="text-sm text-muted-foreground">Status</span>
              {user.subscribed ? (
                <Badge variant="default">Premium</Badge>
              ) : (
                <Badge variant="secondary">Free</Badge>
              )}
            </div>
            {user.subscribed && user.expiresAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="text-sm font-mono">
                  {new Date(user.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription */}
        {!user.subscribed && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Premium</CardTitle>
              <CardDescription>
                Unlock all features for 250,000₫/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span>
                  Vietnam Fintech Trends & Market Intelligence
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span>
                  Live VN-Index, GDP, FDI data from World Bank
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span>
                  Export CSV — Fintech, Investors, Banks registries
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span>
                  Live news feed — fintech, crypto, IFC updates
                </li>
              </ul>
              <button
                onClick={handleSubscribe}
                disabled={payLoading}
                className="w-full h-10 rounded-md bg-[#a50064] text-white text-sm font-medium hover:bg-[#8a0054] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {payLoading ? (
                  "Redirecting to MoMo..."
                ) : (
                  <>
                    Pay with MoMo — 250,000₫/month
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Secure payment via MoMo e-wallet. 30-day access per payment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Premium Features */}
        {user.subscribed && (
          <Card>
            <CardHeader>
              <CardTitle>Premium Features</CardTitle>
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
                <span className="text-muted-foreground">→</span>
              </a>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {["fintech", "investors", "banks"].map((type) => (
                  <a
                    key={type}
                    href={`/api/export?type=${type}`}
                    className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 transition-colors text-sm"
                  >
                    <span className="text-muted-foreground">↓</span>
                    Export {type.charAt(0).toUpperCase() + type.slice(1)} CSV
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
