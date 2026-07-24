import Image from "next/image";

import type { PartnerLink } from "@/lib/homepage-content";

interface PartnersSectionProps {
  heading: string;
  partners: PartnerLink[];
}

export function PartnersSection({ heading, partners }: PartnersSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
        {partners.map((partner) => {
          const logo = (
            <Image src={partner.logoSrc} alt={partner.alt} width={120} height={60} className="h-auto w-full object-contain" />
          );

          if (!partner.href) {
            return (
              <div key={partner.name} className="flex items-center justify-center p-2" title={partner.name}>
                {logo}
              </div>
            );
          }

          return (
            <a
              key={partner.name}
              href={partner.href}
              target={partner.opensNewTab ? "_blank" : undefined}
              rel={partner.opensNewTab ? "noreferrer" : undefined}
              className="flex items-center justify-center p-2"
              title={partner.name}
            >
              {logo}
            </a>
          );
        })}
      </div>
    </section>
  );
}
