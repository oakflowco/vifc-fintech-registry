"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

export default function PrivacyPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">{t.common.privacyNotice}</h1>
        <p className="text-sm text-muted-foreground">
          VIFC Da Nang &mdash; Vietnam International Financial Centre
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated: January 1, 2026
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Data Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>We collect the following information when you use the VIFC Database platform:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Account Information:</strong> Email address and password when you register for an account.</li>
            <li><strong className="text-foreground">Payment Information:</strong> Payment details processed through MoMo for premium subscriptions. We do not store full payment credentials on our servers.</li>
            <li><strong className="text-foreground">Usage Data:</strong> Pages visited, search queries, features used, and interaction patterns to improve our service.</li>
            <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
            <li><strong className="text-foreground">Cookies:</strong> Session cookies, locale preferences (vifc_locale), and authentication tokens.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. How We Use Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Your data is used to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and maintain the VIFC Database platform and its features.</li>
            <li>Authenticate users and manage premium subscriptions.</li>
            <li>Personalize your experience, including language preferences.</li>
            <li>Aggregate anonymized analytics to improve the platform.</li>
            <li>Communicate service updates and important notices.</li>
            <li>Comply with legal obligations under Vietnamese law.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>We use the following cookies:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">vifc_locale:</strong> Stores your preferred language setting (1 year expiry).</li>
            <li><strong className="text-foreground">vifc_session:</strong> Authentication session cookie (secure, httpOnly).</li>
            <li><strong className="text-foreground">Analytics cookies:</strong> Anonymous usage statistics to improve the platform.</li>
          </ul>
          <p>You can clear cookies at any time through your browser settings. Disabling cookies may affect platform functionality.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>The VIFC Database integrates with the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Registry Data API:</strong> Used to fetch and synchronize registry data from official sources.</li>
            <li><strong className="text-foreground">World Bank API:</strong> Economic indicators and development data for Vietnam and ASEAN countries.</li>
            <li><strong className="text-foreground">Yahoo Finance:</strong> Stock market data, exchange rates, and financial metrics.</li>
            <li><strong className="text-foreground">Google News:</strong> Aggregated news articles related to Vietnam&apos;s financial sector.</li>
            <li><strong className="text-foreground">MoMo Payment Gateway:</strong> Payment processing for premium subscriptions (250,000 VND/month).</li>
          </ul>
          <p>Each third-party service has its own privacy policy. We encourage you to review their respective policies.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>We retain your data as follows:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Account data:</strong> Retained while your account is active. Deleted within 30 days of account closure.</li>
            <li><strong className="text-foreground">Payment records:</strong> Retained for 5 years as required by Vietnamese tax regulations.</li>
            <li><strong className="text-foreground">Usage analytics:</strong> Anonymized data retained indefinitely for service improvement. Personally identifiable data deleted after 12 months.</li>
            <li><strong className="text-foreground">Cookies:</strong> Session cookies expire on browser close. Preference cookies expire after 1 year.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Under applicable data protection laws, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data.</li>
            <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate data.</li>
            <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
            <li><strong className="text-foreground">Portability:</strong> Receive your data in a structured, machine-readable format.</li>
            <li><strong className="text-foreground">Objection:</strong> Object to processing of your data for specific purposes.</li>
          </ul>
          <p>To exercise any of these rights, contact us at the address below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>For privacy-related inquiries, please contact:</p>
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
