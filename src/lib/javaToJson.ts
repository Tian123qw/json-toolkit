interface FieldInfo {
  jsonKey: string;
  type: string;
}

// 从 @JsonProperty 注解提取 key
function extractJsonProperty(line: string): string | null {
  const match = line.match(/@JsonProperty\s*\(\s*"([^"]+)"\s*\)/);
  return match ? match[1] : null;
}

// Java 驼峰转 snake_case
function toSnakeCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

// 根据 Java 类型生成默认 JSON 值
function defaultValue(type: string, useSnake: boolean): unknown {
  const t = type.trim();

  // 基本类型
  if (["String", "string", "CharSequence"].includes(t)) return "";
  if (["int", "Integer", "long", "Long", "short", "Short", "byte", "Byte"].includes(t)) return 0;
  if (["double", "Double", "float", "Float", "BigDecimal"].includes(t)) return 0.0;
  if (["boolean", "Boolean"].includes(t)) return false;
  if (["char", "Character"].includes(t)) return "";
  if (["Date", "LocalDate", "LocalDateTime", "Instant", "ZonedDateTime", "Timestamp"].includes(t)) return "2026-01-01T00:00:00Z";

  // List/Set/Collection
  const listMatch = t.match(/^(?:List|ArrayList|LinkedList|Set|HashSet|Collection)<\s*(.+?)\s*>$/);
  if (listMatch) {
    const inner = defaultValue(listMatch[1], useSnake);
    return [inner];
  }

  // Map
  const mapMatch = t.match(/^(?:Map|HashMap|TreeMap|LinkedHashMap)<\s*(.+?)\s*,\s*(.+?)\s*>$/);
  if (mapMatch) {
    const key = defaultValue(mapMatch[1], useSnake);
    const val = defaultValue(mapMatch[2], useSnake);
    return { [String(key || "key")]: val };
  }

  // 数组
  if (t.endsWith("[]")) {
    const inner = defaultValue(t.slice(0, -2), useSnake);
    return [inner];
  }

  // Object 或未知类型
  if (t === "Object" || t === "object") return null;

  // 其他自定义类型 → 空对象
  return {};
}

export function javaToJson(javaCode: string, useSnakeCase: boolean): string {
  const lines = javaCode.split("\n");
  const fields: FieldInfo[] = [];

  let pendingJsonProperty: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // 检查 @JsonProperty 注解
    const jp = extractJsonProperty(line);
    if (jp !== null) {
      pendingJsonProperty = jp;
      continue;
    }

    // 匹配字段声明: private/protected/public Type fieldName;
    const fieldMatch = line.match(
      /^(?:private|protected|public)\s+(?:static\s+)?(?:final\s+)?(.+?)\s+(\w+)\s*(?:=.*)?;/
    );

    if (fieldMatch) {
      // 跳过 static final 常量
      if (line.includes("static") && line.includes("final")) {
        pendingJsonProperty = null;
        continue;
      }

      const type = fieldMatch[1];
      const name = fieldMatch[2];

      // 跳过 serialVersionUID
      if (name === "serialVersionUID") {
        pendingJsonProperty = null;
        continue;
      }

      let jsonKey: string;
      if (pendingJsonProperty) {
        jsonKey = pendingJsonProperty;
        pendingJsonProperty = null;
      } else if (useSnakeCase) {
        jsonKey = toSnakeCase(name);
      } else {
        jsonKey = name;
      }

      fields.push({ jsonKey, type });
    } else {
      // 非字段行，重置 pending 注解
      if (!line.startsWith("@")) {
        pendingJsonProperty = null;
      }
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields found. Make sure your Java class has field declarations like: private String name;");
  }

  const obj: Record<string, unknown> = {};
  for (const f of fields) {
    obj[f.jsonKey] = defaultValue(f.type, useSnakeCase);
  }

  return JSON.stringify(obj, null, 2);
}
