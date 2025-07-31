/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

const snippets = [
  {
    title: "Headings",
    description: "Headings define titles or subtitles using <h1> to <h6>.",
    code: `<h1>This is a main heading</h1>\n<h2>This is a subheading</h2>\n<h3>Smaller heading</h3>`
  },
  {
    title: "Paragraphs",
    description: "The <p> tag defines paragraphs of text.",
    code: `<p>This is a paragraph explaining something interesting.</p>`
  },
  {
    title: "Custom Style",
    description: "This snippet uses style tags to color text.",
    code: `<h1>Hello World</h1>\n<style>\nh1 { color: red; text-align: center; }\n</style>`
  },
  {
    title: "Basic Form Structure",
    description: "This example introduces a basic HTML form with the form tag, method, and action attributes. It includes a text input and a submit button. Students should understand how forms send data.",
    code: `
<form action="/submit" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="username">
  <button type="submit">Submit</button>
</form>
    `
  },
  {
    title: "Text Input and Labels",
    description: "Here, students will learn how to properly associate a label with an input field using the 'for' and 'id' attributes. This improves accessibility and form usability.",
    code: `
<form>
  <label for="email">Email Address:</label>
  <input type="email" id="email" name="email">
</form>
    `
  },
  {
    title: "Password Field",
    description: "This snippet teaches the use of input types like 'password', which masks user input. It’s commonly used in login forms or any scenario where sensitive data is entered.",
    code: `
<form>
  <label for="pwd">Password:</label>
  <input type="password" id="pwd" name="password">
</form>
    `
  },
  {
    title: "Radio Buttons",
    description: "Radio buttons allow users to select one option from a set. This example demonstrates grouping radio buttons using the same 'name' attribute.",
    code: `
<form>
  <p>Choose your gender:</p>
  <label><input type="radio" name="gender" value="male"> Male</label>
  <label><input type="radio" name="gender" value="female"> Female</label>
</form>
    `
  },
  {
    title: "Checkboxes",
    description: "Checkboxes allow users to select multiple options independently. They are great for settings or preferences.",
    code: `
<form>
  <p>Select your hobbies:</p>
  <label><input type="checkbox" name="hobby" value="reading"> Reading</label>
  <label><input type="checkbox" name="hobby" value="music"> Music</label>
  <label><input type="checkbox" name="hobby" value="sports"> Sports</label>
</form>
    `
  },
  {
    title: "Select Dropdown",
    description: "A dropdown menu (select element) is used for selecting one option from a list. This snippet shows how to use 'option' elements inside 'select'.",
    code: `
<form>
  <label for="country">Choose your country:</label>
  <select id="country" name="country">
    <option value="nigeria">Nigeria</option>
    <option value="ghana">Ghana</option>
    <option value="kenya">Kenya</option>
  </select>
</form>
    `
  },
  {
    title: "Textarea for Multi-line Input",
    description: "Textareas are used when we expect the user to write multiple lines of text, like in a feedback or message form.",
    code: `
<form>
  <label for="message">Your Message:</label>
  <textarea id="message" name="message" rows="5" cols="30"></textarea>
</form>
    `
  },
  {
    title: "Full Contact Form",
    description: "This complete form includes various fields like name, email, message, and a submit button. It helps students understand how multiple inputs work together.",
    code: `
<form action="/contact" method="post">
  <label for="fullname">Full Name:</label>
  <input type="text" id="fullname" name="fullname"><br><br>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email"><br><br>

  <label for="msg">Message:</label><br>
  <textarea id="msg" name="message" rows="4" cols="40"></textarea><br><br>

  <button type="submit">Send Message</button>
</form>
    `
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
                padding: 1rem;
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
