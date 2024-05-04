import si from "systeminformation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const memData = await si.mem();
    let memLoad = Math.ceil((memData.used / memData.total) * 100);

    return NextResponse.json({ totalLoad: memLoad, ramData: memData });
  } catch (error) {
    return NextResponse.error();
  }
}
