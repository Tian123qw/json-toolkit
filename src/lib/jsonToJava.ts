interface JavaClassDef {
  name: string;
  fields: { name: string; type: string; jsonKey: string }[];
}

interface Options {
  className: string;
  packageName: string;
  useLombok: boolean;
  useJsonProperty: boolean;
}

// 首字母大写
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// JSON key 转 Java 驼峰命名
function toCamelCase(key: string): string {
  return key.replace(/[_-](\w)/g, (_, c) => c.toUpperCase());
}

// 推断 Java 类型，同时收集嵌套类
function inferType(key: string, value: unknown, classes: JavaClassDef[]): string {
  if (value === null || value === undefined) return "Object";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "Integer" : "Double";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "List<Object>";
    const itemType = inferType(key, value[0], classes);
    return `List<${itemType}>`;
  }
  if (typeof value === "object") {
    const nestedName = capitalize(toCamelCase(key));
    collectClass(nestedName, value as Record<string, unknown>, classes);
    return nestedName;
  }
  return "Object";
}

// 收集一个类的定义
function collectClass(name: string, obj: Record<string, unknown>, classes: JavaClassDef[]): void {
  // 避免重复
  if (classes.some((c) => c.name === name)) return;

  const fields: JavaClassDef["fields"] = [];
  for (const [key, value] of Object.entries(obj)) {
    const javaName = toCamelCase(key);
    const javaType = inferType(key, value, classes);
    fields.push({ name: javaName, type: javaType, jsonKey: key });
  }
  classes.push({ name, fields });
}

// 生成单个类的代码
function renderClass(def: JavaClassDef, opts: Options, isInner: boolean): string {
  const indent = isInner ? "    " : "";
  const fieldIndent = isInner ? "        " : "    ";
  const lines: string[] = [];

  // 类声明
  if (opts.useLombok) {
    lines.push(`${indent}@Data`);
  }
  const modifier = isInner ? "public static" : "public";
  lines.push(`${indent}${modifier} class ${def.name} {`);
  lines.push("");

  // 字段
  for (const f of def.fields) {
    const needAnnotation = opts.useJsonProperty && f.jsonKey !== f.name;
    if (needAnnotation) {
      lines.push(`${fieldIndent}@JsonProperty("${f.jsonKey}")`);
    }
    lines.push(`${fieldIndent}private ${f.type} ${f.name};`);
  }

  // getter/setter（非 Lombok 模式）
  if (!opts.useLombok && def.fields.length > 0) {
    lines.push("");
    for (const f of def.fields) {
      const cap = capitalize(f.name);
      // getter
      lines.push(`${fieldIndent}public ${f.type} get${cap}() {`);
      lines.push(`${fieldIndent}    return ${f.name};`);
      lines.push(`${fieldIndent}}`);
      lines.push("");
      // setter
      lines.push(`${fieldIndent}public void set${cap}(${f.type} ${f.name}) {`);
      lines.push(`${fieldIndent}    this.${f.name} = ${f.name};`);
      lines.push(`${fieldIndent}}`);
      lines.push("");
    }
  }

  lines.push(`${indent}}`);
  return lines.join("\n");
}

export function jsonToJava(jsonStr: string, opts: Options): string {
  const parsed = JSON.parse(jsonStr);

  // 如果是数组，取第一个元素
  const obj = Array.isArray(parsed)
    ? (parsed[0] as Record<string, unknown>)
    : (parsed as Record<string, unknown>);

  if (typeof obj !== "object" || obj === null) {
    throw new Error("JSON must be an object or an array of objects.");
  }

  const classes: JavaClassDef[] = [];
  collectClass(opts.className, obj, classes);

  // 生成代码
  const lines: string[] = [];

  // package
  if (opts.packageName) {
    lines.push(`package ${opts.packageName};`);
    lines.push("");
  }

  // imports
  const allTypes = classes.flatMap((c) => c.fields.map((f) => f.type));
  const needsList = allTypes.some((t) => t.startsWith("List<"));
  const needsJsonProperty = opts.useJsonProperty && classes.some((c) => c.fields.some((f) => f.jsonKey !== f.name));

  if (needsList) lines.push("import java.util.List;");
  if (opts.useLombok) lines.push("import lombok.Data;");
  if (needsJsonProperty) lines.push("import com.fasterxml.jackson.annotation.JsonProperty;");
  if (needsList || opts.useLombok || needsJsonProperty) lines.push("");

  // 主类
  const mainClass = classes.find((c) => c.name === opts.className)!;
  const innerClasses = classes.filter((c) => c.name !== opts.className);

  if (opts.useLombok) lines.push("@Data");
  lines.push(`public class ${opts.className} {`);
  lines.push("");

  // 主类字段
  for (const f of mainClass.fields) {
    const needAnnotation = opts.useJsonProperty && f.jsonKey !== f.name;
    if (needAnnotation) lines.push(`    @JsonProperty("${f.jsonKey}")`);
    lines.push(`    private ${f.type} ${f.name};`);
  }

  // getter/setter
  if (!opts.useLombok && mainClass.fields.length > 0) {
    lines.push("");
    for (const f of mainClass.fields) {
      const cap = capitalize(f.name);
      lines.push(`    public ${f.type} get${cap}() {`);
      lines.push(`        return ${f.name};`);
      lines.push(`    }`);
      lines.push("");
      lines.push(`    public void set${cap}(${f.type} ${f.name}) {`);
      lines.push(`        this.${f.name} = ${f.name};`);
      lines.push(`    }`);
      lines.push("");
    }
  }

  // 内部类
  for (const inner of innerClasses) {
    lines.push("");
    lines.push(renderClass(inner, opts, true));
  }

  lines.push("}");

  return lines.join("\n");
}
