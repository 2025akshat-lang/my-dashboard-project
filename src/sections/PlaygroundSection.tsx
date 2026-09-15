import { useState, useEffect, useRef } from "react";
import { getTemplates, saveTemplate, deleteTemplate, PlaygroundTemplate, PlaygroundType } from "../config/playgroundStore";

// ── Shared styles ──────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};
const monoInp: React.CSSProperties = {
  ...inp, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#1e293b",
  lineHeight: 1.7, resize: "vertical",
};

// ── Chemical Equation Balancer ─────────────────────────────────────────────────
function parseFormula(formula: string): Record<string, number> {
  const result: Record<string, number> = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m;
  while ((m = re.exec(formula)) !== null) {
    if (!m[1]) continue;
    result[m[1]] = (result[m[1]] || 0) + (parseInt(m[2]) || 1);
  }
  return result;
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }

function balanceEquation(input: string): { balanced: string; steps: string[] } | { error: string } {
  try {
    const [lhs, rhs] = input.split(/->|→|=/).map(s => s.trim());
    if (!lhs || !rhs) return { error: "Use format: A + B -> C + D" };

    const reactants = lhs.split("+").map(s => s.trim()).filter(Boolean);
    const products = rhs.split("+").map(s => s.trim()).filter(Boolean);
    const allCompounds = [...reactants, ...products];

    const parsedAll = allCompounds.map(parseFormula);
    const elements = Array.from(new Set(parsedAll.flatMap(p => Object.keys(p))));

    // Build stoichiometry matrix: rows=elements, cols=compounds (products negative)
    const matrix: number[][] = elements.map(el =>
      allCompounds.map((_, ci) => {
        const count = parsedAll[ci][el] || 0;
        return ci < reactants.length ? count : -count;
      })
    );

    // Try coefficients 1-8 by brute force for small equations (up to 4 compounds)
    const n = allCompounds.length;
    if (n > 5) return { error: "Too many compounds (max 5)" };

    const maxCoef = 9;
    function tryCoeffs(depth: number, current: number[]): number[] | null {
      if (depth === n) {
        if (current[0] === 0) return null;
        // Check all element balances
        for (const row of matrix) {
          const sum = row.reduce((acc, v, i) => acc + v * current[i], 0);
          if (sum !== 0) return null;
        }
        return current;
      }
      for (let c = 1; c <= maxCoef; c++) {
        const result = tryCoeffs(depth + 1, [...current, c]);
        if (result) return result;
      }
      return null;
    }

    const solution = tryCoeffs(1, [1]);
    if (!solution) return { error: "Could not balance — check formula spelling" };

    // Simplify by GCD
    let g = solution[0];
    for (let i = 1; i < solution.length; i++) g = gcd(g, solution[i]);
    const coeffs = solution.map(c => c / g);

    function fmt(compound: string, coef: number) { return coef === 1 ? compound : `${coef}${compound}`; }
    const reactantStr = reactants.map((r, i) => fmt(r, coeffs[i])).join(" + ");
    const productStr = products.map((p, i) => fmt(p, coeffs[reactants.length + i])).join(" + ");
    const balanced = `${reactantStr} → ${productStr}`;

    const steps = [
      `Elements detected: ${elements.join(", ")}`,
      `Compounds: ${allCompounds.join(", ")}`,
      `Coefficients found: ${coeffs.join(", ")}`,
      `Balanced: ${balanced}`,
    ];

    return { balanced, steps };
  } catch {
    return { error: "Parse error — check formula syntax" };
  }
}

// ── Chemical display helpers ───────────────────────────────────────────────────
function chemToHtml(s: string): string {
  return s
    .replace(/(\d+)/g, "<sub>$1</sub>")
    .replace(/→/g, " <strong style='color:#8b5cf6'>→</strong> ")
    .replace(/\+/g, " <span style='color:#64748b'>+</span> ");
}

