/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { connectDB, disconnectDB, query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {  name, type, file_type, parent_id } = await req.json();
    const {userId : user_id} = getUserIdFromRequest(req)
    if(!user_id){
      return
    }
    console.log(name, type, file_type, parent_id)
    connectDB()

try {
  let res;
  let itemType = type; // this is either 'file' or 'folder'
  let fileType
  if(file_type){
    fileType = '.html'
  }else{
    fileType = ''
  }

let path = '/'; // Default path for root level

if (parent_id) {
  const parentRes =
    type === 'file'
      ? await query('SELECT path FROM folders WHERE id = $1 AND user_id = $2', [parent_id, user_id])
      : await query('SELECT path FROM folders WHERE id = $1 AND user_id = $2', [parent_id, user_id]);

  if (parentRes.length > 0) {
    const parentPath = parentRes[0].path;
    path = `${parentPath.endsWith('/') ? parentPath : parentPath + '/'}${name}${fileType}`;
  } else {
    return NextResponse.json({ success: false, message: 'Parent not found' }, { status: 404 });
  }
} else {
  path = `/${name}`;
}


if (type === 'file') {
  res = await query(
    parent_id
      ? 'INSERT INTO files (user_id, name, type, parent_id, path) VALUES ($1, $2, $3, $4, $5) RETURNING *'
      : 'INSERT INTO files (user_id, name, type, path) VALUES ($1, $2, $3, $4) RETURNING *',
    parent_id ? [user_id, name, file_type, parent_id, path] : [user_id, name, file_type, path]
  );
} else if (type === 'folder') {
  res = await query(
    parent_id
      ? 'INSERT INTO folders (user_id, name, parent_id, path) VALUES ($1, $2, $3, $4) RETURNING *'
      : 'INSERT INTO folders (user_id, name, path) VALUES ($1, $2, $3) RETURNING *',
    parent_id ? [user_id, name, parent_id, path] : [user_id, name, path]
  );
} else {
  return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
}


  const created = res[0];
  const data = {
    id: created.id,
    name: created.name,
    type: itemType,
    parent_id: created.parent_id ?? null,
  };

  return NextResponse.json({ success: true, data }, { status: 201 });
} catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
}finally {
      disconnectDB()
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // const user_id = searchParams.get('user_id');
    const {userId : user_id} = getUserIdFromRequest(req)

 console.log(user_id)
  const parent_id = searchParams.get("parent_id")
  console.log(parent_id)
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  await connectDB();

  try {
    // 1. Fetch all folders and files for this user
let folders, files;

if (parent_id === null || parent_id === 'null') {
  folders = await query(
    `SELECT id, name, parent_id FROM folders WHERE user_id = $1 AND parent_id IS NULL`,
    [user_id]
  );

  files = await query(
    `SELECT id, name, type, parent_id FROM files WHERE user_id = $1 AND parent_id IS NULL`,
    [user_id]
  );
} else {
  folders = await query(
    `SELECT id, name, parent_id FROM folders WHERE parent_id = $1`,
    [ parent_id]
  );

  files = await query(
    `SELECT id, name, type, parent_id FROM files WHERE parent_id = $1`,
    [ parent_id]
  );
}


    // 2. Combine all items with a common format
    const items = [
      ...folders.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        parent_id: folder.parent_id,
        type: 'folder',
      })),
      ...files.map((file: any) => ({
        id: file.id,
        name: file.name,
        parent_id: file.parent_id,
        type: 'file',
        file_type: file.type, // optional: js, html, css, etc.
      })),
    ];

    // 3. Recursive function to build tree
    function buildTree(parentId: number | string ) {
      return items
        .filter((item) => item.parent_id === parentId)
        .map((item) => ({
          ...item,
          ...(item.type === 'folder' && { children: buildTree(item.id) }),
        }));
    }

    const tree = buildTree(parent_id); // root level
    console.log(tree, items)
    return NextResponse.json({ success: true, data: tree }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch structure' }, { status: 500 });
  } finally {
    await disconnectDB();
  }
}
