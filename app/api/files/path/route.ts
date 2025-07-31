import { connectDB, disconnectDB, query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
  // const user_id = searchParams.get('user_id');
  const fileId = searchParams.get('path')

  console.log(fileId)
  try {
    await connectDB();

    const result = await query(
      `SELECT 
        files.id, files.name, files.parent_id, files.path, files.type,
        file_contents.content, file_contents.updated_at
      FROM files
      LEFT JOIN file_contents ON files.id = file_contents.file_id
      WHERE files.path = $1`,
      [fileId]
    );

    console.log(result)
    if (!result.length) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, data: result[0] });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("GET /api/files/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch file content" }, { status: 500 });
  } finally {
    await disconnectDB();
  }
}
