"use client";

import { useState, useCallback } from "react";
import JsonEditor from "@/components/JsonEditor";

export default function ValidatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleValidate = useCallback(() => {
    if (!input.trim()) { setResult(null); return; }
    try {
      JSON.parse(input);
      setResult({ valid: true, message: "✓ Valid JSON" });
    } catch (e) {
      setResult({ valid: false, message: (e as Error).message });
    }
  }, [input]);

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-white mr-2">JSON Validator</h1>
          <button onClick={handleValidate} className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-95">
            Validate
          </button>
          <button onClick={() => { setInput(""); setResult(null); }} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Clear
          </button>
          {result && (
            <span className={`rounded-lg px-3 py-1 text-sm ${result.valid ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {result.message}
            </span>
          )}
          <button onClick={() => setShowInfo(!showInfo)} className="ml-auto text-xs text-gray-600 hover:text-gray-400">
            {showInfo ? "Hide info" : "ℹ Info"}
          </button>
        </div>
      </div>

      {/* Editor - 全宽全高 */}
      <div className="flex-1 flex flex-col p-3 min-h-0">
        <JsonEditor
          value={input}
          onChange={setInput}
          placeholder="Paste your JSON here to validate..."
          error={result && !result.valid ? result.message : null}
        />
      </div>

      {showInfo && (
        <div className="shrink-0 border-t border-gray-800 px-6 py-6 bg-gray-900/30">
          <h2 className="mb-2 text-sm font-semibold text-gray-400">About JSON Validation</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            JSON must follow strict syntax rules. Common errors include missing commas, unquoted keys, trailing commas, and single quotes instead of double quotes. This validator checks against the official JSON specification.
          </p>
        </div>
      )}
    </div>
  );
}
