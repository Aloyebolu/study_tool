/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useRef, useState } from 'react';

export default function OutputViewer({ code, path }) {
  const iframeRef = useRef(null);
  const [history, setHistory] = useState([{ path, code }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const current = history[currentIndex];

  const resolvePath = (base, relative) => {
    const stack = base.split('/');
    const parts = relative.split('/');
    stack.pop(); // remove current file

    for (const part of parts) {
      if (part === '.' || part === '') continue;
      if (part === '..') stack.pop();
      else stack.push(part);
    }

    return stack.join('/');
  };

  const prepareCode = (code, currentPath) => {
    const parser = document.createElement('html');
    parser.innerHTML = code;

    const base = document.createElement('base');
    base.setAttribute('href', '/');
    parser.querySelector('head')?.prepend(base);

    const interceptScript = document.createElement('script');
    interceptScript.innerHTML = `
      document.addEventListener('click', function(e) {
        const a = e.target.closest('a');
        if (a && a.getAttribute('href') && !a.getAttribute('href').startsWith('http')) {
          e.preventDefault();
          window.parent.postMessage({ type: 'navigate', href: a.getAttribute('href') }, '*');
        }
      });
    `;
    parser.querySelector('body')?.append(interceptScript);

    return '<!DOCTYPE html>' + parser.outerHTML;
  };

  const updateIframe = () => {
    if (!iframeRef.current) return;
    setLoading(true);

    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc.open();
    iframeDoc.write(prepareCode(current.code, current.path));
    iframeDoc.close();

    setTimeout(() => setLoading(false), 300);
  };

  // Load or update current path
  useEffect(() => {
    updateIframe();
  }, [currentIndex]);
// Detect external code updates
useEffect(() => {
  const current = history[currentIndex];
  if (code !== current.code || path !== current.path) {
    const newHistory = [...history];
    newHistory[currentIndex] = { path, code };
    setHistory(newHistory);
  }
}, [code, path]);

  // Handle internal iframe link clicks
  useEffect(() => {
    const listener = async (e) => {
      if (e.data?.type === 'navigate') {
        const href = e.data.href;
        const newPath = resolvePath(current.path, href);

        const existing = history.find(h => h.path === newPath);
        if (existing) {
          const index = history.findIndex(h => h.path === newPath);
          setCurrentIndex(index);
        } else {
          try {
            const res = await fetch(`/api/files/path?path=${encodeURIComponent(newPath)}`);

            if (!res.ok) return alert(`File not found: ${newPath}`);
            const file = await res.json();
            const newHistory = [...history.slice(0, currentIndex + 1), { path: newPath, code: file.data.content }];
            setHistory(newHistory);
            setCurrentIndex(newHistory.length - 1);
          } catch {
            alert(`Failed to load: ${newPath}`);
          }
        }
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [current, history, currentIndex]);

  const goBack = () => setCurrentIndex(i => Math.max(0, i - 1));
  const goForward = () => setCurrentIndex(i => Math.min(history.length - 1, i + 1));
  const reload = () => updateIframe();
  

  return (
    <div className="w-full h-full bg-#ffffff11 border rounded-xl shadow-md flex flex-col">
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <div className="flex gap-2">
          <button onClick={goBack} disabled={currentIndex === 0} className="text-gray-500 hover:text-black">⏪</button>
          <button onClick={goForward} disabled={currentIndex === history.length - 1} className="text-gray-500 hover:text-black">⏩</button>
          <button onClick={reload} className="text-gray-500 hover:text-black">🔄</button>
        </div>
        <div className="text-xs text-gray-700 truncate max-w-sm">{current.path}</div>
        <div>{loading && <span className="animate-spin">🌀</span>}</div>
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-none"
        title="Output Viewer"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
