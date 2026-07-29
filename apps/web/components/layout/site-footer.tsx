import { Container } from "@/components/ui/container";
import { SITE_CHROME_COPY } from "@/lib/site-chrome";
import { getActiveLocaleOptions, type Locale } from "@/lib/locales";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = SITE_CHROME_COPY[locale];
  const { footer } = copy;
  const activeLocales = getActiveLocaleOptions();

  return (
    <footer className="border-t border-brand-ink/10 bg-brand-ink text-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-[-.12em] text-primary-foreground">AS</span>
            <p className="text-base font-semibold tracking-[-.03em] text-white">{copy.brandName}</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">{copy.brandTagline}</p>
        </div>

        <nav aria-label={footer.productHeading}>
          <h2 className="text-sm font-semibold text-white">{footer.productHeading}</h2>
          <ul className="mt-3 space-y-2">
            {footer.productLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-white/55 transition hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={footer.resourcesHeading}>
          <h2 className="text-sm font-semibold text-white">{footer.resourcesHeading}</h2>
          <ul className="mt-3 space-y-2">
            {footer.resourcesLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-white/55 transition hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={footer.languageHeading}>
          <h2 className="text-sm font-semibold text-white">{footer.languageHeading}</h2>
          <ul className="mt-3 space-y-2">
          {activeLocales.map((activeLocale) => (
            <li key={activeLocale.route}>
              <a
                  href={`/${activeLocale.route}`}
                  className="text-sm text-white/55 transition hover:text-primary"
                  aria-current={activeLocale.route === locale ? "page" : undefined}
                >
                  {activeLocale.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.copyright}</p>
        <div className="flex items-center gap-2">
          <span className="sr-only">{footer.legalHeading}</span>
          {footer.legalItems.map((label, index) => (
            <span key={label} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">·</span> : null}
              <span>
                {label}
                <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/55">{footer.legalComingSoonLabel}</span>
              </span>
            </span>
          ))}
        </div>
      </Container>
    </footer>
  );
}
