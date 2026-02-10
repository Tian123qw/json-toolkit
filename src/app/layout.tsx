import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "JSON Toolkit - Free Online JSON Formatter, Validator & Tools",
    template: "%s | JSON Toolkit",
  },
  description:
    "Free online JSON tools: formatter, validator, minifier, diff, CSV converter and more. Clean UI, no ads, works offline. Built for developers.",
  keywords: [
    "json formatter", "json validator", "json beautifier", "json minify",
    "json diff", "json to csv", "json tools online", "free json formatter",
  ],
  openGraph: {
    title: "JSON Toolkit - Free Online JSON Tools for Developers",
    description: "Format, validate, compare, and convert JSON. Free, fast, no sign-up.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
