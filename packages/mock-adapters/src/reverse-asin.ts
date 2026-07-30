import { getReverseAsinMode, type ReverseAsinProvider, type ReverseAsinQuery, type ReverseAsinResult } from "@new-asinseed/contracts";

const ASIN_FIXTURE = [
  { keyword: "验证关键词 01", monthlySearches: 1200, trafficWeight: 82 },
  { keyword: "验证关键词 02", monthlySearches: 860, trafficWeight: 61 },
  { keyword: "验证关键词 03", monthlySearches: 420, trafficWeight: 37 },
];

const KEYWORD_FIXTURE = [
  { keyword: "验证关键词 01", monthlySearches: 1200, productCount: 340, monthlyPurchases: 92, purchaseRate: 0.08 },
  { keyword: "验证关键词 02", monthlySearches: 860, productCount: 210, monthlyPurchases: 55, purchaseRate: 0.06 },
  { keyword: "验证关键词 03", monthlySearches: 420, productCount: 98, monthlyPurchases: 18, purchaseRate: 0.04 },
];

export class MockReverseAsinProvider implements ReverseAsinProvider {
  async query(input: ReverseAsinQuery): Promise<ReverseAsinResult> {
    const mode = getReverseAsinMode(input.keywordOrAsin);
    return {
      market: input.market,
      query: input.keywordOrAsin.trim(),
      mode,
      source: "mock",
      items: mode === "asin" ? ASIN_FIXTURE : KEYWORD_FIXTURE,
    };
  }
}
