import Image from "next/image";

import { Section, SectionHeader } from "@/components/ui/section";
import type { HomepageCopy } from "@/lib/homepage-content";
import type { HomepageSectionsCopy } from "@/lib/homepage-content";

interface CapabilityShowcaseProps {
  header: HomepageSectionsCopy["capabilities"];
  features: HomepageCopy["features"];
  extension: HomepageCopy["extension"];
  video: HomepageCopy["video"];
}

export function CapabilityShowcase({ header, features, extension, video }: CapabilityShowcaseProps) {
  return (
    <Section id="capabilities" tone="muted">
      <SectionHeader eyebrow={header.eyebrow} title={header.title} description={header.description} />

      <div className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center gap-3 rounded-md border bg-background p-4 text-center">
            <Image src={feature.icon} alt="" width={40} height={40} />
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid items-center gap-8 sm:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-semibold">{extension.heading}</h3>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {extension.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <a
            href={extension.ctaHref}
            target={extension.ctaOpensNewTab ? "_blank" : undefined}
            rel={extension.ctaOpensNewTab ? "noreferrer" : undefined}
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {extension.ctaLabel}
          </a>
        </div>
        <Image
          src={extension.imageSrc}
          alt={extension.heading}
          width={480}
          height={320}
          className="h-auto w-full"
        />
      </div>

      <div className="mt-12 grid items-center gap-8 sm:grid-cols-2">
        <Image
          src={video.imageSrc}
          alt={video.heading}
          width={480}
          height={320}
          className="h-auto w-full sm:order-2"
        />
        <div className="sm:order-1">
          <h3 className="mb-4 text-xl font-semibold">{video.heading}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {video.bullets.map((bullet) => (
              <li key={bullet.text}>
                {bullet.text}
                {bullet.link ? (
                  <>
                    {" "}
                    <a
                      href={bullet.link.href}
                      target={bullet.link.opensNewTab ? "_blank" : undefined}
                      rel={bullet.link.opensNewTab ? "noreferrer" : undefined}
                      className="underline underline-offset-2"
                    >
                      {bullet.link.label}
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
