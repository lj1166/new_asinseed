import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";

import "../globals.css";
import { LOCALES, type Locale } from "@/lib/locales";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

export const metadata: Metadata = {
  title: "ASINSeed",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function resolveHtmlLang(locale: string): string {
  // Legacy pages literally emit <html lang="zh"> for cn and <html lang="en">
  // for en — preserved verbatim rather than using the "zh-cn" locale code.
  return locale === "zh-cn" ? "zh" : "en";
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={resolveHtmlLang(locale)}>
      <body className={workSans.variable}>
        <SiteHeader locale={locale as Locale} />
        {children}
        <SiteFooter locale={locale as Locale} />
      </body>
    </html>
  );
}
