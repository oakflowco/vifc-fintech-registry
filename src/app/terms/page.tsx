"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">{t.common.termsOfUse}</h1>
        <p className="text-sm text-muted-foreground">
          VIFC Da Nang &mdash; Vietnam International Financial Centre
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated: January 1, 2026
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            By accessing or using the VIFC Database platform (&quot;Service&quot;), you agree to be bound by these Terms of Use.
            If you do not agree to these terms, you must not use the Service.
          </p>
          <p>
            We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Service Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>The VIFC Database is a comprehensive financial data platform that provides:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Registry:</strong> Directory of fintech companies, investors, banks, securities firms, insurance companies, digital banks, and regulatory sandbox participants operating in Vietnam.</li>
            <li><strong className="text-foreground">Trends & Analytics:</strong> Market trends, stock data, economic indicators, and financial analysis for Vietnam and the ASEAN region.</li>
            <li><strong className="text-foreground">Deals & News:</strong> Aggregated news coverage and deal tracking for Vietnam&apos;s financial sector.</li>
            <li><strong className="text-foreground">Insights:</strong> Research on capital markets, commodities, carbon credits, credit ratings, development finance, and regulatory frameworks.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. User Accounts & Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>The Service offers two tiers of access:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Free Access:</strong> Basic registry data, limited trend data, and general insights are available without an account.</li>
            <li><strong className="text-foreground">Premium Subscription:</strong> Full access to all trends, advanced analytics, deal data, and export features requires a paid subscription.</li>
          </ul>
          <p>You are responsible for maintaining the security of your account credentials. You must not share your account with others.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Premium subscriptions are billed as follows:</p>
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p><strong className="text-foreground">Price:</strong> 250,000 VND per month</p>
            <p><strong className="text-foreground">Payment Method:</strong> MoMo digital wallet</p>
            <p><strong className="text-foreground">Billing Cycle:</strong> Monthly, recurring</p>
            <p><strong className="text-foreground">Cancellation:</strong> You may cancel at any time. Access continues until the end of the current billing period.</p>
          </div>
          <p>Refunds are not provided for partial months. In case of billing errors, contact us within 7 days for resolution.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Data Accuracy Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            IMPORTANT: The data provided on this platform is sourced from public registries, government databases, and third-party APIs. It is provided &quot;as is&quot; and should not be construed as financial advice.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Data is aggregated from official registries, World Bank API, Yahoo Finance, and other public sources.</li>
            <li>We make reasonable efforts to ensure accuracy but cannot guarantee that all data is current, complete, or error-free.</li>
            <li>Financial data may be delayed or differ from real-time market values.</li>
            <li>Always verify information independently before making investment decisions.</li>
            <li>This platform does not provide investment recommendations or financial advisory services.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            The VIFC Database platform, including its design, features, and original content, is the intellectual property of the Vietnam International Financial Centre, Da Nang.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may use exported data (CSV) for personal or internal business purposes.</li>
            <li>Redistribution, resale, or systematic scraping of platform data is prohibited.</li>
            <li>Third-party data (World Bank, Yahoo Finance, etc.) remains the property of their respective owners.</li>
            <li>The VIFC name, logo, and branding may not be used without written permission.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            To the maximum extent permitted by law, VIFC Da Nang shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use or inability to use the Service.</li>
            <li>Errors, inaccuracies, or omissions in the data provided.</li>
            <li>Investment decisions made based on information from this platform.</li>
            <li>Unauthorized access to or alteration of your account.</li>
            <li>Service interruptions, downtime, or data loss.</li>
          </ul>
          <p>
            Our total liability for any claim shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Governing Law</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            These Terms of Use are governed by and construed in accordance with the laws of the Socialist Republic of Vietnam.
          </p>
          <p>
            Any disputes arising from or related to these terms shall be resolved through negotiation first. If negotiation fails, disputes shall be submitted to the competent courts in Da Nang, Vietnam.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>For questions about these terms, please contact:</p>
          <div className="rounded-lg bg-muted/50 p-4 space-y-1">
            <p className="text-foreground font-medium">Vietnam International Financial Centre (VIFC)</p>
            <p>Da Nang, Vietnam</p>
            <p>Email: <a href="mailto:ifc@danang.gov.vn" className="text-primary hover:underline">ifc@danang.gov.vn</a></p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to VIFC Database
        </Link>
      </div>
    </div>
  );
}
