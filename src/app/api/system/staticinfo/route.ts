const fs = require("fs");
import { NextResponse } from "next/server";

export function GET(request: Request) {
  try {
    const cpuInfo = JSON.parse(fs.readFileSync("public/staticinfo.json", "utf8"));
    return NextResponse.json(cpuInfo);
  } catch (error) {
    console.error("Error reading CPU information:", error);
    return NextResponse.error();
  }
}
