import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSnippets,
  saveSnippet,
  deleteSnippet,
  generateId,
  LANGUAGES,
  CodeSnippet,
  Language,
} from "../config/codeSnippetStore";

interface Props {
  onBack: () => void;
  isAdmin?: boolean;
}

// ── Language badge colours ────────────────────────────────────────────────────
const LANG_COLORS: Record<string, { bg: string; text: string }> = {
  Python: { bg: "#dbeafe", text: "#1d4ed8" },
  JavaScript: { bg: "#fef9c3", text: "#854d0e" },
  TypeScript: { bg: "#e0e7ff", text: "#4338ca" },
  HTML: { bg: "#ffedd5", text: "#c2410c" },
  CSS: { bg: "#f0fdf4", text: "#15803d" },
  SQL: { bg: "#fce7f3", text: "#9d174d" },
  Bash: { bg: "#f1f5f9", text: "#475569" },
  JSON: { bg: "#ecfdf5", text: "#065f46" },
  Markdown: { bg: "#f5f3ff", text: "#6d28d9" },
};

function LangBadge({ lang }: { lang: string }) {
  const c = LANG_COLORS[lang] ?? { bg: "#f1f5f9", text: "#334155" };
  return (
    <span
      style={{
        display: "inline-block",
        background: c.bg,
        color: c.text,
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.06em",
        padding: "2px 7px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {lang}
    </span>
  );
}

// ── Markdown renderer ─────────────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inCodeBlock = false;
  let inUl = false;
  let codeLines: string[] = [];

  const closeUl = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
  };

  const inlineFormat = (text: string): string => {
    // code blocks first to avoid double-processing
    text = text.replace(/`([^`]+)`/g, (_, c) =>
      `<code style="font-family:'JetBrains Mono',monospace;font-size:0.88em;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#0f172a">${escapeHtml(c)}</code>`
    );
    // bold
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // italic (not preceded by another *)
    text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
    // links
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;text-decoration:underline">$1</a>'
    );
    return text;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw;

    // fenced code block
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        out.push(
          `<pre style="background:#1e293b;color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:12px;padding:14px 16px;border-radius:6px;overflow-x:auto;margin:12px 0"><code>${codeLines.map(escapeHtml).join("\n")}</code></pre>`
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        closeUl();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // hr
    if (/^-{3,}$/.test(line.trim())) {
      closeUl();
      out.push('<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>');
      continue;
    }

    // headings
    const h3 = line.match(/^### (.+)/);
    if (h3) {
      closeUl();
      out.push(
        `<h3 style="font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:#0f172a;margin:18px 0 6px">${inlineFormat(h3[1])}</h3>`
      );
      continue;
    }
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      closeUl();
      out.push(
        `<h2 style="font-family:'Fraunces',serif;font-size:20px;font-weight:800;color:#0f172a;margin:22px 0 8px">${inlineFormat(h2[1])}</h2>`
      );
      continue;
    }
    const h1 = line.match(/^# (.+)/);
    if (h1) {
      closeUl();
      out.push(
        `<h1 style="font-family:'Fraunces',serif;font-size:26px;font-weight:900;color:#0f172a;margin:0 0 12px">${inlineFormat(h1[1])}</h1>`
      );
      continue;
    }

    // list items
    const li = line.match(/^[-*] (.+)/);
    if (li) {
      if (!inUl) {
        out.push('<ul style="margin:8px 0;padding-left:20px;list-style:disc">');
        inUl = true;
      }
      out.push(
        `<li style="font-family:'Outfit',sans-serif;font-size:14px;color:#334155;margin:3px 0;line-height:1.6">${inlineFormat(li[1])}</li>`
      );
      continue;
    }

    closeUl();

    // blank line
    if (line.trim() === "") {
      out.push("<br/>");
      continue;
    }

    // paragraph
    out.push(
      `<p style="font-family:'Outfit',sans-serif;font-size:14px;color:#334155;margin:4px 0;line-height:1.7">${inlineFormat(line)}</p>`
    );
  }

  closeUl();
  return out.join("");
}

const DEFAULT_MD = `# Study Notes: Data Structures & Algorithms

## Overview

These notes cover the core data structures and algorithms you'll encounter in technical interviews and real-world engineering.

---

## Linear Data Structures

### Arrays

Arrays store elements in **contiguous memory**. Access is O(1), insertion/deletion at arbitrary positions is O(n).

- Fixed-size in languages like C; dynamic in Python, JS, etc.
- Use when you need **fast indexed access** and infrequent insertions.

### Linked Lists

A linked list consists of *nodes* where each node holds a value and a pointer to the next node.

- Insertion and deletion at head/tail is O(1).
- No random access — traversal is O(n).

---

## Sorting Algorithms

| Algorithm | Best | Average | Worst | Stable? |
|-----------|------|---------|-------|---------|
| Quicksort | O(n log n) | O(n log n) | O(n²) | No |
| Mergesort | O(n log n) | O(n log n) | O(n log n) | Yes |

Use \`arr.sort()\` for built-in sort in most languages.

---

## Code Example: Binary Search

\`\`\`
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
\`\`\`

Time complexity: **O(log n)** — halves the search space each iteration.

---

## Tips & Resources

- Practice on [LeetCode](https://leetcode.com) and [HackerRank](https://hackerrank.com)
- Read *Introduction to Algorithms* (CLRS) for rigorous proofs.
- For interviews, focus on *Big-O analysis* before writing code.

---

*Last updated: 2026-09-11*
`;

// ── Add Snippet Modal ─────────────────────────────────────────────────────────
interface AddSnippetModalProps {
  onSave: (s: CodeSnippet) => void;
  onCancel: () => void;
}

function AddSnippetModal({ onSave, onCancel }: AddSnippetModalProps) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !code.trim()) return;
    const snippet: CodeSnippet = {
      id: generateId(),
      title: title.trim(),
      language,
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      code,
      createdAt: new Date().toISOString(),
    };
    onSave(snippet);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    fontFamily: "'Outfit',sans-serif",
    fontSize: 13,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Outfit',sans-serif",
    fontSize: 12,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 28,
          width: "min(540px,92vw)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces',serif",
            fontSize: 20,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Add New Snippet
        </div>

        <div>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Binary Search"
          />
        </div>

        <div>
          <label style={labelStyle}>Language</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <input
            style={inputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this snippet does"
          />
        </div>

        <div>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            style={inputStyle}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. array, sorting, beginner"
          />
        </div>

        <div>
          <label style={labelStyle}>Code *</label>
          <textarea
            style={{
              ...inputStyle,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              minHeight: 200,
              resize: "vertical",
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #334155",
              lineHeight: 1.6,
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your code here"
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              background: "#fff",
              color: "#475569",
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 18px",
              border: "none",
              borderRadius: 6,
              background: "#3b82f6",
              color: "#fff",
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Snippet
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sandbox Tab ───────────────────────────────────────────────────────────────
const DEFAULT_SANDBOX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Sandbox</title>
</head>
<body class="bg-gray-50 min-h-screen p-8">
  <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Hello, Tailwind!</h1>
    <p class="text-gray-500 mb-6">Edit the HTML on the left to see your changes live.</p>
    <div class="flex gap-3">
      <button class="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Primary</button>
      <button class="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">Secondary</button>
    </div>
    <div class="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <p class="text-indigo-700 text-sm font-medium">Tailwind CSS is loaded via CDN inside this sandbox.</p>
    </div>
  </div>
</body>
</html>`;

function SandboxTab() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [code, setCode] = useState(DEFAULT_SANDBOX_HTML);
  const [preview, setPreview] = useState(DEFAULT_SANDBOX_HTML);
  const [copied, setCopied] = useState(false);

  const schedulePreview = (val: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPreview(val), 900);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const copyCode = () => {
    navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  };

  return (
    <div style={{ display: "flex", gap: 0, height: "72vh", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      {/* Editor panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#94a3b8" }}>HTML + Tailwind CSS Editor</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={copyCode} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: copied ? "#22c55e" : "#94a3b8", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={() => { setCode(DEFAULT_SANDBOX_HTML); setPreview(DEFAULT_SANDBOX_HTML); }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => { setCode(e.target.value); schedulePreview(e.target.value); }}
          spellCheck={false}
          style={{
            flex: 1, resize: "none", border: "none", outline: "none",
            background: "#0f172a", color: "#e2e8f0",
            fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7,
            padding: "16px 20px", overflowY: "auto",
          }}
        />
      </div>
      {/* Preview panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 16px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#6b7280" }}>Live Preview</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d1d5db", marginLeft: "auto" }}>auto-refreshes · Tailwind CDN active</span>
        </div>
        <iframe
          srcDoc={preview}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          style={{ flex: 1, border: "none", width: "100%", background: "#fff" }}
          title="HTML/Tailwind Sandbox Preview"
        />
      </div>
    </div>
  );
}

// ── JSON Tree Renderer ────────────────────────────────────────────────────────
function JsonNode({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const indent = depth * 20;
  if (data === null) return <span style={{ color: "#ef4444" }}>null</span>;
  if (typeof data === "boolean") return <span style={{ color: "#f97316" }}>{data ? "true" : "false"}</span>;
  if (typeof data === "number") return <span style={{ color: "#3b82f6" }}>{data}</span>;
  if (typeof data === "string") return <span style={{ color: "#22c55e" }}>"{data}"</span>;
  if (Array.isArray(data)) {
    if (data.length === 0) return <span style={{ color: "#9ca3af" }}>[]</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, padding: "0 4px" }}>
          {collapsed ? "▶" : "▼"}
        </button>
        <span style={{ color: "#9ca3af" }}>[{collapsed ? " " + data.length + " items " : ""}</span>
        {!collapsed && (
          <span>
            {data.map((v, i) => (
              <div key={i} style={{ marginLeft: indent + 20 }}>
                <span style={{ color: "#9ca3af", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{i}: </span>
                <JsonNode data={v} depth={depth + 1} />
                {i < data.length - 1 && <span style={{ color: "#9ca3af" }}>,</span>}
              </div>
            ))}
          </span>
        )}
        <span style={{ color: "#9ca3af" }}>]</span>
      </span>
    );
  }
  if (typeof data === "object") {
    const keys = Object.keys(data as object);
    if (keys.length === 0) return <span style={{ color: "#9ca3af" }}>{"{}"}</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, padding: "0 4px" }}>
          {collapsed ? "▶" : "▼"}
        </button>
        <span style={{ color: "#9ca3af" }}>{"{"}{collapsed ? " " + keys.length + " keys " : ""}</span>
        {!collapsed && (
          <span>
            {keys.map((k, i) => (
              <div key={k} style={{ marginLeft: indent + 20 }}>
                <span style={{ color: "#a855f7", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>"{k}"</span>
                <span style={{ color: "#9ca3af" }}>: </span>
                <JsonNode data={(data as Record<string, unknown>)[k]} depth={depth + 1} />
                {i < keys.length - 1 && <span style={{ color: "#9ca3af" }}>,</span>}
              </div>
            ))}
          </span>
        )}
        <span style={{ color: "#9ca3af" }}>{"}"}</span>
      </span>
    );
  }
  return <span style={{ color: "#e2e8f0" }}>{String(data)}</span>;
}

// ── Inspector Tab ─────────────────────────────────────────────────────────────
const SAMPLE_JSON = `{
  "name": "KnowledgeOS",
  "version": "2.0.0",
  "modules": ["ChemToolkit", "GovtExam", "CodeSnippet", "STEM"],
  "settings": {
    "darkMode": false,
    "language": "en",
    "autoSave": true
  },
  "stats": {
    "totalUsers": 42,
    "sessionsToday": 7,
    "uptime": 99.9
  }
}`;

function InspectorTab() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [parsed, setParsed] = useState<unknown>(null);
  const [parseError, setParseError] = useState("");
  const [beautified, setBeautified] = useState("");

  // REST Client state
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ status: number; statusText: string; headers: Record<string, string>; data: unknown } | null>(null);
  const [fetchError, setFetchError] = useState("");

  const analyze = (val: string) => {
    try {
      const p = JSON.parse(val);
      setParsed(p);
      setBeautified(JSON.stringify(p, null, 2));
      setParseError("");
    } catch (e) {
      setParsed(null);
      setBeautified("");
      setParseError(String(e));
    }
  };

  useEffect(() => { analyze(SAMPLE_JSON); }, []);

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setFetchError("");
    try {
      let parsedHeaders: Record<string, string> = {};
      try { parsedHeaders = JSON.parse(headers); } catch {}
      const opts: RequestInit = { method, headers: parsedHeaders };
      if (method !== "GET" && method !== "HEAD" && body.trim()) opts.body = body;
      const res = await fetch(url, opts);
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => { resHeaders[k] = v; });
      let data: unknown;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      setResponse({ status: res.status, statusText: res.statusText, headers: resHeaders, data });
    } catch (e) {
      setFetchError("Request failed: " + String(e) + ". Check URL and CORS policy.");
    }
    setLoading(false);
  };

  const jsonStats = parsed !== null ? (() => {
    const countDepth = (v: unknown, d = 0): number => {
      if (v === null || typeof v !== "object") return d;
      return Math.max(...Object.values(v as object).map(x => countDepth(x, d + 1)), d);
    };
    const countKeys = (v: unknown): number => {
      if (!v || typeof v !== "object") return 0;
      if (Array.isArray(v)) return v.reduce((s, x) => s + countKeys(x), 0);
      return Object.keys(v).length + Object.values(v).reduce((s: number, x) => s + countKeys(x), 0);
    };
    return { depth: countDepth(parsed), keys: countKeys(parsed), type: Array.isArray(parsed) ? "Array" : typeof parsed === "object" ? "Object" : typeof parsed };
  })() : null;

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Section 1: JSON Inspector */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          🔍 JSON Inspector & Formatter
        </div>
        <div style={{ display: "flex", gap: 16, height: 440 }}>
          {/* Input */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#1e293b", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#94a3b8" }}>Input JSON</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setJsonInput(beautified || jsonInput); analyze(beautified || jsonInput); }}
                  style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>Beautify</button>
                <button onClick={() => { setJsonInput(""); setParsed(null); setParseError(""); setBeautified(""); }}
                  style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>Clear</button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={e => { setJsonInput(e.target.value); analyze(e.target.value); }}
              spellCheck={false}
              style={{ flex: 1, resize: "none", border: "none", outline: "none", background: "#0f172a", color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.6, padding: "12px 16px" }}
            />
          </div>
          {/* Tree view */}
          <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#f8fafc", padding: "8px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#6b7280" }}>Tree View</span>
              {jsonStats && (
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af" }}>
                  {jsonStats.type} · {jsonStats.keys} keys · depth {jsonStats.depth}
                </span>
              )}
              {parseError && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#ef4444" }}>⚠ Parse error</span>}
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", background: "#fff", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8 }}>
              {parseError ? (
                <div style={{ color: "#ef4444", fontSize: 13 }}>{parseError}</div>
              ) : parsed !== null ? (
                <JsonNode data={parsed} />
              ) : (
                <div style={{ color: "#9ca3af" }}>Paste valid JSON to inspect</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: REST Client */}
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          ⚡ REST API Client
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
          {/* URL bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <select value={method} onChange={e => setMethod(e.target.value)}
              style={{ background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#111827", cursor: "pointer", fontWeight: 700 }}>
              {["GET","POST","PUT","PATCH","DELETE"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              style={{ flex: 1, border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#111827", outline: "none", background: "#fff" }} />
            <button onClick={sendRequest} disabled={loading}
              style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", minWidth: 80, opacity: loading ? 0.6 : 1 }}>
              {loading ? "..." : "Send"}
            </button>
          </div>
          {/* Quick URLs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {["https://jsonplaceholder.typicode.com/posts/1","https://jsonplaceholder.typicode.com/users","https://api.github.com/repos/vitejs/vite"].map(u => (
              <button key={u} onClick={() => setUrl(u)}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "#e0f2fe", border: "none", color: "#0369a1", cursor: "pointer" }}>
                {u.split("/").slice(-2).join("/")}
              </button>
            ))}
          </div>
          {/* Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Headers (JSON)</div>
              <textarea value={headers} onChange={e => setHeaders(e.target.value)} rows={3}
                style={{ width: "100%", resize: "none", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#111827", outline: "none", background: "#fff" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Body (JSON, for POST/PUT/PATCH)</div>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
                placeholder='{"key": "value"}'
                style={{ width: "100%", resize: "none", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#111827", outline: "none", background: "#fff" }} />
            </div>
          </div>
        </div>
        {/* CORS notice */}
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af", marginBottom: 12 }}>
          ⚠ CORS policy applies — only CORS-enabled APIs will respond. Try JSONPlaceholder or GitHub API.
        </div>
        {fetchError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#991b1b", marginBottom: 16 }}>{fetchError}</div>
        )}
        {response && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: response.status < 300 ? "#f0fdf4" : "#fef2f2", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: response.status < 300 ? "#16a34a" : "#dc2626" }}>
                {response.status} {response.statusText}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af" }}>
                {Object.keys(response.headers).length} headers
              </span>
            </div>
            <div style={{ maxHeight: 360, overflow: "auto", padding: "14px 18px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8 }}>
              {typeof response.data === "string" ? (
                <pre style={{ color: "#374151", whiteSpace: "pre-wrap" }}>{response.data}</pre>
              ) : (
                <JsonNode data={response.data} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CodeSnippetSection({ onBack, isAdmin = false }: Props) {
  const [activeTab, setActiveTab] = useState<"snippets" | "markdown" | "sandbox" | "inspector">("snippets");
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<string>("All");
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [markdownInput, setMarkdownInput] = useState(DEFAULT_MD);

  // Load snippets
  useEffect(() => {
    setSnippets(getSnippets());
  }, []);

  const reload = useCallback(() => {
    const all = getSnippets();
    setSnippets(all);
    return all;
  }, []);

  // Derived
  const filtered = snippets.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));
    const matchLang = langFilter === "All" || s.language === langFilter;
    return matchSearch && matchLang;
  });

  const selected = snippets.find((s) => s.id === selectedId) ?? null;

  const handleCopy = async () => {
    if (!selected) return;
    if (window.navigator && window.navigator.clipboard) {
      try {
        await window.navigator.clipboard.writeText(selected.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard not available — silently fail
      }
    }
  };

  const handleSaveSnippet = (s: CodeSnippet) => {
    saveSnippet(s);
    const all = reload();
    setSelectedId(s.id);
    setShowAddModal(false);
    void all;
  };

  const handleDelete = (id: string) => {
    deleteSnippet(id);
    reload();
    if (selectedId === id) setSelectedId(null);
    setConfirmDelete(null);
  };

  // ── Tab bar ─────────────────────────────────────────────────────────────────
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px",
    border: "none",
    borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
    background: "none",
    fontFamily: "'Outfit',sans-serif",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    color: active ? "#3b82f6" : "#64748b",
    cursor: "pointer",
    transition: "color 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", paddingTop: 58, background: "#fff" }}>
      {/* Header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 0",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#475569",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            cursor: "pointer",
            marginBottom: 28,
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: "#3b82f6",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Section · Code Vault
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: "clamp(26px,4vw,42px)",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 8px",
              lineHeight: 1.05,
            }}
          >
            Code Snippet Vault
          </h1>
          <p
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 14,
              color: "#64748b",
              margin: 0,
            }}
          >
            Multi-language code repository with live Markdown renderer.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 0 }}>
          <button style={tabStyle(activeTab === "snippets")} onClick={() => setActiveTab("snippets")}>
            Snippets
          </button>
          <button style={tabStyle(activeTab === "markdown")} onClick={() => setActiveTab("markdown")}>
            Markdown Renderer
          </button>
          <button style={tabStyle(activeTab === "sandbox")} onClick={() => setActiveTab("sandbox")}>
            ⬡ Sandbox
          </button>
          <button style={tabStyle(activeTab === "inspector")} onClick={() => setActiveTab("inspector")}>
            🔍 Inspector
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 24px 48px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {activeTab === "snippets" && (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Sidebar */}
            <div
              style={{
                width: 280,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    width: "100%",
                    padding: "9px 0",
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 7,
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add Snippet
                </button>
              )}

              {/* Search */}
              <input
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 13,
                  color: "#0f172a",
                  outline: "none",
                  background: "#f8fafc",
                }}
                placeholder="Search snippets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Language filter pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["All", ...LANGUAGES].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangFilter(l)}
                    style={{
                      padding: "3px 9px",
                      border: "1px solid",
                      borderColor: langFilter === l ? "#3b82f6" : "#e2e8f0",
                      borderRadius: 20,
                      background: langFilter === l ? "#eff6ff" : "#fff",
                      color: langFilter === l ? "#3b82f6" : "#64748b",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 11,
                      fontWeight: langFilter === l ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.12s",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Snippet list */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                {filtered.length === 0 && (
                  <div
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 13,
                      color: "#94a3b8",
                      padding: "20px 0",
                      textAlign: "center",
                    }}
                  >
                    No snippets found.
                  </div>
                )}
                {filtered.map((s) => {
                  const isSelected = s.id === selectedId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      style={{
                        textAlign: "left",
                        background: isSelected ? "#f0f7ff" : "#fff",
                        border: "1px solid",
                        borderColor: isSelected ? "#bfdbfe" : "#e2e8f0",
                        borderLeft: isSelected ? "3px solid #3b82f6" : "1px solid #e2e8f0",
                        borderRadius: 7,
                        padding: "10px 12px",
                        cursor: "pointer",
                        transition: "background 0.1s",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 4,
                        }}
                      >
                        <LangBadge lang={s.language} />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0f172a",
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        {s.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 11,
                          color: "#64748b",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.4,
                        }}
                      >
                        {s.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right panel */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {selected ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Snippet header */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <LangBadge lang={selected.language} />
                      {selected.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            display: "inline-block",
                            background: "#f1f5f9",
                            color: "#64748b",
                            fontFamily: "'Outfit',sans-serif",
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 20,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Fraunces',serif",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: "0 0 6px",
                        lineHeight: 1.15,
                      }}
                    >
                      {selected.title}
                    </h2>
                    {selected.description && (
                      <p
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 14,
                          color: "#475569",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {selected.description}
                      </p>
                    )}
                  </div>

                  {/* Code block */}
                  <div style={{ position: "relative" }}>
                    <pre
                      style={{
                        background: "#1e293b",
                        color: "#e2e8f0",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 13,
                        padding: 20,
                        borderRadius: 8,
                        overflowX: "auto",
                        overflowY: "auto",
                        maxHeight: "60vh",
                        margin: 0,
                        whiteSpace: "pre",
                        lineHeight: 1.65,
                      }}
                    >
                      {selected.code}
                    </pre>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={handleCopy}
                      style={{
                        padding: "8px 18px",
                        background: copied ? "#22c55e" : "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.2s",
                        minWidth: 140,
                      }}
                    >
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>

                    {isAdmin && (
                      <>
                        {confirmDelete === selected.id ? (
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span
                              style={{
                                fontFamily: "'Outfit',sans-serif",
                                fontSize: 13,
                                color: "#ef4444",
                              }}
                            >
                              Delete this snippet?
                            </span>
                            <button
                              onClick={() => handleDelete(selected.id)}
                              style={{
                                padding: "8px 14px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                fontFamily: "'Outfit',sans-serif",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              style={{
                                padding: "8px 14px",
                                background: "#f1f5f9",
                                color: "#475569",
                                border: "1px solid #e2e8f0",
                                borderRadius: 6,
                                fontFamily: "'Outfit',sans-serif",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(selected.id)}
                            style={{
                              padding: "8px 18px",
                              background: "#fff",
                              color: "#ef4444",
                              border: "1px solid #fca5a5",
                              borderRadius: 6,
                              fontFamily: "'Outfit',sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                    color: "#94a3b8",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                    }}
                  >
                    {"{ }"}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 14,
                      color: "#94a3b8",
                      margin: 0,
                    }}
                  >
                    Select a snippet from the left panel
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sandbox" && <SandboxTab />}
        {activeTab === "inspector" && <InspectorTab />}

        {activeTab === "markdown" && (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Editor */}
            <div style={{ flex: "0 0 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Markdown Input
              </div>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  minHeight: 400,
                  padding: "14px 16px",
                  background: "#1e293b",
                  color: "#e2e8f0",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  lineHeight: 1.7,
                  border: "none",
                  borderRadius: 8,
                  outline: "none",
                  resize: "vertical",
                }}
                spellCheck={false}
              />
            </div>

            {/* Preview */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Preview
              </div>
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 8,
                  padding: 24,
                  maxHeight: "70vh",
                  overflowY: "auto",
                  border: "1px solid #e2e8f0",
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(markdownInput) }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Snippet Modal */}
      {showAddModal && (
        <AddSnippetModal
          onSave={handleSaveSnippet}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
