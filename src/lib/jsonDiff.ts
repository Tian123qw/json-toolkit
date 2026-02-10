export interface DiffResult {
  path: string;
  type: "added" | "removed" | "changed";
  oldValue?: unknown;
  newValue?: unknown;
}

export function diffJson(a: unknown, b: unknown, path = ""): DiffResult[] {
  const results: DiffResult[] = [];

  if (a === b) return results;

  // 类型不同
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    results.push({ path: path || "(root)", type: "changed", oldValue: a, newValue: b });
    return results;
  }

  // 都是数组
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const p = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= a.length) {
        results.push({ path: p, type: "added", newValue: b[i] });
      } else if (i >= b.length) {
        results.push({ path: p, type: "removed", oldValue: a[i] });
      } else {
        results.push(...diffJson(a[i], b[i], p));
      }
    }
    return results;
  }

  // 都是对象
  if (a && b && typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);

    for (const key of allKeys) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in aObj)) {
        results.push({ path: p, type: "added", newValue: bObj[key] });
      } else if (!(key in bObj)) {
        results.push({ path: p, type: "removed", oldValue: aObj[key] });
      } else {
        results.push(...diffJson(aObj[key], bObj[key], p));
      }
    }
    return results;
  }

  // 基本类型不同
  if (a !== b) {
    results.push({ path: path || "(root)", type: "changed", oldValue: a, newValue: b });
  }

  return results;
}
