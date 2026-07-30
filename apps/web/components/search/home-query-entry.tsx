"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { getReverseAsinMode, type SearchMarket } from "@new-asinseed/contracts";

const MARKET_LABELS: Record<SearchMarket, string> = {
  US: "美国站",
  JP: "日本站",
  UK: "英国站",
  DE: "德国站",
  FR: "法国站",
  IT: "意大利站",
  ES: "西班牙站",
  CA: "加拿大站",
  IN: "印度站",
};

interface HomeQueryEntryProps {
  locale: string;
  submitLabel: string;
  hint: string;
}

export function HomeQueryEntry({ locale, submitLabel, hint }: HomeQueryEntryProps) {
  const [selectedMarket, setSelectedMarket] = useState<SearchMarket>("US");
  const [query, setQuery] = useState("");
  const mode = useMemo(() => getReverseAsinMode(query), [query]);
  const hasInput = query.trim().length > 0;
  const recognition = !hasInput
    ? "等待研究对象"
    : mode === "asin"
      ? "已识别为 ASIN · 将进入关联关键词视图"
      : "已识别为关键词 · 将进入需求字段视图";

  return (
    <section aria-labelledby="homepage-tool-entry" className="border border-brand-ink/20 bg-white shadow-[12px_12px_0_rgba(55,29,7,0.1)]" data-testid="homepage-query-entry">
      <div className="flex items-center justify-between border-b border-brand-ink/15 bg-brand-ink px-5 py-3 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center bg-primary text-[10px] font-black text-brand-ink">01</span>
          <p className="text-xs font-semibold tracking-[0.12em] text-white/82">启动一轮研究</p>
        </div>
        <span className="font-mono text-[10px] text-white/55">RESEARCH ENTRY</span>
      </div>

      <form action={"/" + locale + "/" + selectedMarket} method="get" className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className={"mt-1.5 h-2.5 w-2.5 rounded-full " + (hasInput ? "bg-primary motion-safe:animate-[signal-breathe_1.8s_ease-in-out_infinite]" : "bg-brand-ink/20")} />
          <div>
            <h2 id="homepage-tool-entry" className="text-xl font-semibold tracking-[-0.035em] text-brand-ink">从一个研究对象开始</h2>
            <p className="mt-1 text-sm leading-6 text-brand-ink/60">市场、对象与结果视图在同一条任务路径里完成。</p>
          </div>
        </div>

        <div className="mt-7 grid gap-0 border border-brand-ink/20 sm:grid-cols-[9.75rem_minmax(0,1fr)]">
          <label className="relative block border-b border-brand-ink/20 sm:border-b-0 sm:border-r">
            <span className="sr-only">市场</span>
            <select
              value={selectedMarket}
              onChange={(event) => setSelectedMarket(event.target.value as SearchMarket)}
              className="h-14 w-full appearance-none bg-[#f7f1e8] px-4 pr-9 text-sm font-semibold text-brand-ink outline-none transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {Object.entries(MARKET_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/55" />
          </label>
          <label className="relative block">
            <span className="sr-only">ASIN 或关键词</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/42" />
            <input
              id="homepage-query"
              name="q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              required
              autoComplete="off"
              placeholder="输入 ASIN 或关键词，例如 B071J24FNY / flashlight"
              className="h-14 w-full bg-white px-11 pr-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-ink/42 focus:ring-2 focus:ring-inset focus:ring-primary"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-brand-ink/12 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-h-11">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-brand-ink/45">INPUT RECOGNITION</p>
            <output aria-live="polite" className="mt-1.5 block text-sm font-semibold text-brand-strong">{recognition}</output>
            <p className="mt-1 text-xs leading-5 text-brand-ink/52">{hint}</p>
          </div>
          <button type="submit" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-brand-ink transition hover:bg-[#e88400] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            {submitLabel}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
