"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { SiteNavLink } from "@/lib/site-chrome";

export interface MobileNavProps {
  nav: SiteNavLink[];
  primaryCta: SiteNavLink;
  openLabel: string;
  closeLabel: string;
}

export function MobileNav({ nav, primaryCta, openLabel, closeLabel }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="sm:hidden">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </Button>

      {open ? (
        <nav id="mobile-nav-menu" aria-label="Mobile" className="absolute inset-x-0 top-full z-40 border-b border-border bg-background px-4 py-4 shadow-sm">
          <ul className="flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-1 text-base font-medium text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={primaryCta.href}
                className="mt-1 block rounded-md bg-primary px-4 py-2 text-center text-base font-medium text-primary-foreground"
                onClick={() => setOpen(false)}
              >
                {primaryCta.label}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
