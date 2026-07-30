import { NextRequest, NextResponse } from "next/server";
import { ReverseAsinQuerySchema } from "@new-asinseed/contracts";
import { MockReverseAsinProvider } from "@new-asinseed/mock-adapters";

const provider = new MockReverseAsinProvider();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = ReverseAsinQuerySchema.safeParse({
    market: searchParams.get("market") ?? "",
    keywordOrAsin: searchParams.get("q") ?? "",
    supplement: searchParams.get("supplement") === "true",
    exactMatch: searchParams.get("exactMatch") === "true",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { type: "about:blank", title: "查询参数无效", detail: "请选择支持的站点，并输入 ASIN 或关键词。" },
      { status: 400 },
    );
  }

  return NextResponse.json(await provider.query(parsed.data));
}
