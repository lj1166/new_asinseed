import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SITE_CHROME_COPY } from "@/lib/site-chrome";
import { getActiveLocaleOptions, type Locale } from "@/lib/locales";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = SITE_CHROME_COPY[locale];
  const activeLocales = getActiveLocaleOptions();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="relative flex h-16 items-center justify-between">
        <a href={`/${locale}`} className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">{copy.brandName}</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">{copy.brandTagline}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <div aria-label={copy.languageSwitchLabel} className="flex items-center gap-2 text-sm text-foreground/70">
            {activeLocales.map((activeLocale, index) => (
              <span key={activeLocale.route} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true" className="text-border">/</span> : null}
                {activeLocale.route === locale ? (
                  <span aria-current="page">{activeLocale.title}</span>
                ) : (
                  <a href={`/${activeLocale.route}`} className="hover:text-foreground">
                    {activeLocale.title}
                  </a>
                )}
              </span>
            ))}
          </div>
          <a
            href={copy.primaryCta.href}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {copy.primaryCta.label}
          </a>
        </div>

        <MobileNav
          nav={copy.nav}
          primaryCta={copy.primaryCta}
          openLabel={copy.mobileMenuOpenLabel}
          closeLabel={copy.mobileMenuCloseLabel}
        />
      </Container>
    </header>
  );
}
