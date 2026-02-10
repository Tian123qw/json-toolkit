"use client";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  label?: string;
  error?: string | null;
  fullHeight?: boolean;
}

export default function JsonEditor({
  value,
  onChange,
  placeholder = "Paste your JSON here...",
  readOnly = false,
  label,
  error,
  fullHeight = true,
}: JsonEditorProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullHeight ? "min-h-0 flex-1" : ""}`}>
      {label && (
        <label className="text-sm font-medium text-gray-400 shrink-0">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className={`w-full rounded-lg border bg-gray-900 px-4 py-3 font-mono text-sm leading-relaxed text-gray-200 placeholder-gray-600 outline-none transition-colors resize-none ${
          fullHeight ? "flex-1" : "h-48"
        } ${
          error
            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        } ${readOnly ? "cursor-default bg-gray-900/70" : ""}`}
      />
      {error && <p className="text-xs text-red-400 shrink-0">{error}</p>}
    </div>
  );
}
