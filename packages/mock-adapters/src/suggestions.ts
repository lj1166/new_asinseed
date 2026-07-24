import type { SuggestionItem, SuggestionProvider, SuggestionQuery, SuggestionResponse } from "@new-asinseed/contracts";

// Small non-fabricated fixture: plausible keyword expansions, not scraped or
// invented "real" search volumes — good enough to exercise the suggestion
// dropdown locally until a real search-data backend is wired up.
const FIXTURE_KEYWORDS: SuggestionItem[] = [
  { keyword: "flashlight", searches: 128_400 },
  { keyword: "flashlight rechargeable", searches: 42_100 },
  { keyword: "flashlight led", searches: 31_600 },
  { keyword: "flashlight tactical", searches: 18_900 },
  { keyword: "flashlight keychain", searches: 9_200 },
];

export class MockSuggestionProvider implements SuggestionProvider {
  async query(input: SuggestionQuery): Promise<SuggestionResponse> {
    const trimmed = input.keyword.trim();
    if (!trimmed || trimmed.length >= 30 || trimmed.indexOf("BO") === 0) {
      return [];
    }

    const lower = trimmed.toLowerCase();
    return FIXTURE_KEYWORDS.filter((item) => item.keyword.toLowerCase().includes(lower));
  }
}
