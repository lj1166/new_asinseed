"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, CircleAlert, LoaderCircle, Search } from "lucide-react";
import { getReverseAsinMode, ReverseAsinResultSchema, type ReverseAsinResult, type SearchMarket, type SuggestionItem } from "@new-asinseed/contracts";
import { useRouter } from "next/navigation";

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

interface SearchToolClientProps {
  locale: string;
  market: SearchMarket;
  initialQuery: string;
  initialSupplement: boolean;
  initialExactMatch: boolean;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function getStatusLabel(status: "idle" | "loading" | "ready" | "error") {
  if (status === "loading") return "正在请求当前验证 provider";
  if (status === "ready") return "已返回当前查询的验证结果";
  if (status === "error") return "需要修正输入后再开始研究";
  return "等待定义研究对象";
}

export function SearchToolClient({ locale, market, initialQuery, initialSupplement, initialExactMatch }: SearchToolClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedMarket, setSelectedMarket] = useState<SearchMarket>(market);
  const [supplement, setSupplement] = useState(initialSupplement);
  const [exactMatch, setExactMatch] = useState(initialExactMatch);
  const [result, setResult] = useState<ReverseAsinResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(initialQuery ? "loading" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  const mode = useMemo(() => getReverseAsinMode(query), [query]);
  const hasInput = query.trim().length > 0;
  const inputDescription = !hasInput
    ? "输入后会自动识别任务类型"
    : mode === "asin"
      ? "识别为 ASIN 反查 · 将显示关联关键词字段"
      : "识别为关键词研究 · 将显示需求与购买字段";

  function buildRoute(nextMarket = selectedMarket, nextQuery = query, nextSupplement = supplement, nextExactMatch = exactMatch) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextSupplement) params.set("supplement", "true");
    if (nextExactMatch) params.set("exactMatch", "true");
    const suffix = params.toString();
    return "/" + locale + "/" + nextMarket + (suffix ? "?" + suffix : "");
  }

  function submitQuery() {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("请输入一个 ASIN 或关键词后再开始研究。");
      setStatus("error");
      return;
    }
    router.push(buildRoute());
  }

  useEffect(() => {
    if (!initialQuery) {
      setResult(null);
      setStatus("idle");
      setError(null);
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setError(null);
    setResult(null);

    const params = new URLSearchParams({ market, q: initialQuery });
    if (initialSupplement) params.set("supplement", "true");
    if (initialExactMatch) params.set("exactMatch", "true");

    void fetch("/api/reverse-asin?" + params.toString(), { signal: controller.signal })
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(typeof payload === "object" && payload && "detail" in payload ? String(payload.detail) : "查询暂时不可用。");
        }
        const parsed = ReverseAsinResultSchema.safeParse(payload);
        if (!parsed.success) throw new Error("查询返回的数据不符合当前工具契约。");
        return parsed.data;
      })
      .then((data) => {
        setResult(data);
        setStatus("ready");
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "查询暂时不可用。");
        setStatus("error");
      });

    return () => controller.abort();
  }, [initialExactMatch, initialQuery, initialSupplement, market]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || getReverseAsinMode(trimmed) === "asin" || trimmed.length >= 30) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch("/api/suggestions?station=" + selectedMarket + "&keyword=" + encodeURIComponent(trimmed), { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : []))
        .then((payload: unknown) => setSuggestions(Array.isArray(payload) ? (payload as SuggestionItem[]) : []))
        .catch(() => setSuggestions([]));
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, selectedMarket]);

  return (
    <section aria-labelledby="search-task-heading" className="mt-8 overflow-hidden border border-brand-ink/20 bg-white shadow-[14px_14px_0_rgba(55,29,7,0.1)]" data-testid="search-tool">
      <div className="grid lg:grid-cols-[15.75rem_minmax(0,1fr)]">
        <aside className="border-b border-brand-ink/20 bg-brand-ink px-5 py-6 text-white lg:border-b-0 lg:border-r sm:px-6 sm:py-7">
          <div className="flex items-center justify-between lg:block">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">RESEARCH CONSOLE</p>
            <span className="font-mono text-[10px] text-white/48 lg:mt-3 lg:block">{MARKET_LABELS[selectedMarket]} / {mode === "asin" ? "ASIN" : "TERM"}</span>
          </div>
          <h2 id="search-task-heading" className="mt-5 text-xl font-semibold leading-tight tracking-[-0.035em] text-white">定义对象，再读取对应字段</h2>
          <output aria-live="polite" className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/72">
            <span aria-hidden="true" className={"mt-2 h-2 w-2 shrink-0 rounded-full " + (status === "loading" ? "bg-primary motion-safe:animate-[signal-breathe_1.8s_ease-in-out_infinite]" : status === "ready" ? "bg-primary" : "bg-white/35")} />
            {getStatusLabel(status)}
          </output>
          <ol className="mt-7 border-t border-white/18 text-xs">
            <li className="grid grid-cols-[1.8rem_1fr] gap-2 border-b border-white/18 py-3.5"><span className="font-mono text-primary">01</span><span className="text-white/64">选择市场与研究对象</span></li>
            <li className="grid grid-cols-[1.8rem_1fr] gap-2 border-b border-white/18 py-3.5"><span className="font-mono text-primary">02</span><span className="text-white/64">确认系统识别的任务模式</span></li>
            <li className="grid grid-cols-[1.8rem_1fr] gap-2 border-b border-white/18 py-3.5"><span className="font-mono text-primary">03</span><span className="text-white/64">在结果区判断下一步</span></li>
          </ol>
          <details className="mt-6 border-l-2 border-primary pl-3 text-xs leading-5 text-white/58">
            <summary className="cursor-pointer font-semibold text-white">当前数据边界</summary>
            <p className="mt-2">此页用于验证输入、路由与字段流。结果会显式标记为本地 Mock，不代表实时市场数据。</p>
          </details>
        </aside>

        <div className="min-w-0">
          <form action={"/" + locale + "/" + selectedMarket} method="get" className="px-5 py-6 sm:px-7 sm:py-8" onSubmit={(event) => { event.preventDefault(); submitQuery(); }}>
            <div className="flex flex-col justify-between gap-4 border-b border-brand-ink/14 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-strong">01 / QUERY</p>
                <p className="mt-2 text-sm leading-6 text-brand-ink/62">可从单个 ASIN 发起反查，也可从一个关键词开始研究需求。</p>
              </div>
              <p className="font-mono text-[10px] text-brand-ink/46">{mode === "asin" ? "RELATED-KEYWORD VIEW" : "DEMAND-FIELD VIEW"}</p>
            </div>

            <div className="mt-6 grid gap-0 border border-brand-ink/20 xl:grid-cols-[10.5rem_minmax(0,1fr)_8.5rem]">
              <label className="relative block border-b border-brand-ink/20 xl:border-b-0 xl:border-r">
                <span className="sr-only">市场</span>
                <select
                  value={selectedMarket}
                  onChange={(event) => {
                    const nextMarket = event.target.value as SearchMarket;
                    setSelectedMarket(nextMarket);
                    router.push(buildRoute(nextMarket));
                  }}
                  className="h-14 w-full appearance-none bg-[#f7f1e8] px-4 pr-9 text-sm font-semibold text-brand-ink outline-none transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  {Object.entries(MARKET_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/55" />
              </label>
              <div className="relative">
                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-ink/42" />
                <input
                  id="search-tool-query"
                  name="q"
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setError(null); }}
                  placeholder="输入 ASIN 或关键词，例如 B071J24FNY / flashlight"
                  className="h-14 w-full bg-white px-12 pr-4 text-base text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:ring-2 focus:ring-inset focus:ring-primary"
                  autoComplete="off"
                  required
                />
                {suggestions.length > 0 ? (
                  <ul role="listbox" aria-label="关键词建议" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-10 border border-brand-ink/20 bg-white p-1 shadow-[10px_10px_0_rgba(55,29,7,0.1)]">
                    {suggestions.map((item) => (
                      <li key={item.keyword}>
                        <button type="button" role="option" onClick={() => { setQuery(item.keyword); setSuggestions([]); }} className="flex w-full items-center justify-between border-l-2 border-transparent px-3 py-2.5 text-left text-sm text-brand-ink transition hover:border-primary hover:bg-[#f7f1e8]">
                          <span>{item.keyword}</span>
                          <span className="font-mono text-[10px] text-brand-ink/45">SUGGESTION</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button type="submit" className="inline-flex h-14 items-center justify-center gap-2 border-t border-brand-ink/20 bg-primary px-5 text-sm font-bold text-brand-ink transition hover:bg-[#e88400] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-ink xl:border-l xl:border-t-0">
                运行研究
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 border-t border-brand-ink/12 pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-brand-ink/45">INPUT RECOGNITION</p>
                <output aria-live="polite" className="mt-1.5 block text-sm font-semibold text-brand-strong">{inputDescription}</output>
              </div>
              {mode === "keyword" ? (
                <fieldset className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-brand-ink/65">
                  <legend className="sr-only">关键词筛选</legend>
                  <label className="inline-flex cursor-pointer items-center gap-2"><input type="checkbox" checked={supplement} onChange={(event) => setSupplement(event.target.checked)} className="h-4 w-4 accent-[#ff9200]" />仅显示当月关键词</label>
                  <label className="inline-flex cursor-pointer items-center gap-2"><input type="checkbox" checked={exactMatch} onChange={(event) => setExactMatch(event.target.checked)} className="h-4 w-4 accent-[#ff9200]" />词组匹配</label>
                </fieldset>
              ) : <p className="text-xs leading-5 text-brand-ink/52">ASIN 反查模式不显示关键词筛选。</p>}
            </div>
          </form>

          <div className="border-t border-brand-ink/20 bg-[#fbf8f3] px-5 py-6 sm:px-7 sm:py-7" data-testid="search-result-area">
            <div className="flex flex-col gap-3 border-b border-brand-ink/12 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-strong">02 / OUTPUT</p>
                <p className="mt-1 text-sm font-semibold text-brand-ink">{status === "ready" ? "研究结果" : "结果工作区"}</p>
              </div>
              {status === "loading" ? <progress className="h-1 w-40 accent-[#ff9200]" aria-label="查询中" /> : <span className="font-mono text-[10px] text-brand-ink/45">SOURCE: LOCAL MOCK / VERIFICATION</span>}
            </div>
            <div className="pt-5">
              {status === "idle" ? <p className="max-w-xl text-sm leading-7 text-brand-ink/62">输入后，这里会根据研究对象切换字段并呈现验证结果。查询页不会进入搜索收录；稳定工具入口保留为可发现页面。</p> : null}
              {status === "loading" ? <div className="flex items-center gap-3 text-sm text-brand-ink/65"><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-brand-strong" />正在请求当前 Mock provider…</div> : null}
              {status === "error" ? <p role="alert" className="flex items-start gap-2 text-sm leading-6 text-destructive"><CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4" />{error}</p> : null}
              {status === "ready" && result ? <SearchResult result={result} /> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchResult({ result }: { result: ReverseAsinResult }) {
  const asinMode = result.mode === "asin";
  return (
    <div className="overflow-hidden border border-brand-ink/18 bg-white">
      <div className="flex flex-col gap-3 border-b border-brand-ink/14 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-ink">{asinMode ? "ASIN 关联关键词视图" : "关键词需求字段视图"}</p>
          <p className="mt-1 text-xs text-brand-ink/55">研究对象：{result.query} · {MARKET_LABELS[result.market]}</p>
        </div>
        <span className="inline-flex w-fit border-l-2 border-primary bg-[#f7f1e8] px-3 py-1.5 text-xs font-semibold text-brand-strong">本地 Mock 验证数据，不代表实时查询</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[38rem] text-left text-sm">
          <thead className="border-b border-brand-ink/12 bg-brand-ink text-xs font-semibold text-white/72">
            <tr>
              <th scope="col" className="px-4 py-3.5">{asinMode ? "关联关键词" : "关键词"}</th>
              <th scope="col" className="px-4 py-3.5 text-right">月搜索量（Mock）</th>
              {asinMode ? <th scope="col" className="px-4 py-3.5 text-right">研究权重（Mock）</th> : <><th scope="col" className="px-4 py-3.5 text-right">商品数（Mock）</th><th scope="col" className="px-4 py-3.5 text-right">月购买量（Mock）</th><th scope="col" className="px-4 py-3.5 text-right">购买率（Mock）</th></>}
            </tr>
          </thead>
          <tbody>
            {result.items.map((item, index) => (
              <tr key={item.keyword} className="border-b border-brand-ink/10 last:border-0 hover:bg-[#f7f1e8]">
                <th scope="row" className="px-4 py-4 font-semibold text-brand-ink"><span className="mr-3 font-mono text-[10px] text-brand-ink/38">0{index + 1}</span>{item.keyword}</th>
                <td className="px-4 py-4 text-right text-brand-ink/70">{formatNumber(item.monthlySearches)}</td>
                {asinMode ? <td className="px-4 py-4 text-right text-brand-ink/70">{item.trafficWeight ?? "—"}</td> : <><td className="px-4 py-4 text-right text-brand-ink/70">{formatNumber(item.productCount ?? 0)}</td><td className="px-4 py-4 text-right text-brand-ink/70">{formatNumber(item.monthlyPurchases ?? 0)}</td><td className="px-4 py-4 text-right text-brand-ink/70">{item.purchaseRate === undefined ? "—" : (item.purchaseRate * 100).toFixed(1) + "%"}</td></>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
