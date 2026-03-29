import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Partner with VIFC Database",
  description:
    "Partner with Vietnam's most comprehensive financial data platform. Data partnerships, institutional collaborations, and technology integrations.",
};

const partnerships = [
  {
    title: "Data Partners",
    description:
      "Share official registry data, statistics, and regulatory updates. Your data reaches global investors in 6 languages.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    title: "Institutional Partners",
    description:
      "Government agencies, financial regulators, and industry associations. Co-brand reports and analysis.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
        />
      </svg>
    ),
  },
  {
    title: "Technology Partners",
    description:
      "API integrations, data feeds, and embedded analytics for your platform.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    ),
  },
];

const offerings = [
  "Real-time dashboard with macro indicators",
  "7 financial registries covering 300+ entities",
  "6 language translations for global reach",
  "ASEAN comparison benchmarks",
  "Live market data from Yahoo Finance & World Bank",
  "Deal tracker with investment flow analysis",
];

export default function PartnerPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <Badge variant="secondary" className="mb-6">
            Partnerships
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Partner with VIFC Database
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            We&apos;re building Vietnam&apos;s most comprehensive financial data
            platform. Let&apos;s work together.
          </p>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Partnership opportunities
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Whether you have data, reach, or technology — there&apos;s a way to
            collaborate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerships.map((p) => (
            <Card key={p.title} className="h-full">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  {p.icon}
                </div>
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What We Offer */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What we bring to the table
            </h2>
            <p className="mt-4 text-muted-foreground">
              A production-grade platform already serving financial data to a
              global audience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offerings.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-border/50 bg-background p-4"
              >
                <span className="mt-0.5 text-green-500 shrink-0">
                  &#10003;
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get in touch
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Interested in partnering? We&apos;d love to hear from you. Reach out
            and let&apos;s explore how we can work together.
          </p>
          <div className="mt-8">
            <a
              href="mailto:contact@vifcdatabase.com"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              contact@vifcdatabase.com
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            We typically respond within 48 hours.
          </p>
        </div>
      </section>
    </div>
  );
}
