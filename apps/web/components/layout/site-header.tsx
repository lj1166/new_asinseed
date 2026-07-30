import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SITE_CHROME_COPY } from "@/lib/site-chrome";
import { getActiveLocaleOptions, type Locale } from "@/lib/locales";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = SITE_CHROME_COPY[locale];
  const activeLocales = getActiveLocaleOptions();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/15 bg-[#f5f0e8]">
      <Container className="relative flex h-14 items-center justify-between sm:h-16">
        <a href={"/" + locale} className="group flex items-center gap-2.5">
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center bg-primary text-[10px] font-black tracking-[-.12em] text-primary-foreground transition group-hover:-rotate-3">AS</span>
          <span className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-[-.035em] text-brand-ink sm:text-lg">{copy.brandName}</span>
            <span className="hidden text-xs text-brand-ink/52 md:inline">{copy.brandTagline}</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} className="border-b border-transparent py-1 text-sm font-medium text-brand-ink/68 transition hover:border-primary hover:text-brand-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <div aria-label={copy.languageSwitchLabel} className="flex items-center gap-2 text-xs text-brand-ink/52">
            {activeLocales.map((activeLocale, index) => (
              <span key={activeLocale.route} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true" className="text-brand-ink/28">/</span> : null}
                {activeLocale.route === locale ? <span aria-current="page">{activeLocale.title}</span> : <a href={"/" + activeLocale.route} className="hover:text-brand-ink">{activeLocale.title}</a>}
              </span>
            ))}
          </div>
          <a href={copy.primaryCta.href} className="border border-brand-ink bg-primary px-4 py-2 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:bg-[#e88400]">
            {copy.primaryCta.label}
          </a>
        </div>

        <MobileNav nav={copy.nav} primaryCta={copy.primaryCta} openLabel={copy.mobileMenuOpenLabel} closeLabel={copy.mobileMenuCloseLabel} />
      </Container>
    </header>
  );
}
