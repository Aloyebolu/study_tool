/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export default function CreateMenu({ createFile }: { createFile: (type: string, parent: any, file_type: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-gray-100"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                createFile('file',  null, 'html',);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              ➕ Create File
            </button>
            <button
              onClick={() => {
                createFile('folder', null, null);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              📁 Create Folder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
