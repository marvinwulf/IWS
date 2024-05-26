import sqlite from "better-sqlite3";
import path from "path";
import { NextResponse } from "next/server";

const dbPath = path.resolve("database/pbw.db");
const db = sqlite(dbPath);

export async function GET(req: Request, res: NextResponse) {
  const rows = db.prepare("SELECT * FROM devices").all();
  return NextResponse.json({ devices: rows });
}

function pushPut(input) {
  let query = "UPDATE devices SET ";
  let params = [];
  let values = [];

  const columns = {
    devicefriendlyname: "devicefriendlyname",
    threshold: "threshold",
    watervolume: "watervolume",
    currentwl: "currentwl",
    battery: "battery",
    currentsoilhumid: "currentsoilhumid",
    status: "status",
  };

  for (const key in input) {
    if (input.hasOwnProperty(key) && columns[key]) {
      query += `${columns[key]} = ?, `;
      params.push(input[key]);
    }
  }

  query = query.slice(0, -2);

  query += " WHERE devicename = ?";
  params.push(input.devicename);

  // Execute the SQL query
  const stmt = db.prepare(query);
  const result = stmt.run(...params);

  return result;
}

export async function PUT(req: Request) {
  try {
    const result = pushPut(await req.json());

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
