import { NextRequest, NextResponse } from "next/server";
import { SuggestionQuerySchema } from "@new-asinseed/contracts";
import { MockSuggestionProvider } from "@new-asinseed/mock-adapters";

const provider = new MockSuggestionProvider();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = SuggestionQuerySchema.safeParse({
    station: searchParams.get("station") ?? "",
    keyword: searchParams.get("keyword") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json([]);
  }

  const result = await provider.query(parsed.data);
  return NextResponse.json(result);
}
