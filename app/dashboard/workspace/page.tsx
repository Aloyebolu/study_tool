/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader, CheckCircle2, XCircle, Undo2, Redo2,
  Copy, PlayCircle, FilePlus2, Maximize2, X, PanelRightClose, Menu
} from 'lucide-react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { FolderTree } from '@/components/FolderTree';
import CreateMenu from '@/components/CreateMenu';
import OutputViewer from '@/components/OutputViewer';

const CodeEditor = dynamic(() => import('@/components/editor'), { ssr: false });

export default function WorkspacePage(onToggleFull) {
  const [files, setFiles] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [status, setStatus] = useState('idle');
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [isOutputMaximized, setIsOutputMaximized] = useState(false);
  const [outputWidth, setOutputWidth] = useState(50);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const saveTimeout = useRef(null);
  const isResizing = useRef(false);

  useEffect(() => {
    fetchFiles();
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', () => (isResizing.current = false));
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', () => (isResizing.current = false));
    };
  }, []);

  const handleResize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const editorWrapper = document.getElementById('editor-wrapper');
    if (!editorWrapper) return;
    const totalWidth = editorWrapper.offsetWidth;
    const newOutputWidth = 100 - ((e.clientX - editorWrapper.offsetLeft) / totalWidth) * 100;
    if (newOutputWidth > 10 && newOutputWidth < 90) {
      setOutputWidth(newOutputWidth);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      setFiles(data.data);
    } catch { }
  };

  const createFile = async (type: string, parent_id: string, file_type?: string) => {
    const name = prompt('Enter file name:');
    if (!name) return;
    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        body: JSON.stringify({ name, file_type, type, parent_id }),
      });
      const newFile = await res.json();
      if (!res.ok) return alert('Failed to create file');
      setFiles((prev) => [...prev, newFile.data]);
      setSelectedFile(newFile.data);
    } catch {
      alert('Failed to create file.');
    }
  };

  const handleSelectFile = async (file: any) => {
    setSelectedFile(file);
    setIsFileLoading(true);
    try {
      const res = await fetch(`/api/files/${file.id}`);
      setIsFileLoading(false);
      if (!res.ok) return alert('Failed to load file');
      const fullFile = await res.json();
      setSelectedFile(fullFile.data);
      setOutput('');
      setShowOutput(false);
    } catch {
      alert('Failed to load file');
      setIsFileLoading(false);
    }
  };

  const handleCodeChange = (val: any) => {
    if (!selectedFile || !selectedFile.id) return;
    setSelectedFile({ ...selectedFile, content: val });
    setStatus('saving');
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/files/${selectedFile.id}`, {
          method: 'PUT',
          body: JSON.stringify({ content: val }),
        });
        setStatus(res.ok ? 'saved' : 'error');
      } catch {
        setStatus('error');
      }
    }, 3000);
  };

  const runCode = async () => {
    if (!selectedFile) return;
    setShowOutput(true);
    try {
      const res = await fetch(`/api/files/run/${selectedFile.id}`);
      const { output } = await res.json();
      setOutput(output);
    } catch {
      setOutput('Execution failed.');
    }
  };

  const fetchFolderData = async (folderId = null) => {
    const url = folderId ? `/api/files?parent_id=${encodeURIComponent(folderId)}` : `/api/files`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data;
  };

    const toggleOutput = () => setShowOutput(!showOutput);
  const toggleMaximize = () => setIsOutputMaximized(!isOutputMaximized);

  return (
    <div className="flex h-screen w-full relative">
      {/* Sidebar */}
      <div className={clsx(
        'bg-gray-900 text-white flex flex-col transition-all duration-300 z-30',
        'fixed md:static top-0 left-0 h-full md:h-auto',
        sidebarOpen ? 'w-64' : 'w-0 md:w-64 overflow-hidden'
      )}>
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          <h2 className="text-lg font-bold">Files</h2>
          <CreateMenu createFile={createFile} />
        </div>
        <div className="flex-1 overflow-auto p-1 text-white text-sm">
          <FolderTree
            nodes={files}
            openFile={handleSelectFile}
            selectedFileId={selectedFile?.id}
            fetchFolderData={fetchFolderData}
            newFile={createFile}
          />
        </div>

      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col ml-0 md:ml-0">

        <div id="editor-wrapper" className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
          {/* Editor */}
          <div className={clsx(
            'flex-1 overflow-auto ',
            showOutput && !isOutputMaximized && 'md:w-[calc(100%-' + outputWidth + '%)]'
          )}>
            <div className="p-2 flex justify-between items-center border-b bg-#151515-100">
              <div className="flex items-center gap-2">
                <div className="font-medium">
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </div>

              </div>
              <div className="flex gap-2 items-center">
                {status === 'saving' && <Loader className="animate-spin text-yellow-600" size={18} />}
                {status === 'saved' && <CheckCircle2 className="text-green-600" size={18} />}
                {status === 'error' && (
                  <XCircle className="text-red-600 cursor-pointer" onClick={() => handleCodeChange(selectedFile.content)} size={18} />
                )}
                                            <Button
                  variant="ghost"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu size={18}/>
                </Button>
    
                <Undo2 size={18} className="cursor-pointer" />
                <Redo2 size={18} className="cursor-pointer" />
                <Copy size={18} className="cursor-pointer" onClick={() => navigator.clipboard.writeText(selectedFile?.content || '')} />
                <Button variant="outline" onClick={runCode}>
                  <PlayCircle size={18} />
                </Button>
                <Button  variant="ghost" onClick={() => setShowOutput(!showOutput)}>
                  {showOutput ? null : <PanelRightClose size={18} />}
                </Button>
              </div>


            </div>
            <div className='flex bg-red-500 h-full'>
              {selectedFile ? (
                isFileLoading ? (
                  <div className="h-full flex items-center justify-center text-gray-400">Loading file...</div>
                ) : (
                  <CodeEditor
                    language={selectedFile.type}
                    value={selectedFile.content}
                    onChange={handleCodeChange}
                toggleMaximize={toggleMaximize}
                closeOutput={toggleOutput}
                  />
                )
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Open a file to start coding</div>
              )}
            </div>

          </div>


          {/* Resizable Divider */}
          {showOutput && !isOutputMaximized && (
            <div
              onMouseDown={() => (isResizing.current = true)}
              className="hidden md:block w-1 bg-gray-300 cursor-col-resize"
            />
          )}

          {/* Output View */}
          {showOutput && (
            <div className={clsx(
              'bg-white border-l border-gray-200 bg-red-700 ',
              'md:relative md:w-[' + outputWidth + '%]',
              'absolute md:static inset-0 md:inset-auto z-20',
              isOutputMaximized && 'w-full h-full',
              !isOutputMaximized && 'h-[300px] md:h-auto'
            )}>
              {selectedFile?.type === 'html' ? (
                <div className="h-full w-full ">
                  <div  className="flex items-center gap-2 bg-gray-200 px-4 py-1 text-sm font-semibold">
                    <div onClick={()=> setShowOutput(!showOutput)}  className="w-3 h-3 bg-red-500 rounded-full" />
                    <div onClick={toggleMaximize} className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    
                    <span className="ml-4">
                      {
                        /<title>(.*?)<\/title>/.exec(selectedFile.content)?.[1] ||
                        selectedFile.name
                      }
                    </span>
                  </div>
                  <OutputViewer code={selectedFile.content} path={selectedFile.path} />
                </div>
              ) : (
                <div className="p-4 overflow-auto whitespace-pre-wrap text-sm">
                  {output}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
