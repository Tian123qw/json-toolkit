"use client";

import { useState, useCallback } from "react";
import JsonEditor from "@/components/JsonEditor";
import { diffJson, DiffResult } from "@/lib/jsonDiff";

function truncate(val: unknown): string {
  const s = JSON.stringify(val);
  return s.length > 80 ? s.slice(0, 80) + "…" : s;
}

export default function DiffPage() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diffs, setDiffs] = useState<DiffResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleCompare = useCallback(() => {
    if (!left.trim() || !right.trim()) { setError("Please paste JSON in both fields."); setDiffs(null); return; }
    try {
      const a = JSON.parse(left);
      const b = JSON.parse(right);
      setDiffs(diffJson(a, b));
      setError(null);
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
      setDiffs(null);
    }
  }, [left, right]);

  const colors = {
    added: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    removed: "border-red-500/30 bg-red-500/10 text-red-400",
    changed: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  };
  const labels = { added: "+ Added", removed: "− Removed", changed: "~ Changed" };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <div className="shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-white mr-2">JSON Diff</h1>
          <button onClick={handleCompare} className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-95">
            Compare
          </button>
          <button onClick={() => { setLeft(""); setRight(""); setDiffs(null); setError(null); }} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Clear
          </button>
          {error && <span className="text-sm text-red-400">{error}</span>}
          {diffs !== null && !error && (
            <span className="text-sm text-gray-400">
              {diffs.length === 0 ? "✓ Identical" : `${diffs.length} difference${diffs.length > 1 ? "s" : ""}`}
            </span>
          )}
          <button onClick={() => setShowInfo(!showInfo)} className="ml-auto text-xs text-gray-600 hover:text-gray-400">
            {showInfo ? "Hide info" : "ℹ Info"}
          </button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0" style={{ flex: diffs && diffs.length > 0 ? "0 0 50%" : "1" }}>
        <div className="flex flex-col p-3 min-h-0 lg:border-r lg:border-gray-800">
          <JsonEditor value={left} onChange={setLeft} label="Original JSON" placeholder="Paste original JSON..." />
        </div>
        <div className="flex flex-col p-3 min-h-0">
          <JsonEditor value={right} onChange={setRight} label="Modified JSON" placeholder="Paste modified JSON..." />
        </div>
      </div>

      {/* Diff 结果 */}
      {diffs !== null && diffs.length > 0 && (
        <div className="shrink-0 border-t border-gray-800 overflow-y-auto" style={{ maxHeight: "40vh" }}>
          <div className="p-3 space-y-1.5">
            {diffs.map((d, i) => (
              <div key={i} className={`rounded-lg border px-3 py-2 ${colors[d.type]}`}>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span>{labels[d.type]}</span>
                  <code className="font-mono opacity-70">{d.path}</code>
                </div>
                <div className="text-xs font-mono opacity-80 mt-0.5">
                  {d.type === "changed" && (<><div>- {truncate(d.oldValue)}</div><div>+ {truncate(d.newValue)}</div></>)}
                  {d.type === "added" && <div>+ {truncate(d.newValue)}</div>}
                  {d.type === "removed" && <div>- {truncate(d.oldValue)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showInfo && (
        <div className="shrink-0 border-t border-gray-800 px-6 py-6 bg-gray-900/30">
          <h2 className="mb-2 text-sm font-semibold text-gray-400">How JSON Diff Works</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Deep comparison of two JSON documents. Recursively walks through objects and arrays, identifying added, removed, or changed fields with exact paths.
          </p>
        </div>
      )}
    </div>
  );
}
