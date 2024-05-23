import sqlite from "better-sqlite3";
import path from "path";
import { NextResponse } from "next/server";

const dbPath = path.resolve("database/pbw.db");
const db = sqlite(dbPath);

export async function GET(req: Request, res: NextResponse) {
  const rows = db.prepare("SELECT * FROM devices").all();
  return NextResponse.json({ devices: rows });
}

export async function PUT(req) {
  try {
    // Ensure Content-Type is application/json
    if (req.headers.get("Content-Type") !== "application/json") {
      console.error("Invalid Content-Type:", req.headers.get("Content-Type"));
      return NextResponse.json({ message: "Invalid Content-Type" }, { status: 400 });
    }

    // Read the raw request body
    let rawBody;
    try {
      rawBody = await req.text();
    } catch (error) {
      console.error("Error reading request body:", error);
      return NextResponse.json({ message: "Error reading request body" }, { status: 400 });
    }

    console.log("Received rawBody:", rawBody);

    // Check if the body is empty
    if (!rawBody) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    let postData;
    try {
      postData = JSON.parse(rawBody);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    console.log("Parsed postData:", postData);

    const { devicename, devicefriendlyname, threshold, watervolume, status } = postData;

    console.log("Updating device with:", {
      devicename,
      devicefriendlyname,
      threshold,
      watervolume,
      status,
    });

    // Prepare the SQL statement
    const stmt = db.prepare(
      `UPDATE devices 
      SET devicefriendlyname = @devicefriendlyname, 
          threshold = @threshold, 
          watervolume = @watervolume, 
          status = @status 
      WHERE devicename = @devicename`
    );

    console.log("SQL execution result:", stmt);

    const result = stmt.run({
      devicename: devicename,
      devicefriendlyname: devicefriendlyname,
      threshold: threshold,
      watervolume: watervolume,
      status: status,
    });

    console.log("SQL execution result:", result);

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
