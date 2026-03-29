"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PremiumGate({ feature }: { feature: string }) {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 text-center">
      <Badge variant="secondary" className="mb-4">
        Members Only
      </Badge>
      <h2 className="text-3xl font-bold tracking-tight mb-3">{feature}</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Create a free account to access full market intelligence, live data,
        trends analysis, and CSV exports.
      </p>

      <Card className="mb-8 text-left">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Free Account Includes</span>
            <Badge variant="default">Free</Badge>
          </CardTitle>
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
              CSV export — all registries
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              ASEAN comparison dashboard
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">&#10003;</span>
              Indicator detail pages with full data tables
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 px-8"
        >
          Sign Up — Free
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
