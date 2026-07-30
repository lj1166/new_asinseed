import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Work_Sans } from "next/font/google";

import "../globals.css";
import { getLocaleConfig, isActiveLocale, LOCALES } from "@/lib/locales";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

export const metadata: Metadata = {
  title: "ASINSeed",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://asinseed.com"),
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isActiveLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const localeConfig = getLocaleConfig(locale);

  return (
    <html lang={localeConfig.htmlLang}>
      <body className={workSans.variable}>
        <SiteHeader locale={locale} />
        {children}
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