// ── LaTeX renderer using KaTeX CDN in sandboxed iframe ─────────────────────────
function latexSrcdoc(latex: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
<style>
  body { margin: 0; padding: 32px; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
  .katex { font-size: 2.2em; color: #0f172a; }
  .err { color: #dc2626; font-family: monospace; font-size: 14px; }
</style>
</head>
<body>
<div id="out"></div>
<script>
try {
  katex.render(${JSON.stringify(latex)}, document.getElementById('out'), { displayMode: true, throwOnError: true });
} catch(e) {
  document.getElementById('out').innerHTML = '<div class="err">LaTeX error: ' + e.message + '</div>';
}
<\/script>
</body>
</html>`;
}

// ── HTML Editor tab ────────────────────────────────────────────────────────────
function HtmlEditorTab({ isAdmin, templates, onTemplateChange }: { isAdmin: boolean; templates: PlaygroundTemplate[]; onTemplateChange: () => void }) {
  const htmlTemplates = templates.filter(t => t.type === "html");
  const defaultCode = `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #0f172a; color: #f1f5f9; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; }
  h1 { font-size: 2em; color: #8b5cf6; }
</style>
</head>
<body>
  <h1>Hello, KnowledgeOS! 🧠</h1>
</body>
</html>`;

  const [code, setCode] = useState(defaultCode);
  const [preview, setPreview] = useState(defaultCode);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function runCode() { setPreview(code); }

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPreview(code), 1200);
    return () => clearTimeout(timeoutRef.current);
  }, [code]);

  function handleSave() {
    if (!saveName.trim()) return;
    saveTemplate({ name: saveName.trim(), type: "html", content: code });
    setSaveName(""); setSaving(false); onTemplateChange();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select onChange={e => { const t = htmlTemplates.find(x => x.id === e.target.value); if (t) { setCode(t.content); setPreview(t.content); } e.target.value = ""; }}
          style={{ ...inp, width: "auto", flex: 1, minWidth: 160, fontSize: 12 }}>
          <option value="">Load saved template…</option>
          {htmlTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button onClick={runCode} style={{ background: "#8b5cf6", border: "none", borderRadius: 8, padding: "9px 16px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>▷ Run</button>
        {isAdmin && (
          <button onClick={() => setSaving(v => !v)} style={{ background: saving ? "#f1f5f9" : "#f0fdf4", border: `1px solid ${saving ? "#e2e8f0" : "#86efac"}`, borderRadius: 8, padding: "9px 14px", color: saving ? "#64748b" : "#059669", fontFamily: "'Outfit',sans-serif", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
            {saving ? "✕" : "💾 Save"}
          </button>
        )}
      </div>

      {saving && isAdmin && (
        <div style={{ display: "flex", gap: 8 }}>
          <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Template name…" style={{ ...inp, flex: 1 }} onKeyDown={e => e.key === "Enter" && handleSave()} />
          <button onClick={handleSave} style={{ background: "#8b5cf6", border: "none", borderRadius: 8, padding: "9px 16px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save →</button>
        </div>
      )}

      {/* Split pane */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: 420 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>HTML/CSS/JS Editor</div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
            style={{ ...monoInp, flex: 1, resize: "none", height: "100%", background: "#0f172a", color: "#e2e8f0", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 16px", fontSize: 12 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Preview <span style={{ color: "#94a3b8" }}>(auto-updates 1.2s)</span></div>
          <iframe srcDoc={preview} title="HTML Preview" sandbox="allow-scripts" style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff" }} />
        </div>
      </div>

      {/* Saved templates list */}
      {htmlTemplates.length > 0 && (
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Saved Templates</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {htmlTemplates.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "5px 10px" }}>
                <button onClick={() => { setCode(t.content); setPreview(t.content); }}
                  style={{ background: "none", border: "none", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#334155", cursor: "pointer", padding: 0 }}>{t.name}</button>
                {isAdmin && (
                  <button onClick={() => { deleteTemplate(t.id); onTemplateChange(); }}
                    style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 11 }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chemistry tab ──────────────────────────────────────────────────────────────
function ChemistryTab({ isAdmin, templates, onTemplateChange }: { isAdmin: boolean; templates: PlaygroundTemplate[]; onTemplateChange: () => void }) {
  const chemTemplates = templates.filter(t => t.type === "chemistry");
  const [input, setInput] = useState("CH4 + O2 -> CO2 + H2O");
  const [result, setResult] = useState<{ balanced: string; steps: string[] } | { error: string } | null>(null);
  const [saveName, setSaveName] = useState("");

  function balance() { setResult(balanceEquation(input)); }

  function handleSave() {
    if (!saveName.trim() || !input.trim()) return;
    saveTemplate({ name: saveName.trim(), type: "chemistry", content: input });
    setSaveName(""); onTemplateChange();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Chemical Equation Balancer</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", marginBottom: 14 }}>
          Enter an unbalanced equation using <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>-{">"}</code> or <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>→</code> as the arrow.
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <select onChange={e => { const t = chemTemplates.find(x => x.id === e.target.value); if (t) setInput(t.content); e.target.value = ""; }}
            style={{ ...inp, width: "auto", flex: 1, minWidth: 160, fontSize: 12 }}>
            <option value="">Load example…</option>
            {chemTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && balance()}
            placeholder="e.g. H2 + O2 -> H2O"
            style={{ ...monoInp, flex: 1, fontSize: 15, padding: "11px 14px" }} />
          <button onClick={balance} style={{ background: "#10b981", border: "none", borderRadius: 9, padding: "11px 22px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>⚗ Balance</button>
        </div>

        {result && (
          <div style={{ background: "error" in result ? "#fee2e2" : "#f0fdf4", border: `1px solid ${"error" in result ? "#fca5a5" : "#86efac"}`, borderRadius: 10, padding: "16px 18px" }}>
            {"error" in result ? (
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#991b1b" }}>❌ {result.error}</div>
            ) : (
              <>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#059669", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>✓ Balanced Equation</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}
                  dangerouslySetInnerHTML={{ __html: chemToHtml(result.balanced) }} />
                <details style={{ cursor: "pointer" }}>
                  <summary style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", marginBottom: 6 }}>Show working steps</summary>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {result.steps.map((s, i) => (
                      <div key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#334155" }}>→ {s}</div>
                    ))}
                  </div>
                </details>
              </>
            )}
          </div>
        )}

        {isAdmin && "balanced" in (result || {}) && (
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Save as template name…" style={{ ...inp, flex: 1, fontSize: 12 }} onKeyDown={e => e.key === "Enter" && handleSave()} />
            <button onClick={handleSave} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💾 Save</button>
          </div>
        )}
      </div>

      {/* Example equations */}
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Quick Examples</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["H2 + O2 -> H2O", "Fe + O2 -> Fe2O3", "C + O2 -> CO2", "NaOH + HCl -> NaCl + H2O", "CH4 + O2 -> CO2 + H2O", "Al + O2 -> Al2O3"].map(eq => (
            <button key={eq} onClick={() => { setInput(eq); setResult(null); }}
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "5px 10px", borderRadius: 7, cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", color: "#334155" }}>
              {eq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LaTeX tab ──────────────────────────────────────────────────────────────────
function LatexTab({ isAdmin, templates, onTemplateChange }: { isAdmin: boolean; templates: PlaygroundTemplate[]; onTemplateChange: () => void }) {
  const latexTemplates = templates.filter(t => t.type === "latex");
  const [input, setInput] = useState("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
  const [rendered, setRendered] = useState(input);
  const [saveName, setSaveName] = useState("");

  function handleSave() {
    if (!saveName.trim()) return;
    saveTemplate({ name: saveName.trim(), type: "latex", content: input });
    setSaveName(""); onTemplateChange();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>LaTeX Formula Renderer</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", marginBottom: 14 }}>Enter LaTeX math. Uses KaTeX for instant rendering.</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <select onChange={e => { const t = latexTemplates.find(x => x.id === e.target.value); if (t) { setInput(t.content); setRendered(t.content); } e.target.value = ""; }}
            style={{ ...inp, width: "auto", flex: 1, minWidth: 160, fontSize: 12 }}>
            <option value="">Load example…</option>
            {latexTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <textarea value={input} onChange={e => setInput(e.target.value)} rows={3}
          style={{ ...monoInp, marginBottom: 10, fontSize: 14 }} />

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setRendered(input)}
            style={{ background: "#8b5cf6", border: "none", borderRadius: 9, padding: "10px 20px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>∑ Render</button>
          {isAdmin && (
            <button onClick={() => setSaveName(v => v ? "" : "My formula")}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 9, padding: "10px 14px", color: "#64748b", fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer" }}>💾 Save</button>
          )}
        </div>

        {saveName !== undefined && isAdmin && saveName !== "" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Template name" style={{ ...inp, flex: 1 }} onKeyDown={e => e.key === "Enter" && handleSave()} />
            <button onClick={handleSave} style={{ background: "#8b5cf6", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save →</button>
          </div>
        )}

        {/* KaTeX render pane */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", minHeight: 140 }}>
          <iframe srcDoc={latexSrcdoc(rendered)} title="LaTeX Preview" sandbox="allow-scripts"
            style={{ width: "100%", height: 140, border: "none", display: "block" }} />
        </div>
      </div>

      {/* Quick formulas */}
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Quick Formulas</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            ["Quadratic", "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
            ["Euler", "e^{i\\pi} + 1 = 0"],
            ["Maxwell", "\\nabla \\cdot E = \\frac{\\rho}{\\epsilon_0}"],
            ["Integration", "\\int_a^b f(x)\\,dx = F(b) - F(a)"],
            ["Sigma", "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}"],
          ].map(([name, latex]) => (
            <button key={name} onClick={() => { setInput(latex); setRendered(latex); }}
              style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, padding: "5px 12px", borderRadius: 7, cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", color: "#334155" }}>
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Root PlaygroundSection ─────────────────────────────────────────────────────
export default function PlaygroundSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [tab, setTab] = useState<PlaygroundType>("html");
  const [templates, setTemplates] = useState<PlaygroundTemplate[]>(getTemplates);

  function refresh() { setTemplates(getTemplates()); }

  const tabs: { key: PlaygroundType; label: string; accent: string }[] = [
    { key: "html", label: "HTML / JS Editor", accent: "#8b5cf6" },
    { key: "chemistry", label: "⚗ Chemistry Balancer", accent: "#10b981" },
    { key: "latex", label: "∑ LaTeX Renderer", accent: "#3b82f6" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Sandbox Playground</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.05 }}>Code &amp; Science Lab</h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>Sandboxed HTML/JS editor · Chemical equation balancer · LaTeX formula renderer</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 10, padding: 4, marginBottom: 24, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex: 1, padding: "9px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.15s", whiteSpace: "nowrap",
                background: tab === t.key ? "#fff" : "transparent",
                color: tab === t.key ? t.accent : "#64748b",
                boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "html" && <HtmlEditorTab isAdmin={isAdmin} templates={templates} onTemplateChange={refresh} />}
        {tab === "chemistry" && <ChemistryTab isAdmin={isAdmin} templates={templates} onTemplateChange={refresh} />}
        {tab === "latex" && <LatexTab isAdmin={isAdmin} templates={templates} onTemplateChange={refresh} />}
      </div>
    </div>
  );
}
