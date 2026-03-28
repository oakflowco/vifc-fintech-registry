"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/", label: "Registry" },
  { href: "/trends", label: "Trends", premium: true },
  { href: "/asean", label: "ASEAN" },
  { href: "/deals", label: "Deals" },
];

const registryDropdown = [
  { href: "/", label: "Fintech Companies" },
  { href: "/investors", label: "Investors & Funds" },
  { href: "/banks", label: "Banks & Members" },
  { href: "/securities", label: "Securities Firms" },
  { href: "/insurance", label: "Insurance" },
  { href: "/sandbox", label: "Regulatory Sandbox" },
];

const insightsDropdown = [
  { href: "/why-vietnam", label: "Why Vietnam?" },
  { href: "/vifc", label: "VIFC Da Nang" },
  { href: "/capital-markets", label: "Capital Markets" },
  { href: "/carbon", label: "Carbon Credits" },
  { href: "/market-size", label: "Market Size" },
  { href: "/investor-guide", label: "Investor Guide" },
  { href: "/regulators", label: "Regulators" },
  { href: "/risks", label: "Risks & Challenges" },
  { href: "/calendar", label: "Economic Calendar" },
];

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
          "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-accent-foreground"
        )}
      >
        {label}
        <svg className={cn("h-3 w-3 transition-transform", open && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border bg-card shadow-lg py-1 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
  const [user, setUser] = useState<UserState | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const registryActive = registryDropdown.some((i) => isActive(i.href));
  const insightsActive = insightsDropdown.some((i) => isActive(i.href));

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
              <p className="text-xs font-semibold leading-tight">Database</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Dropdown label="Registry" items={registryDropdown} isActive={registryActive} />

            {mainNav.filter((i) => i.href !== "/").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
                {"premium" in item && item.premium && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/15 px-1 py-0.5 text-[9px] font-semibold text-amber-500">
                    PRO
                  </span>
                )}
              </Link>
            ))}

            <Dropdown label="Insights" items={insightsDropdown} isActive={insightsActive} />

            {/* Auth */}
            <div className="ml-2 pl-2 border-l border-border">
              {user ? (
                <Link
                  href="/account"
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5",
                    isActive("/account")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {user.subscribed && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-md border"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-3 space-y-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Registry</p>
              <div className="flex flex-wrap gap-1.5">
                {registryDropdown.map((item) => (
                  <Link key={item.href} href={item.href} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Data & Analysis</p>
              <div className="flex flex-wrap gap-1.5">
                {mainNav.filter((i) => i.href !== "/").map((item) => (
                  <Link key={item.href} href={item.href} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {item.label}
                    {"premium" in item && item.premium && (
                      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-1 py-0.5 text-[9px] font-semibold text-amber-500">PRO</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Insights</p>
              <div className="flex flex-wrap gap-1.5">
                {insightsDropdown.map((item) => (
                  <Link key={item.href} href={item.href} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t">
              {user ? (
                <Link href="/account" className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
                  {user.subscribed && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                  My Account ({user.email})
                </Link>
              ) : (
                <Link href="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
