"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";

export function FooterLinks() {
  const { t } = useLocale();

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground text-center">
        {t.footer.description}
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/privacy"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.footer.privacy}
        </Link>
        <span className="text-xs text-muted-foreground">|</span>
        <Link
          href="/partner"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Partner with Us
        </Link>
        <span className="text-xs text-muted-foreground">|</span>
        <Link
          href="/terms"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.footer.terms}
        </Link>
      </div>
    </div>
  );
}
