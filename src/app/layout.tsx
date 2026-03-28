import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
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
  title: "VIFC Database",
  description:
    "Directory of fintech companies, investors, and banks registered with Vietnam International Financial Centre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <SiteHeader />
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
