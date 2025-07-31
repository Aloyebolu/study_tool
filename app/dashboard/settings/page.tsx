/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';

export default function SettingsEditor() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  const [language, setLanguage] = useState('javascript');

  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/files/settings?settings_key=editor_settings');
        const data = await res.json();

        if (data.settings) {
          setSettings(data.settings);
          setFontSize(data.settings.fontSize || 14);
          setTheme(data.settings.theme || 'vs-dark');
          setLanguage(data.settings.language || 'javascript');
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    const payload = {
      settings_key: 'editor_settings',
      settings: {
        fontSize,
        theme,
        language,
      },
    };

    const res = await fetch('/api/files/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message);
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Editor Settings</h2>

      <div className="mb-4">
        <label className="block mb-1">Font Size</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border px-2 py-1 w-full"
        >
          <option value="vs-dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Default Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 w-full"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="json">JSON</option>
          <option value="html">HTML</option>
        </select>
      </div>

      <button
        onClick={saveSettings}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}
