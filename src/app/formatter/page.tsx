"use client";

import { useState, useCallback } from "react";
import JsonEditor from "@/components/JsonEditor";
import CopyButton from "@/components/CopyButton";

export default function FormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);
  const [showInfo, setShowInfo] = useState(false);

  const handleFormat = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(null); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent === 0 ? "\t" : indent));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const handleClear = () => { setInput(""); setOutput(""); setError(null); };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-white mr-2">JSON Formatter</h1>
          <button onClick={handleFormat} className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-95">
            Format
          </button>
          <button onClick={handleClear} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Clear
          </button>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <span>Indent:</span>
            {[2, 4].map((n) => (
              <button key={n} onClick={() => setIndent(n)} className={`rounded px-2 py-0.5 text-xs transition-colors ${indent === n ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setIndent(0)} className={`rounded px-2 py-0.5 text-xs transition-colors ${indent === 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`}>
              Tab
            </button>
          </div>
          {output && <CopyButton text={output} />}
          <button onClick={() => setShowInfo(!showInfo)} className="ml-auto text-xs text-gray-600 hover:text-gray-400">
            {showInfo ? "Hide info" : "ℹ Info"}
          </button>
        </div>
      </div>

      {/* Editors - 占满剩余空间 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">
        <div className="flex flex-col p-3 min-h-0 lg:border-r lg:border-gray-800">
          <JsonEditor value={input} onChange={setInput} label="Input" placeholder="Paste your JSON here..." error={error} />
        </div>
        <div className="flex flex-col p-3 min-h-0">
          <JsonEditor value={output} onChange={() => {}} label="Formatted Output" placeholder="Formatted JSON will appear here..." readOnly />
        </div>
      </div>

      {/* SEO Content - 可折叠 */}
      {showInfo && (
        <div className="shrink-0 border-t border-gray-800 px-6 py-6 bg-gray-900/30">
          <h2 className="mb-2 text-sm font-semibold text-gray-400">How to Format JSON Online</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Paste your raw or minified JSON into the input field. Click Format to beautify it with proper indentation. Choose 2 spaces, 4 spaces, or tabs. Everything runs in your browser — your data never leaves your device.
          </p>
        </div>
      )}
    </div>
  );
}
