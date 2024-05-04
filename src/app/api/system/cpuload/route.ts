import si from "systeminformation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cpuData = await si.currentLoad();
    let cpuLoad = Math.ceil(cpuData.currentLoad);
    if (cpuLoad < 1) {
      cpuLoad = 1;
    }
    const cpuLoadPerCore = cpuData.cpus.map((core) => Math.ceil(core.load * 10) / 10);

    return NextResponse.json({ totalLoad: cpuLoad, loadPerCore: cpuLoadPerCore });
  } catch (error) {
    return NextResponse.error();
  }
}
