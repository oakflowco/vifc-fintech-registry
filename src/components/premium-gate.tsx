"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PremiumGate({ feature }: { feature: string }) {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 text-center">
      <Badge variant="secondary" className="mb-4">
        Premium Feature
      </Badge>
      <h2 className="text-3xl font-bold tracking-tight mb-3">{feature}</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        This feature requires a premium subscription. Get full access to trends,
        market intelligence, live data, and CSV exports.
      </p>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
        {/* Monthly */}
        <Link href="/subscribe" className="block">
          <Card className="h-full hover:bg-muted/30 transition-colors cursor-pointer">
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
        </Link>

        {/* Annual */}
        <Link href="/subscribe" className="block">
          <Card className="h-full hover:bg-muted/30 transition-colors cursor-pointer border-primary/50">
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
        </Link>
      </div>

      {/* Feature List */}
      <Card className="mb-8 text-left">
        <CardHeader>
          <CardTitle>What&apos;s included</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Vietnam Fintech Trends — live charts & analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              VN-Index, GDP, FDI live data
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Live news feed — fintech, crypto, IFC updates
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              CSV export — download Fintech, Investors, Banks data, reports
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/subscribe"
          className="inline-flex h-12 items-center justify-center rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90 px-8"
          style={{ backgroundColor: "#a50064" }}
        >
          View Plans & Subscribe
        </Link>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-lg border px-8 text-sm font-medium transition-colors hover:bg-accent"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
