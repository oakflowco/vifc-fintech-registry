"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, transactionId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setTempPassword(data.tempPassword || null);
    setIsNew(data.isNew);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-4">
              <span className="text-green-500 text-2xl">&#10003;</span>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">
                {isNew ? "Account Created & Activated!" : "Subscription Renewed!"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isNew
                  ? "Your premium account is ready. Use the credentials below to login."
                  : "Your subscription has been extended for 30 days."}
              </p>
            </div>

            {isNew && tempPassword && (
              <div className="rounded-lg border bg-muted/50 p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold text-center">Your Login Credentials</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-mono font-medium">{email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Password</span>
                    <span className="text-sm font-mono font-medium bg-primary/10 px-2 py-0.5 rounded">{tempPassword}</span>
                  </div>
                </div>
                <p className="text-[10px] text-destructive text-center">
                  Save this password — it won&apos;t be shown again!
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <a
                href="/login"
                className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                {isNew ? "Login Now" : "Go to Account"}
              </a>
              <a
                href="/trends"
                className="w-full h-10 rounded-md border text-sm font-medium flex items-center justify-center hover:bg-accent transition-colors"
              >
                View Trends
              </a>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Transaction ID: <span className="font-mono">{transactionId}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-3">Premium Access</Badge>
          <h1 className="text-2xl font-bold tracking-tight">Subscribe via MoMo</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Get full access to Trends, Market Intelligence, and CSV exports
          </p>
        </div>

        {/* Pricing */}
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl">250,000₫<span className="text-base font-normal text-muted-foreground">/month</span></CardTitle>
            <CardDescription>~$10 USD · 30-day access</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span>
                Vietnam Fintech Trends — live charts & analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span>
                VN-Index, GDP, FDI live data (World Bank + Yahoo Finance)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span>
                Live news feed — fintech, crypto, IFC updates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span>
                CSV export — all registries (Fintech, Banks, Investors, etc.)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span>
                Indicator detail pages with full data tables
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 1: Pay */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              Pay via MoMo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-48 h-48 rounded-lg border-2 border-[#a50064] overflow-hidden bg-white flex items-center justify-center">
                {/* Replace with your actual MoMo QR code image */}
                {/* Put your QR code image at: public/momo-qr.png */}
                <Image
                  src="/momo-qr.png"
                  alt="MoMo QR Code"
                  width={192}
                  height={192}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-center p-4"><p class="text-sm font-semibold text-[#a50064]">MoMo QR Code</p><p class="text-xs text-gray-500 mt-1">Add your QR at public/momo-qr.png</p></div>';
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: "#a50064" }}>MoMo Transfer</p>
                <p className="text-lg font-bold font-mono mt-1">{process.env.NEXT_PUBLIC_MOMO_PHONE || "0XX XXX XXXX"}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{process.env.NEXT_PUBLIC_MOMO_NAME || "VIFC Database"}</p>
              </div>
            </div>

            {/* Transfer Info */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">250,000₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer note:</span>
                <span className="font-mono text-xs">VIFC [your email]</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Submit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
              Confirm Payment
            </CardTitle>
            <CardDescription>
              After paying, enter your email and MoMo transaction ID below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="MoMo Transaction ID (from receipt)"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-md text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: "#a50064" }}
              >
                {loading ? "Submitting..." : "I've Paid — Activate My Account"}
              </button>
            </form>

            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Your account will be activated within 24 hours after payment verification.
              Login credentials sent to your email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
