"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/context";
import { RegistryTable } from "@/components/registry-table";
import type { RegistryEntry } from "@/lib/sheets";

interface TabData {
  key: string;
  label: string;
  headers: string[];
  data: RegistryEntry[];
  exportType: string;
}

interface RegistryTabsProps {
  tabs: TabData[];
  isPremium: boolean;
}

export function RegistryTabs({ tabs, isPremium }: RegistryTabsProps) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTab = searchParams.get("tab") || tabs[0]?.key || "fintech";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab state with URL
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && tabs.some((tab) => tab.key === urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams, tabs]);

  const handleTabChange = useCallback(
    (key: string) => {
      setActiveTab(key);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.key === activeTab) || tabs[0],
    [tabs, activeTab]
  );

  if (!currentTab) return null;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 min-w-max border-b">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const count = tab.data.length;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                  "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-md",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-mono",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active tab content */}
      {currentTab.data.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No data available for this registry. Check the environment variable configuration.
          </p>
        </div>
      ) : (
        <RegistryTable
          headers={currentTab.headers}
          data={currentTab.data}
          exportType={currentTab.exportType}
          isPremium={isPremium}
        />
      )}
    </div>
  );
}
