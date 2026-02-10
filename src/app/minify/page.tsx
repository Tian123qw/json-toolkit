"use client";

import { useState, useCallback } from "react";
import JsonEditor from "@/components/JsonEditor";
import CopyButton from "@/components/CopyButton";

export default function MinifyPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleMinify = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(null); setStats(null); return; }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setStats({ before: input.length, after: minified.length });
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setStats(null);
    }
  }, [input]);

  const saved = stats ? Math.round((1 - stats.after / stats.before) * 100) : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <div className="shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-white mr-2">JSON Minify</h1>
          <button onClick={handleMinify} className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-95">
            Minify
          </button>
          <button onClick={() => { setInput(""); setOutput(""); setError(null); setStats(null); }} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Clear
          </button>
          {output && <CopyButton text={output} />}
          {stats && (
            <span className="text-xs text-gray-500">
              {stats.before.toLocaleString()} → {stats.after.toLocaleString()} chars
              <span className="ml-1 text-emerald-400">(-{saved}%)</span>
            </span>
          )}
          <button onClick={() => setShowInfo(!showInfo)} className="ml-auto text-xs text-gray-600 hover:text-gray-400">
            {showInfo ? "Hide info" : "ℹ Info"}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">
        <div className="flex flex-col p-3 min-h-0 lg:border-r lg:border-gray-800">
          <JsonEditor value={input} onChange={setInput} label="Input" placeholder="Paste your formatted JSON here..." error={error} />
        </div>
        <div className="flex flex-col p-3 min-h-0">
          <JsonEditor value={output} onChange={() => {}} label="Minified Output" placeholder="Minified JSON will appear here..." readOnly />
        </div>
      </div>

      {showInfo && (
        <div className="shrink-0 border-t border-gray-800 px-6 py-6 bg-gray-900/30">
          <h2 className="mb-2 text-sm font-semibold text-gray-400">Why Minify JSON?</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Minifying removes whitespace, line breaks, and indentation to reduce file size. This means faster network transfers and lower bandwidth costs. Commonly used in API responses and production configs.
          </p>
        </div>
      )}
    </div>
  );
}
