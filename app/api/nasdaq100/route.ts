import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

const NASDAQ_100 = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AVGO", "COST", "LRCX", "KLAC"
  // ... (나스닥 100 전체 티커를 여기에 배열로 넣으세요)
];

export async function GET() {
  const results: { symbol: string, mean: number, variance: number }[] = [];
  for (const symbol of NASDAQ_100.slice(0, 20)) { // 예시로 20개만
    try {
      const history = await yahooFinance.historical(symbol, { period1: "2024-05-01", period2: "2024-06-01" });
      const closes = history.map((d: any) => d.close).filter(Boolean);
      if (closes.length === 0) continue;
      const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
      const variance = closes.reduce((a, b) => a + (b - mean) ** 2, 0) / closes.length;
      results.push({ symbol, mean, variance });
    } catch (e) {
      // ignore errors
    }
  }
  return NextResponse.json({ data: results });
}