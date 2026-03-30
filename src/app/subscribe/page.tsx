import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description: "Choose a plan to unlock premium market intelligence, trends, and data exports.",
};

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-3">Premium Access</Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Plans & Pricing</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Start free with the registry and dashboard. Upgrade for trends, intelligence, and data exports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Free */}
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Explore the registry and dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold">$0</p>
              <p className="text-xs text-muted-foreground mt-1">No credit card required</p>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Browse all 6 registries (preview — 10 rows)",
                "Vietnam at a Glance dashboard",
                "Company profiles with logos",
                "ASEAN comparison data",
                "Investor guide & VIFC info",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="w-full h-10 rounded-md border text-sm font-medium flex items-center justify-center hover:bg-muted transition-colors"
            >
              Get Started
            </Link>
          </CardContent>
        </Card>

        {/* Premium */}
        <Card className="border-primary/50 ring-1 ring-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Premium</CardTitle>
              <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/25 hover:bg-amber-500/15 text-[10px]">
                Most Popular
              </Badge>
            </div>
            <CardDescription>Full access to everything</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold">
                250,000₫<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ~$10 USD &middot; Annual plan available (save 17%)
              </p>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Full registry access — all rows, all sectors",
                "Vietnam Fintech Trends & live charts",
                "Interactive bubble map & ecosystem analysis",
                "VN-Index, GDP, FDI live data",
                "Live news feed — fintech, crypto, IFC",
                "CSV export — all registries",
                "Indicator detail pages with full data",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="mailto:hello@vifcdatabase.com?subject=Premium%20Subscription"
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              Contact Us to Subscribe
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise */}
      <Card className="bg-muted/20">
        <CardContent className="py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">Enterprise & Institutional</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                API access, custom reports, white-label solutions, and bulk data licensing
                for financial institutions, research firms, and consultancies.
              </p>
            </div>
            <a
              href="mailto:hello@vifcdatabase.com?subject=Enterprise%20Inquiry"
              className="shrink-0 h-10 rounded-md border px-6 text-sm font-medium flex items-center justify-center hover:bg-muted transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </CardContent>
      </Card>

      <p className="text-[10px] text-muted-foreground text-center mt-8">
        All plans include access to the VIFC Database platform. Prices in Vietnamese Dong (VND).
        Enterprise pricing is custom — reach out for a quote.
      </p>
    </div>
  );
}
