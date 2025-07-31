/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB, disconnectDB, query } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/files/[id]/route.ts
export async function GET(req: Request) {
  // Extract fileId from the URL
  const url = new URL(req.url);
  const fileId = url.pathname.split("/").pop();

  try {
    await connectDB();
    const result = await query(
      `SELECT files.*, file_contents.content FROM files
       LEFT JOIN file_contents ON files.id = file_contents.file_id
       WHERE files.id = $1`,
      [fileId]
    );

    console.log(result)
    return NextResponse.json({ status: 200, data: result[0]});
  } catch (err : any) {
    console.log(err)
    return NextResponse.json({ error: "Failed to fetch file content" }, { status: 500 });
  } finally {
    await disconnectDB();
  }
}