import sqlite from "better-sqlite3";
import path from "path";
import { NextResponse } from "next/server";

const dbPath = path.resolve("database/pbw.db");
const db = sqlite(dbPath);

export async function GET(request: Request) {
  const rows = db.prepare("SELECT * FROM devices").all();
  return NextResponse.json({ devices: rows });
}
