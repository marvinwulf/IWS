import si from "systeminformation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const disks = await si.fsSize();

    return NextResponse.json({ disks });
  } catch (error) {
    return NextResponse.error();
  }
}
