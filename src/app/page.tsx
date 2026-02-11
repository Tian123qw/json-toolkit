import Link from "next/link";
import Footer from "@/components/Footer";

const tools = [
  {
    href: "/formatter",
    icon: "✨",
    name: "JSON Formatter",
    desc: "Beautify and format your JSON with proper indentation and syntax highlighting.",
    keywords: "json formatter, json beautifier, json pretty print",
  },
  {
    href: "/validator",
    icon: "✅",
    name: "JSON Validator",
    desc: "Validate your JSON and get detailed error messages with line numbers.",
    keywords: "json validator, json checker, json lint",
  },
  {
    href: "/minify",
    icon: "📦",
    name: "JSON Minify",
    desc: "Compress JSON by removing whitespace. Reduce file size for production.",
    keywords: "json minify, json compress, json minifier",
  },
  {
    href: "/diff",
    icon: "🔍",
    name: "JSON Diff",
    desc: "Compare two JSON documents and see exactly what changed.",
    keywords: "json diff, json compare, compare json online",
  },
  {
    href: "/json-to-csv",
    icon: "📊",
    name: "JSON to CSV",
    desc: "Convert JSON arrays to CSV format. Download or copy the result.",
    keywords: "json to csv, json to csv converter, convert json to csv",
  },
  {
    href: "/java-converter",
    icon: "☕",
    name: "Java ⇄ JSON",
    desc: "Convert between JSON and Java classes. Generate POJOs from JSON or sample JSON from entity classes.",
    keywords: "json to java, java to json, json to pojo, java class to json",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute right-1/3 top-8 h-64 w-64 rounded-full bg-cyan-500/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Free Online{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              JSON Tools
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Format, validate, compare, minify, and convert JSON.
            Fast, clean, no sign-up. Built for developers.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-emerald-500/40 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
            >
              <div className="mb-3 text-3xl">{t.icon}</div>
              <h2 className="mb-1.5 text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {t.name}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
