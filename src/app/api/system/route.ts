import { NextResponse } from "next/server";
import { getCachedData, getLastFetchTime } from "../../scripts/backgroundWorker";

export async function GET(request: Request) {
  const cachedData = getCachedData();
  const lastFetchTime = getLastFetchTime();

  if (!cachedData) {
    return NextResponse.json({ error: "Data not available yet" });
  }

  return NextResponse.json({ data: cachedData, lastFetchTime });
}
