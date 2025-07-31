/* eslint-disable @typescript-eslint/no-unused-vars */
import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, language, toggleMaximize , closeOutput}) {
  return (
    <div className="h-full w-full ">
      <Editor
        height="100%"
        defaultLanguage={language || "javascript"}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
  "fontFamily": "Fira Code, monospace",
  "lineHeight": 22,
  "letterSpacing": 0.5,
  "wordWrap": "on",
 
  "renderWhitespace": "all",
  "tabSize": 2,
  "insertSpaces": true,
  "autoClosingBrackets": "always",
  "formatOnType": true,
  "formatOnPaste": true,
  "cursorBlinking": "smooth",
  "cursorStyle": "line",
  "mouseWheelZoom": true,
  "smoothScrolling": true,
  "lineNumbers": "on",
  "scrollBeyondLastLine": false,
  "autoIndent": "full",
  "quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "codeLens": true,
  "dragAndDrop": true,
  "colorDecorators": true,
  "acceptSuggestionOnEnter": "on",
  "suggestOnTriggerCharacters": true,
  "showFoldingControls": "always",
  "glyphMargin": true,
  "theme": "vs-dark",
  "wordBasedSuggestions": "allDocuments",
  "snippetSuggestions": "inline",
  "parameterHints": {
    "enabled": true
  },
  "tabCompletion": "on",
  "suggestSelection": "first",
  "language": "html",
//   "autoClosingTags": true,

        }}
      />
    </div>
  );
}
