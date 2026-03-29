"use client";

import { useState } from "react";

export function CompanyProfileLogo({
  domain,
  name,
}: {
  domain: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-lg font-bold text-muted-foreground">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt={`${name} logo`}
      width={56}
      height={56}
      className="h-14 w-14 shrink-0 rounded-xl border border-border/50 bg-muted object-contain p-1"
      onError={() => setFailed(true)}
    />
  );
}
