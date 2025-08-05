/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB, disconnectDB, query } from "@/lib/db";
import { NextResponse } from "next/server";
import { url } from "node:inspector/promises";

// app/api/files/[id]/route.ts
export async function GET(req: Request) {
  // Extract fileId from the URL
  const url = new URL(req.url);
  const fileId = url.pathname.split("/").pop();
  console.log(fileId)
  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }
  try {
connectDB()
    // Check if file exists
    const fileExists = await query(
      `SELECT id FROM files WHERE id = $1`,
      [fileId]
    );
    console.log(fileExists)
    if (fileExists.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
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

// app/api/files/[id]/route.ts
export async function PUT(req: Request) {
  // Extract fileId from the URL
  const url = new URL(req.url);
  const fileId = url.pathname.split("/").pop();

  const { content } = await req.json();
  console.log(content)
  try {
    await connectDB();
await query(
  `
  INSERT INTO file_contents (file_id, content, updated_at)
  VALUES ($1, $2, NOW())
  ON CONFLICT (file_id) 
  DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
  `,
  [fileId, content]
);


    return NextResponse.json({ success: true }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  } finally {
    await disconnectDB();
  }
}

