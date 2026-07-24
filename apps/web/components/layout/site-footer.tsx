import { Container } from "@/components/ui/container";
import { SITE_CHROME_COPY } from "@/lib/site-chrome";
import type { Locale } from "@/lib/locales";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = SITE_CHROME_COPY[locale];
  const { footer } = copy;

  return (
    <footer className="border-t border-border bg-muted/40">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-semibold text-foreground">{copy.brandName}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{copy.brandTagline}</p>
        </div>

        <nav aria-label={footer.productHeading}>
          <h2 className="text-sm font-semibold text-foreground">{footer.productHeading}</h2>
          <ul className="mt-3 space-y-2">
            {footer.productLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={footer.resourcesHeading}>
          <h2 className="text-sm font-semibold text-foreground">{footer.resourcesHeading}</h2>
          <ul className="mt-3 space-y-2">
            {footer.resourcesLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={footer.languageHeading}>
          <h2 className="text-sm font-semibold text-foreground">{footer.languageHeading}</h2>
          <ul className="mt-3 space-y-2">
            {footer.languageLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  aria-current={item.href === `/${locale}` ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.copyright}</p>
        <div className="flex items-center gap-2">
          <span className="sr-only">{footer.legalHeading}</span>
          {footer.legalItems.map((label, index) => (
            <span key={label} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">·</span> : null}
              <span>
                {label}
                <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">{footer.legalComingSoonLabel}</span>
              </span>
            </span>
          ))}
        </div>
      </Container>
    </footer>
  );
}
