"use client"
import React, { useState, useCallback } from "react";

// Step 1: Virtual File System
const files: Record<string, string> = {
  "/index.html": `<h1>Welcome Home</h1><p><a href="./about.html">About</a></p>`,
  "/about.html": `<h1>About Page</h1><p><a href="./contact.html">Go to Contact</a></p>`,
  "/contact.html": `<h1>Contact Page</h1><p><a href="./index.html">Back Home</a></p>`,
};

// Step 2: Output Component with Link Interception
const Output = ({ html, onNavigate }: { html: string; onNavigate: (href: string) => void }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        const href = target.getAttribute("href");
        if (href && !href.startsWith("http")) {
          e.preventDefault();
          const current = window.location.pathname;
          const newPath = new URL(href, "http://localhost" + current).pathname;
          onNavigate(newPath);
        }
      }
    },
    [onNavigate]
  );

  return (
    <div
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "1rem",
        background: "#fff",
      }}
    />
  );
};

// Step 3: Main App
const App = () => {
  const [currentPath, setCurrentPath] = useState("/index.html");
  const [code, setCode] = useState(files["/index.html"]);

  // Sync code when path changes
  const handleNavigate = (path: string) => {
    if (files[path]) {
      setCurrentPath(path);
      setCode(files[path]);
    } else {
      setCode(`<h1>404 - Not Found</h1><p>No file for ${path}</p>`);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    files[currentPath] = e.target.value;
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Virtual Browser Simulation 🌐</h2>
      <p>
        <strong>Current Path:</strong> {currentPath}
      </p>

      <textarea
        value={code}
        onChange={handleCodeChange}
        rows={10}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <Output html={code} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
