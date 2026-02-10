"use client";

import { useState, useCallback } from "react";
import JsonEditor from "@/components/JsonEditor";
import CopyButton from "@/components/CopyButton";

function jsonToCsv(data: unknown): string {
  let arr: Record<string, unknown>[];
  if (Array.isArray(data)) {
    arr = data;
  } else if (typeof data === "object" && data !== null) {
    arr = [data as Record<string, unknown>];
  } else {
    throw new Error("JSON must be an array of objects or a single object.");
  }
  if (arr.length === 0) return "";

  const keys = new Set<string>();
  for (const item of arr) {
    if (typeof item === "object" && item !== null) Object.keys(item).forEach((k) => keys.add(k));
  }
  const headers = Array.from(keys);

  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const s = typeof val === "object" ? JSON.stringify(val) : String(val);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? '"' + s.replace(/"/g, '""') + '"' : s;
  };

  const lines = [headers.join(",")];
  for (const item of arr) {
    const obj = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
    lines.push(headers.map((h) => escape(obj[h])).join(","));
  }
  return lines.join("\n");
}

export default function JsonToCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(null); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToCsv(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <div className="shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-white mr-2">JSON to CSV</h1>
          <button onClick={handleConvert} className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-95">
            Convert
          </button>
          <button onClick={() => { setInput(""); setOutput(""); setError(null); }} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Clear
          </button>
          {output && <CopyButton text={output} />}
          {output && (
            <button onClick={handleDownload} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
              ⬇ Download CSV
            </button>
          )}
          <button onClick={() => setShowInfo(!showInfo)} className="ml-auto text-xs text-gray-600 hover:text-gray-400">
            {showInfo ? "Hide info" : "ℹ Info"}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">
        <div className="flex flex-col p-3 min-h-0 lg:border-r lg:border-gray-800">
          <JsonEditor value={input} onChange={setInput} label="JSON Input" placeholder={'[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]'} error={error} />
        </div>
        <div className="flex flex-col p-3 min-h-0">
          <JsonEditor value={output} onChange={() => {}} label="CSV Output" placeholder="CSV output will appear here..." readOnly />
        </div>
      </div>

      {showInfo && (
        <div className="shrink-0 border-t border-gray-800 px-6 py-6 bg-gray-900/30">
          <h2 className="mb-2 text-sm font-semibold text-gray-400">How to Convert JSON to CSV</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Paste a JSON array of objects. The tool extracts all unique keys as CSV headers and maps each object to a row. Nested objects are serialized as JSON strings. Download as .csv or copy to clipboard.
          </p>
        </div>
      )}
    </div>
  );
}
