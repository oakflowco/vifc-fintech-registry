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
  plan?: "monthly" | "annual";
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
            {user.subscribed && user.plan && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium capitalize">{user.plan}</span>
              </div>
            )}
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

        {/* Subscription — upgrade or renew */}
        {!user.subscribed && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Premium</CardTitle>
              <CardDescription>
                Choose a plan that works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plan cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Monthly */}
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium mb-1">Monthly</p>
                  <p className="text-xl font-bold">
                    250,000₫<span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">30-day access</p>
                </div>

                {/* Annual */}
                <div className="rounded-lg border border-primary/50 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Annual</p>
                    <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/25 hover:bg-amber-500/15 text-[10px] px-1.5 py-0">
                      Save 17%
                    </Badge>
                  </div>
                  <p className="text-xl font-bold">
                    2,500,000₫<span className="text-xs font-normal text-muted-foreground">/yr</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">~208,000₫/mo — save 500,000₫</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
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

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSubscribe}
                  disabled={payLoading}
                  className="w-full h-10 rounded-md bg-[#a50064] text-white text-sm font-medium hover:bg-[#8a0054] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {payLoading ? "Redirecting to MoMo..." : "Subscribe via MoMo"}
                </button>
                <a
                  href="/subscribe"
                  className="w-full h-10 rounded-md border text-sm font-medium flex items-center justify-center hover:bg-accent transition-colors"
                >
                  View full plan details
                </a>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment via MoMo e-wallet.
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
