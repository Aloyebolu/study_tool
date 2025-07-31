/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import clsx from "clsx";
// import { useState } from "react";

// export function FolderTree({ nodes, openFile, selectedFileId, fet }) {
//     const sampleStructure = [
//   {
//     id: 1,
//     name: 'ProjectAlpha',
//     type: 'folder',
//     parent_id: null,
//     children: [
//       {
//         id: 2,
//         name: 'index.html',
//         type: 'file',
//         parent_id: 1,
//       },
//       {
//         id: 3,
//         name: 'src',
//         type: 'folder',
//         parent_id: 1,
//         children: [
//           {
//             id: 4,
//             name: 'main.js',
//             type: 'file',
//             parent_id: 3,
//           },
//           {
//             id: 5,
//             name: 'components',
//             type: 'folder',
//             parent_id: 3,
//             children: [
//               {
//                 id: 6,
//                 name: 'Button.js',
//                 type: 'file',
//                 parent_id: 5,
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];

//   const [openFolders, setOpenFolders] = useState({});


//   const toggleFolder = (id) => {
//     setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const renderTree = (items) => {
//     return items.map((item) => {
//       const isFolder = item.type === 'folder';
//       const isOpen = openFolders[item.id];

//       return (
//         <div key={item.id} className="ml-2">
//           {isFolder ? (
//             <>
//               <div
//                 className="cursor-pointer text-sm p-1 hover:bg-gray-700 flex items-center gap-1"
//                 onClick={() => toggleFolder(item.id)}
//               >
//                 <span>{isOpen ? '📂' : '📁'}</span>
//                 <span>{item.name}</span>
//               </div>
//               {isOpen && item.children && (
//                 <div className="ml-4 border-l border-gray-600 pl-2">
//                   {renderTree(item.children)}
//                 </div>
//               )}
//             </>
//           ) : (
//             <div
//               className={clsx(
//                 'cursor-pointer text-sm p-1 hover:bg-gray-700',
//                 item.id === selectedFileId && 'bg-gray-700 text-blue-400'
//               )}
//               onClick={() => openFile(item)}
//             >
//               📄 {item.name}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return <div>{renderTree(nodes)}</div>;
// }
import clsx from "clsx";
import { useEffect, useState } from "react";

export function FolderTree({ nodes, openFile, selectedFileId, fetchFolderData, newFile } : {nodes: any, openFile: any, selectedFileId: any, fetchFolderData: any, newFile: any}) {
  const [tree, setTree] = useState(nodes);
  const [openFolders, setOpenFolders] = useState({});
  const [loadingFolders, setLoadingFolders] = useState({});
  const [fetchedFolders, setFetchedFolders] = useState({});
  const [errorFolders, setErrorFolders] = useState({});
  const [menuOpen, setMenuOpen] = useState({}); // Tracks which item has its menu open


  useEffect(()=>{
    setTree(nodes)
  }, [nodes])

  const toggleFolder = async (folder) => {
    const isOpen = openFolders[folder.id];

    if (isOpen) {
      setOpenFolders((prev) => ({ ...prev, [folder.id]: false }));
      return;
    }

    if (fetchedFolders[folder.id]) {
      setOpenFolders((prev) => ({ ...prev, [folder.id]: true }));
      return;
    }

    setLoadingFolders((prev) => ({ ...prev, [folder.id]: true }));
    setOpenFolders((prev) => ({ ...prev, [folder.id]: true }));

    try {
      const children = await fetchFolderData(folder.id);
        console.log(children)
      const updateTreeWithChildren = (items) =>
        items.map((item) => {
          if (item.id === folder.id) {
            return { ...item, children };
          } else if (item.children) {
            return { ...item, children: updateTreeWithChildren(item.children) };
          }
          return item;
        });

      setTree(updateTreeWithChildren(tree));
      setFetchedFolders((prev) => ({ ...prev, [folder.id]: true }));
    } catch (err) {
      setErrorFolders((prev) => ({ ...prev, [folder.id]: true }));
      setOpenFolders((prev) => ({ ...prev, [folder.id]: false }));
    } finally {
      setLoadingFolders((prev) => ({ ...prev, [folder.id]: false }));
    }
  };

  const toggleMenu = (id) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderMenu = (item) => {
    const isFolder = item.type === 'folder';
    return (
      <div className="absolute right-0 mt-1 w-32 bg-gray-800 shadow-md rounded text-sm z-10">
        <button className="block w-full text-left px-2 py-1 hover:bg-gray-700">Rename</button>
        <button className="block w-full text-left px-2 py-1 hover:bg-gray-700">Delete</button>
        <hr/>
        {isFolder && (
          <>
            <button onClick={()=>newFile('file', item.id, 'html')} className="block w-full text-left px-2 py-1 hover:bg-gray-700">New File</button>
            <button onClick={()=>newFile('folder', item.id)} className="block w-full text-left px-2 py-1 hover:bg-gray-700">New Folder</button>
          </>
        )}
      </div>
    );
  };

  const renderTree = (items) => {
    return items.map((item) => {
      const isFolder = item.type === 'folder';
      const isOpen = openFolders[item.id];
      const isLoading = loadingFolders[item.id];
      const hasError = errorFolders[item.id];
      const isMenuOpen = menuOpen[item.id];

      return (
        <div key={item.id} className="ml-2 relative group">
          <div className="flex items-center justify-between pr-1">
            <div
              className={clsx(
                "cursor-pointer text-sm p-1 hover:bg-gray-700 flex items-center gap-1 flex-1",
                item.id === selectedFileId && !isFolder && "bg-gray-700 text-blue-400"
              )}
              onClick={() => isFolder ? toggleFolder(item) : openFile(item)}
            >
              <span>{isLoading ? '⏳' : isFolder ? (isOpen ? '📂' : '📁') : '📄'}</span>
              <span className={hasError ? 'text-red-400' : ''}>{item.name}</span>
            </div>
            <div className="relative">
              <button onClick={() => toggleMenu(item.id)} className="p-1 hover:bg-gray-600 rounded">
                ⋮
              </button>
              {isMenuOpen && renderMenu(item)}
            </div>
          </div>
          {isFolder && isOpen && (
            <div className="ml-4 border-l border-gray-600 pl-2">
              {item.children && item.children.length > 0 ? (
                renderTree(item.children)
              ) : (
                !isLoading && <div className="text-gray-500 text-sm">Empty folder</div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return <div>{renderTree(tree)}</div>;
}
