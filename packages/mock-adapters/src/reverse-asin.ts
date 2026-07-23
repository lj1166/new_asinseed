import type { ReverseAsinProvider, ReverseAsinQuery, ReverseAsinResult } from "@new-asinseed/contracts";

const FIXTURES: ReverseAsinResult[] = [
  { asin: "B0MOCK0001", title: "Mock Wireless Earbuds", price: 29.99, rating: 4.3, category: ["Electronics", "Headphones"] },
  { asin: "B0MOCK0002", title: "Mock Stainless Steel Water Bottle", price: 14.5, rating: 4.6, category: ["Home & Kitchen", "Bottles"] },
  { asin: "B0MOCK0003", title: "Mock Yoga Mat", price: 19.99, rating: 4.1, category: ["Sports & Outdoors", "Fitness"] },
];

export class MockReverseAsinProvider implements ReverseAsinProvider {
  async query(input: ReverseAsinQuery): Promise<ReverseAsinResult> {
    const index = input.keywordOrAsin.length % FIXTURES.length;
    return FIXTURES[index];
  }
}
