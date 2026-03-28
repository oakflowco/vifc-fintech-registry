"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Paywall() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/momo", { method: "POST" });
      const data = await res.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 text-center">
      <Badge variant="secondary" className="mb-4">
        Premium Feature
      </Badge>
      <h2 className="text-3xl font-bold tracking-tight mb-3">
        Vietnam Fintech Trends
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Comprehensive trendline analysis, investment flow data, category
        breakdowns, and regulatory insights — built for investors exploring
        Vietnam&apos;s fintech ecosystem.
      </p>

      <Card className="mb-8 text-left">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Full Access</span>
            <span className="text-2xl">250,000₫/mo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Fintech ecosystem growth trends (2017–2025)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Investment flow analysis — domestic vs foreign
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Category distribution & market share breakdown
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Regulatory milestone timeline
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Key performance metrics with YoY changes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              30-day access per payment — renew anytime
            </li>
          </ul>
        </CardContent>
      </Card>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Redirecting to MoMo..." : "Pay with MoMo — 250,000₫/mo"}
      </button>

      <p className="text-xs text-muted-foreground mt-4">
        Secure payment via MoMo e-wallet. 30-day access per payment.
      </p>
    </div>
  );
}
