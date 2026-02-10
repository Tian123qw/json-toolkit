"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
