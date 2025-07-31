import { connectDB, disconnectDB, query } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/files/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const fileId = params.id;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err : any) {
    console.log(err)
    return NextResponse.json({ error: "Failed to fetch file content" }, { status: 500 });
  } finally {
    await disconnectDB();
  }
}


// app/api/files/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const fileId = params.id;
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

