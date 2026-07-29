import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SITE_CHROME_COPY } from "@/lib/site-chrome";
import { getActiveLocaleOptions, type Locale } from "@/lib/locales";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = SITE_CHROME_COPY[locale];
  const activeLocales = getActiveLocaleOptions();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/10 bg-[#fffaf4]/90 backdrop-blur supports-[backdrop-filter]:bg-[#fffaf4]/75">
      <Container className="relative flex h-16 items-center justify-between">
        <a href={`/${locale}`} className="group flex items-center gap-2.5">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-[-.12em] text-primary-foreground transition group-hover:-rotate-6">AS</span>
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-[-.035em] text-brand-ink">{copy.brandName}</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">{copy.brandTagline}</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-brand-ink/70 transition hover:text-brand-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <div aria-label={copy.languageSwitchLabel} className="flex items-center gap-2 text-sm text-brand-ink/55">
            {activeLocales.map((activeLocale, index) => (
              <span key={activeLocale.route} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true" className="text-border">/</span> : null}
                {activeLocale.route === locale ? (
                  <span aria-current="page">{activeLocale.title}</span>
                ) : (
                  <a href={`/${activeLocale.route}`} className="hover:text-brand-ink">
                    {activeLocale.title}
                  </a>
                )}
              </span>
            ))}
          </div>
          <a
            href={copy.primaryCta.href}
            className="rounded-lg bg-brand-ink px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-ink/90"
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
