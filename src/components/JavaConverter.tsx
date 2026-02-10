"use client";

import { useState, useCallback } from "react";
import JsonEditor from "@/components/JsonEditor";
import CopyButton from "@/components/CopyButton";
import { jsonToJava } from "@/lib/jsonToJava";
import { javaToJson } from "@/lib/javaToJson";

type Direction = "json-to-java" | "java-to-json";

const JAVA_EXAMPLE = `public class UserDTO {

    @JsonProperty("user_name")
    private String userName;

    private Integer age;

    private Boolean isActive;

    private List<String> tags;

    private Address address;

}`;

const JSON_EXAMPLE = `{
  "user_name": "Alice",
  "age": 28,
  "is_active": true,
  "scores": [95, 87, 92],
  "address": {
    "city": "Shanghai",
    "zip_code": "200000"
  }
}`;

interface JavaConverterProps {
  defaultDirection?: Direction;
}

export default function JavaConverter({ defaultDirection = "json-to-java" }: JavaConverterProps) {
  const [direction, setDirection] = useState<Direction>(defaultDirection);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // JSON → Java options
  const [className, setClassName] = useState("MyEntity");
  const [packageName, setPackageName] = useState("com.example.model");
  const [useLombok, setUseLombok] = useState(true);
  const [useJsonProperty, setUseJsonProperty] = useState(true);

  // Java → JSON options
  const [useSnakeCase, setUseSnakeCase] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(null); return; }
    try {
      if (direction === "json-to-java") {
        setOutput(jsonToJava(input, { className, packageName, useLombok, useJsonProperty }));
      } else {
        setOutput(javaToJson(input, useSnakeCase));
      }
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, direction, className, packageName, useLombok, useJsonProperty, useSnakeCase]);

  const handleSwap = () => {
    const newDir = direction === "json-to-java" ? "java-to-json" : "json-to-java";
    setDirection(newDir);
    // 把输出放到输入
    if (output) {
      setInput(output);
      setOutput("");
    }
    setError(null);
  };

  const handleLoadExample = () => {
    setInput(direction === "json-to-java" ? JSON_EXAMPLE : JAVA_EXAMPLE);
    setOutput("");
    setError(null);
  };

  const isJsonToJava = direction === "json-to-java";

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        {/* 第一行：方向选择 + 操作按钮 */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-white mr-1">Java ⇄ JSON</h1>

          {/* 方向切换 - 翻译风格 */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-800 p-0.5">
            <span className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${isJsonToJava ? "bg-emerald-600 text-white" : "text-gray-400"}`}>
              JSON
            </span>
            <button
              onClick={handleSwap}
              className="rounded-md px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors active:scale-90"
              title="Swap direction"
            >
              ⇄
            </button>
            <span className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${!isJsonToJava ? "bg-emerald-600 text-white" : "text-gray-400"}`}>
              Java
            </span>
          </div>

          <button onClick={handleConvert} className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-95">
            Convert
          </button>
          <button onClick={handleLoadExample} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Example
          </button>
          <button onClick={() => { setInput(""); setOutput(""); setError(null); }} className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition-all hover:bg-gray-700 active:scale-95">
            Clear
          </button>
          {output && <CopyButton text={output} />}
          <button onClick={() => setShowInfo(!showInfo)} className="ml-auto text-xs text-gray-600 hover:text-gray-400">
            {showInfo ? "Hide info" : "ℹ Info"}
          </button>
        </div>

        {/* 第二行：选项 */}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
          {isJsonToJava ? (
            <>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-500">Class:</label>
                <input value={className} onChange={(e) => setClassName(e.target.value)} className="w-32 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 outline-none focus:border-emerald-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-500">Package:</label>
                <input value={packageName} onChange={(e) => setPackageName(e.target.value)} className="w-44 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 outline-none focus:border-emerald-500" />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={useLombok} onChange={(e) => setUseLombok(e.target.checked)} className="accent-emerald-500" />
                <span className="text-xs text-gray-400">Lombok @Data</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={useJsonProperty} onChange={(e) => setUseJsonProperty(e.target.checked)} className="accent-emerald-500" />
                <span className="text-xs text-gray-400">@JsonProperty</span>
              </label>
            </>
          ) : (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={useSnakeCase} onChange={(e) => setUseSnakeCase(e.target.checked)} className="accent-emerald-500" />
              <span className="text-xs text-gray-400">snake_case keys</span>
            </label>
          )}
        </div>
      </div>

      {/* Editors */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">
        <div className="flex flex-col p-3 min-h-0 lg:border-r lg:border-gray-800">
          <JsonEditor
            value={input}
            onChange={setInput}
            label={isJsonToJava ? "JSON Input" : "Java Class Input"}
            placeholder={isJsonToJava ? "Paste your JSON here..." : "Paste your Java entity class here..."}
            error={error}
          />
        </div>
        <div className="flex flex-col p-3 min-h-0">
          <JsonEditor
            value={output}
            onChange={() => {}}
            label={isJsonToJava ? "Java Class Output" : "JSON Output"}
            placeholder={isJsonToJava ? "Generated Java class will appear here..." : "Generated JSON will appear here..."}
            readOnly
          />
        </div>
      </div>

      {showInfo && (
        <div className="shrink-0 border-t border-gray-800 px-6 py-6 bg-gray-900/30">
          <h2 className="mb-2 text-sm font-semibold text-gray-400">
            {isJsonToJava ? "JSON to Java Class Generator" : "Java Class to JSON Generator"}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {isJsonToJava
              ? "Paste a JSON object or array and generate a Java POJO class. Supports Lombok @Data, @JsonProperty for snake_case fields, nested objects as inner classes, and List types."
              : "Paste a Java POJO class and generate a sample JSON object. Supports @JsonProperty annotations, common Java types (String, Integer, Boolean, List, Map, Date), and nested objects."}
          </p>
        </div>
      )}
    </div>
  );
}
