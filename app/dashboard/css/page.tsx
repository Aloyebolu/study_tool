/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

const snippets = [
  {
    title: "Text Color (Inline CSS)",
    description: "Change the text color using the 'color' property with inline CSS.",
    code: `<p style="color: red;">This text is red</p>`
  },
  {
    title: "Font Size (Inline CSS)",
    description: "Adjust the font size using 'font-size' in inline CSS.",
    code: `<p style="font-size: 24px;">This is a big text</p>`
  },
  {
    title: "Background Color (Inline CSS)",
    description: "Use 'background-color' to set the background using inline CSS.",
    code: `<p style="background-color: yellow;">Yellow background</p>`
  },
  {
    title: "Text Alignment (Inline CSS)",
    description: "Align text to the center using 'text-align'.",
    code: `<p style="text-align: center;">This text is centered</p>`
  },
  {
    title: "Padding and Margin (Inline CSS)",
    description: "Add padding and margin to space content inside and outside.",
    code: `<p style="padding: 10px; margin: 20px;">Text with padding and margin</p>`
  },
  {
    title: "Border (Inline CSS)",
    description: "Add a border using the 'border' property.",
    code: `<p style="border: 2px solid blue;">Text with a blue border</p>`
  },
  {
    title: "Rounded Corners (Inline CSS)",
    description: "Use 'border-radius' to make corners round.",
    code: `<div style="border: 1px solid black; border-radius: 10px; padding: 10px;">Rounded box</div>`
  },
  {
    title: "Text Transformation (Inline CSS)",
    description: "Use 'text-transform' to make text uppercase.",
    code: `<p style="text-transform: uppercase;">this becomes uppercase</p>`
  },
  {
    title: "Font Family (Inline CSS)",
    description: "Set the font type using 'font-family'.",
    code: `<p style="font-family: Arial, sans-serif;">This text uses Arial</p>`
  },
  {
    title: "Width and Height (Inline CSS)",
    description: "Set element size using width and height.",
    code: `<div style="width: 200px; height: 100px; background-color: pink;">Box</div>`
  },
  {
    title: "Using Class (Internal CSS)",
    description: "Use a class to apply styles via internal CSS.",
    code: `<style>
  .highlight {
    color: white;
    background-color: green;
    padding: 5px;
  }
</style>
<p class="highlight">Styled using class</p>`
  },
  {
    title: "Multiple Elements with Same Class",
    description: "Apply the same style to multiple elements.",
    code: `<style>
  .note {
    font-style: italic;
    color: purple;
  }
</style>
<p class="note">Note one</p>
<p class="note">Note two</p>`
  },
  {
    title: "Button Styling",
    description: "Style a button with internal CSS.",
    code: `<style>
  .btn {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    border: none;
  }
</style>
<button class="btn">Click Me</button>`
  },
  {
    title: "Hover Effect",
    description: "Change style when user hovers over the element.",
    code: `<style>
  .hover-box {
    background-color: lightgray;
    padding: 20px;
  }

  .hover-box:hover {
    background-color: orange;
    color: white;
  }
</style>
<div class="hover-box">Hover over me!</div>`
  },
  {
    title: "Different Font Sizes with Classes",
    description: "Create different classes for font sizes.",
    code: `<style>
  .small { font-size: 12px; }
  .medium { font-size: 18px; }
  .large { font-size: 30px; }
</style>
<p class="small">Small text</p>
<p class="medium">Medium text</p>
<p class="large">Large text</p>`
  },
  {
    title: "Centering a Box with Margin",
    description: "Use 'margin: auto' to center a block.",
    code: `<style>
  .center-box {
    width: 200px;
    background: lightblue;
    margin: auto;
    text-align: center;
  }
</style>
<div class="center-box">Centered box</div>`
  },
  {
    title: "Display Inline vs Block",
    description: "See how span and div behave differently.",
    code: `<style>
  .block { display: block; background: lightgreen; }
  .inline { display: inline; background: pink; }
</style>
<span class="inline">Inline 1</span>
<span class="inline">Inline 2</span>
<div class="block">Block 1</div>
<div class="block">Block 2</div>`
  },
  {
    title: "Text Shadow",
    description: "Apply shadow behind text.",
    code: `<style>
  .shadow-text {
    color: black;
    text-shadow: 2px 2px 5px gray;
  }
</style>
<p class="shadow-text">Text with shadow</p>`
  },
  {
    title: "Box Shadow",
    description: "Add shadow around boxes.",
    code: `<style>
  .shadow-box {
    width: 150px;
    padding: 20px;
    background: white;
    box-shadow: 3px 3px 6px gray;
  }
</style>
<div class="shadow-box">Shadow Box</div>`
  },
  {
    title: "Transparent Background",
    description: "Use rgba to create transparency.",
    code: `<style>
  .transparent {
    background-color: rgba(0, 0, 255, 0.5);
    padding: 20px;
    color: white;
  }
</style>
<div class="transparent">Transparent Background</div>`
  }
];


export default function HTMLSnippetsPage() {
  const [codes, setCodes] = useState(snippets.map(snippet => snippet.code));
  const [outputs, setOutputs] = useState(snippets.map(() => ''));

  const runSnippet = (index: number) => {
    const userCode = codes[index];
    const isFullDoc = /<html[\s>]/i.test(userCode);

    const htmlOutput = isFullDoc
      ? userCode
      : `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: sans-serif;
                border: 1px solid blue;
                height: 200px;
                margin: 0
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ${userCode}
          </body>
        </html>
      `;

    const newOutputs = [...outputs];
    newOutputs[index] = htmlOutput;
    setOutputs(newOutputs);
  };
function highlightTags(text: string) {
    return text.replace(/&/g, "&amp;")
            .replace(/</g, "<span style='color: red'>&lt;")
            .replace(/>/g, "&gt; </span>");
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/</g, "&lt; ") // escape first
    .replace(/>/g, "&gt; class=\"text-blue-400\">&lt;a&gt;</span>")
    .replace(/&lt;a&gt;/g, `<span class="text-blue-400">&lt;a&gt;</span>`)
    .replace(/&lt;\/a&gt;/g, `<span class="text-blue-400">&lt;/a&gt;</span>`);
}

  return (
    <div className="min-h-screen bg-black  p-6 font-mono">

      <h1 className="text-3xl mb-6  font-bold border-b border-green-600 pb-2">🔥 HTML Snippets Playground</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {snippets.map((snippet, index) => (
          <div key={index} className="bg-[#0f0f0f] border border-green-800 p-4 rounded-xl shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-xl font-semibold  mb-2">{snippet.title}</h2>
            {/* <p className="text-green-500 mb-4">{snippet.description}</p> */}
            <p
  className=" mb-4"
  dangerouslySetInnerHTML={{ __html: highlightTags(snippet.description) }}
/>


            <Editor
              height="200px"
              defaultLanguage="html"
              value={codes[index]}
              theme="vs-dark"
              onChange={(value) => {
                const updated = [...codes];
                updated[index] = value || '';
                setCodes(updated);
              }}
            />

            <button
              onClick={() => runSnippet(index)}
              className="bg-green-600 hover:bg-green-700 text-black font-bold py-1 px-4 rounded mt-2"
            >
              Run
            </button>

            <iframe
              className="w-full mt-4 border border-green-700 rounded"
              style={{ height: 200, backgroundColor: 'white' }}
              srcDoc={outputs[index]}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
