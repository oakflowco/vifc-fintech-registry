"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Plan = "monthly" | "annual";

export function Paywall() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");

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

      {/* Plan Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
        {/* Monthly */}
        <button onClick={() => setSelectedPlan("monthly")} className="text-left">
          <Card
            className={`h-full transition-colors cursor-pointer ${
              selectedPlan === "monthly"
                ? "border-primary ring-1 ring-primary"
                : "hover:bg-muted/30"
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                250,000₫<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                30-day access, renew anytime
              </p>
            </CardContent>
          </Card>
        </button>

        {/* Annual */}
        <button onClick={() => setSelectedPlan("annual")} className="text-left">
          <Card
            className={`h-full transition-colors cursor-pointer border-primary/50 ${
              selectedPlan === "annual"
                ? "border-primary ring-1 ring-primary"
                : "hover:bg-muted/30"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Annual</CardTitle>
                <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/25 hover:bg-amber-500/15">
                  Save 500,000₫
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                2,500,000₫<span className="text-sm font-normal text-muted-foreground">/yr</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ~208,000₫/mo — best value
              </p>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Feature List */}
      <Card className="mb-8 text-left">
        <CardContent className="pt-6">
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
              {selectedPlan === "monthly"
                ? "30-day access per payment — renew anytime"
                : "365-day access — save 17% vs monthly"}
            </li>
          </ul>
        </CardContent>
      </Card>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading
          ? "Redirecting to MoMo..."
          : selectedPlan === "monthly"
            ? "Pay with MoMo — 250,000₫/mo"
            : "Pay with MoMo — 2,500,000₫/yr"}
      </button>

      <p className="text-xs text-muted-foreground mt-4">
        Secure payment via MoMo e-wallet.{" "}
        {selectedPlan === "monthly" ? "30-day" : "365-day"} access per payment.
      </p>
    </div>
  );
}
