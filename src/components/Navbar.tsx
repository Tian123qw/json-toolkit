"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const navTools = [
  { href: "/formatter", label: "Formatter" },
  { href: "/validator", label: "Validator" },
  { href: "/minify", label: "Minify" },
  { href: "/diff", label: "Diff" },
  { href: "/json-to-csv", label: "To CSV" },
  { href: "/java-converter", label: "Java ⇄ JSON" },
];

const dropdownTools = [
  { href: "/formatter", label: "✨ Formatter" },
  { href: "/validator", label: "✅ Validator" },
  { href: "/minify", label: "📦 Minify" },
  { href: "/diff", label: "🔍 Diff" },
  { href: "/json-to-csv", label: "📊 JSON → CSV" },
  { href: "/java-converter", label: "☕ Java ⇄ JSON" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Java 相关页面都高亮 Java ⇄ JSON
  const isJavaPage = ["/java-converter", "/json-to-java", "/java-to-json"].includes(pathname);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-white shrink-0">
          <span className="text-emerald-400">{"{ }"}</span> JSON Toolkit
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex gap-1 text-sm">
          {navTools.map((t) => {
            const active = t.href === "/java-converter" ? isJavaPage : pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-md px-3 py-1.5 whitespace-nowrap transition-colors ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* 移动端下拉 */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              open ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            Tools ▾
          </button>
          {open && (
            <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-gray-800 bg-gray-900 py-1 shadow-xl shadow-black/40">
              {dropdownTools.map((t) => {
                const active = t.href === "/java-converter" ? isJavaPage : pathname === t.href;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 text-sm transition-colors ${
                      active ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
