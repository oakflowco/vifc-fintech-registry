import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { OrganizationSchema, WebSiteSchema } from "@/components/structured-data";
import { LocaleProvider } from "@/lib/i18n/context";
import { FooterLinks } from "@/components/footer-links";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vifcdatabase.com"),
  title: {
    default: "VIFC Database — Vietnam Financial Registry & Market Intelligence",
    template: "%s | VIFC Database",
  },
  description:
    "Vietnam's most comprehensive financial registry and market intelligence platform. Browse 300+ companies across fintech, banking, securities, insurance, and investment sectors. Live data, VIFC Da Nang insights, and ASEAN comparison.",
  keywords: [
    "VIFC",
    "VIFC Database",
    "Vietnam financial registry",
    "Vietnam International Financial Centre",
    "Da Nang",
    "Vietnam fintech",
    "Vietnam investors",
    "Vietnam banks",
    "Vietnam securities",
    "VIFC Da Nang",
    "Vietnam financial centre",
    "ASEAN finance",
    "Vietnam market intelligence",
    "VN-Index",
    "Vietnam FDI",
    "Vietnam capital markets",
  ],
  authors: [{ name: "VIFC Database" }],
  creator: "VIFC Database",
  publisher: "VIFC Database",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vifcdatabase.com",
    siteName: "VIFC Database",
    title: "VIFC Database — Vietnam Financial Registry & Market Intelligence",
    description:
      "Vietnam's most comprehensive financial registry. Browse 300+ companies, live market data, and VIFC Da Nang insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIFC Database — Vietnam Financial Registry & Market Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIFC Database — Vietnam Financial Registry & Market Intelligence",
    description:
      "Vietnam's most comprehensive financial registry. Browse 300+ companies, live market data, and VIFC Da Nang insights.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://vifcdatabase.com",
  },
  verification: {},
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("vifc_theme")?.value || "dark";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased${theme === "dark" ? " dark" : ""}`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <SiteHeader />
          <OrganizationSchema />
          <WebSiteSchema />
          <main className="flex-1">{children}</main>
          <footer className="border-t">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <FooterLinks />
            </div>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
