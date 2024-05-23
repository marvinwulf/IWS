import sqlite from "better-sqlite3";
import path from "path";
import { NextResponse } from "next/server";

const dbPath = path.resolve("database/pbw.db");
const db = sqlite(dbPath);

export async function GET(req: Request, res: NextResponse) {
  const rows = db.prepare("SELECT * FROM devices").all();
  return NextResponse.json({ devices: rows });
}

export async function PUT(req: Request) {
  try {
    // Ensure Content-Type is application/json
    if (req.headers.get("Content-Type") !== "application/json") {
      console.error("Invalid Content-Type:", req.headers.get("Content-Type"));
      return NextResponse.json({ message: "Invalid Content-Type" }, { status: 400 });
    }

    let postData;
    try {
      postData = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { devicename, devicefriendlyname, threshold, watervolume, status } = postData;

    const stmt = db.prepare(
      `UPDATE devices 
      SET devicefriendlyname = @devicefriendlyname, 
          threshold = @threshold, 
          watervolume = @watervolume, 
          status = @status 
      WHERE devicename = @devicename`
    );

    const result = stmt.run({
      devicename: devicename,
      devicefriendlyname: devicefriendlyname,
      threshold: threshold,
      watervolume: watervolume,
      status: status,
    });

    if (result.changes > 0) {
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "failed" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
