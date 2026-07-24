"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { SuggestionItem, SuggestionResponse } from "@new-asinseed/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HomepageCopy, StationOption } from "@/lib/homepage-content";
import type { Locale } from "@/lib/locales";

interface SearchFormProps {
  locale: Locale;
  hero: HomepageCopy["hero"];
  stations: StationOption[];
}

export function SearchForm({ locale, hero, stations }: SearchFormProps) {
  const router = useRouter();
  const [station, setStation] = useState(stations[0]?.code ?? "US");
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const trimmed = keyword.trim();
    // Mirrors the legacy inline guard (see packages/contracts/src/suggestions.ts):
    // skip the request entirely when empty, >= 30 chars, or starting with the
    // literal (case-sensitive) substring "BO".
    if (!trimmed || trimmed.length >= 30 || trimmed.indexOf("BO") === 0) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/suggestions?station=${encodeURIComponent(station)}&keyword=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: SuggestionResponse) => {
          setSuggestions(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          // Best-effort suggestion dropdown — ignore aborted/failed requests.
        });
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [keyword, station]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    router.push(`/${locale}/${station}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <select
          aria-label="station"
          value={station}
          onChange={(event) => setStation(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {stations.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <Input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={hero.searchPlaceholder}
          aria-label={hero.searchAriaLabel}
          className="flex-1"
        />
        <Button type="submit" id="keywords">
          {hero.submitLabel}
        </Button>
      </div>
      {showValidation ? (
        <p role="alert" className="text-sm text-destructive">
          {hero.emptyValidationMessage}
        </p>
      ) : null}
      {suggestions.length > 0 ? (
        <ul className="rounded-md border border-input bg-background text-sm shadow-sm">
          {suggestions.map((item) => (
            <li key={item.keyword} className="border-b px-3 py-2 last:border-b-0">
              {item.keyword}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {hero.examplesLabel}{" "}
        {hero.examples.map((example, index) => (
          <span key={example.href}>
            <a href={example.href} className="underline underline-offset-2">
              {example.label}
            </a>
            {index < hero.examples.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
    </form>
  );
}
