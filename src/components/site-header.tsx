"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

// Navigation organized by user intent:
// Data = "Show me the companies"
// Markets = "Show me the landscape"
// Invest = "Help me decide and act"
// Trends PRO = The premium product

function getNavGroups(t: Dictionary["common"]) {
  const dataDropdown = [
    { href: "/", label: t.fintechCompanies },
    { href: "/investors", label: t.investors },
    { href: "/banks", label: t.banks },
    { href: "/securities", label: t.securities },
    { href: "/insurance", label: t.insurance },
    { href: "/neobanks", label: t.digitalBanks },
    { href: "/deals", label: t.deals },
  ];

  const marketsDropdown = [
    { href: "/capital-markets", label: t.capitalMarkets },
    { href: "/asean", label: "ASEAN Dashboard" },
    { href: "/commodities", label: t.commodities },
    { href: "/carbon", label: t.carbonCredits },
    { href: "/ratings", label: t.creditRatings },
  ];

  const investDropdown = [
    { href: "/why-vietnam", label: t.whyVietnam },
    { href: "/vifc", label: t.vifc },
    { href: "/investor-guide", label: t.investorGuide },
    { href: "/market-size", label: t.marketSize },
    { href: "/sandbox", label: t.sandbox },
    { href: "/regulators", label: t.regulators },
    { href: "/dfi", label: t.developmentFinance },
    { href: "/risks", label: t.risks },
    { href: "/calendar", label: t.calendar },
  ];

  return { dataDropdown, marketsDropdown, investDropdown };
}

interface UserState {
  email: string;
  subscribed: boolean;
}

function Dropdown({
  label,
  items,
  isActive,
}: {
  label: string;
  items: { href: string; label: string }[];
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors inline-flex items-center gap-1",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <svg className={cn("h-3 w-3 transition-transform", open && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 rounded-lg border bg-card shadow-lg py-1 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [user, setUser] = useState<UserState | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { dataDropdown, marketsDropdown, investDropdown } = getNavGroups(t.common);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dataActive = dataDropdown.some((i) => isActive(i.href));
  const marketsActive = marketsDropdown.some((i) => isActive(i.href));
  const investActive = investDropdown.some((i) => isActive(i.href));

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
              VIFC
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold leading-tight">VIFC</p>
              <p className="text-xs font-semibold leading-tight text-muted-foreground">Database</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            <Dropdown label="Data" items={dataDropdown} isActive={dataActive} />
            <Dropdown label="Markets" items={marketsDropdown} isActive={marketsActive} />
            <Dropdown label="Invest" items={investDropdown} isActive={investActive} />

            <Link
              href="/trends"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors inline-flex items-center gap-1.5",
                isActive("/trends")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.common.trends}
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-500">
                {t.common.pro}
              </span>
            </Link>

            {/* Auth */}
            <div className="ml-3 pl-3 border-l border-border">
              {user ? (
                <Link
                  href="/account"
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors inline-flex items-center gap-1.5",
                    isActive("/account")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {user.subscribed && <span className="h-2 w-2 rounded-full bg-green-500" />}
                  {t.common.account}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.login}
                </Link>
              )}
            </div>

            {/* Language */}
            <div className="ml-2 pl-2 border-l border-border">
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1.5">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center h-9 w-9 rounded-md border"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Data */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Data</p>
              <div className="flex flex-wrap gap-1.5">
                {dataDropdown.map((item) => (
                  <Link key={item.href} href={item.href} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Markets */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Markets</p>
              <div className="flex flex-wrap gap-1.5">
                {marketsDropdown.map((item) => (
                  <Link key={item.href} href={item.href} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Invest */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Invest</p>
              <div className="flex flex-wrap gap-1.5">
                {investDropdown.map((item) => (
                  <Link key={item.href} href={item.href} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trends + Auth */}
            <div className="pt-3 border-t flex items-center justify-between">
              <Link href="/trends" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent inline-flex items-center gap-1.5">
                {t.common.trends}
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-500">{t.common.pro}</span>
              </Link>
              {user ? (
                <Link href="/account" className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
                  {user.subscribed && <span className="h-2 w-2 rounded-full bg-green-500" />}
                  {t.common.account}
                </Link>
              ) : (
                <Link href="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                  {t.common.login}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
