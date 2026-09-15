import { useState } from "react";
import {
  Practical, getPracticals, addPractical, updatePractical, deletePractical,
  ACCENT_OPTIONS, ICON_OPTIONS,
} from "../config/practicalStore";

// ── IframeModal ────────────────────────────────────────────────────────────────
function IframeModal({ content, type, title, onClose }: { content: string; type: "github" | "html"; title: string; onClose: () => void }) {
  const src = type === "github" ? content : `data:text/html;charset=utf-8,${encodeURIComponent(content)}`;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", background: "#0f172a", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{title}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569" }}>· Practical</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {type === "github" && (
            <a href={content} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>
              Open in new tab ↗
            </a>
          )}
          <button onClick={onClose} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>
            ✕ Close
          </button>
        </div>
      </div>
      <iframe src={src} title={title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style={{ flex: 1, border: "none", width: "100%", height: "100%" }} allow="fullscreen" />
    </div>
  );
}

const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};

const btn = (bg: string, color: string): React.CSSProperties => ({
  background: bg, color, border: "none", borderRadius: 8, padding: "9px 18px",
  fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
});

// ── Add / Edit form ────────────────────────────────────────────────────────────
function PracticalForm({ initial, onSave, onCancel }: {
  initial?: Partial<Practical>;
  onSave: (p: Omit<Practical, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [label, setLabel] = useState(initial?.label || "");
  const [icon, setIcon] = useState(initial?.icon || "🧪");
  const [accent, setAccent] = useState(initial?.accent || "#10b981");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [tagsRaw, setTagsRaw] = useState((initial?.tags || []).join(", "));
  const [type, setType] = useState<"github" | "html">(initial?.type || "github");
  const [content, setContent] = useState(initial?.content || "");

  function submit() {
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      label: label.trim() || title.trim(),
      icon,
      accent,
      desc: desc.trim(),
      tags: tagsRaw.split(",").map(t => t.trim()).filter(Boolean),
      type,
      content: content.trim(),
    });
  }

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 22, marginBottom: 24 }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 18 }}>
        {initial?.id ? "Edit Practical" : "Add New Practical"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>TITLE *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chemistry Practical" style={inp} />
        </div>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>LABEL (short)</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 3.g · Organic Chemistry" style={inp} />
        </div>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>DESCRIPTION</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description" style={inp} />
        </div>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>TAGS (comma separated)</label>
          <input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="Chemistry, Lab, Interactive" style={inp} />
        </div>
      </div>

      {/* Icon picker */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 6 }}>ICON</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ICON_OPTIONS.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)}
              style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${icon === ic ? "#8b5cf6" : "#e2e8f0"}`, background: icon === ic ? "#ede9fe" : "#fff", fontSize: 18, cursor: "pointer" }}>
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color picker */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 6 }}>ACCENT COLOR</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ACCENT_OPTIONS.map(c => (
            <button key={c} onClick={() => setAccent(c)}
              style={{ width: 28, height: 28, borderRadius: "50%", border: `3px solid ${accent === c ? "#0f172a" : "transparent"}`, background: c, cursor: "pointer" }} />
          ))}
        </div>
      </div>

      {/* Content type */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 6 }}>CONTENT TYPE *</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => setType("github")}
            style={{ ...btn(type === "github" ? "#3b82f6" : "#f1f5f9", type === "github" ? "#fff" : "#64748b"), flex: 1 }}>
            🌐 GitHub Link
          </button>
          <button onClick={() => setType("html")}
            style={{ ...btn(type === "html" ? "#10b981" : "#f1f5f9", type === "html" ? "#fff" : "#64748b"), flex: 1 }}>
            {"</>"} HTML Code
          </button>
        </div>
        {type === "github" ? (
          <input value={content} onChange={e => setContent(e.target.value)}
            placeholder="Full GitHub Pages URL (e.g. https://username.github.io/repo/file.html)"
            style={inp} />
        ) : (
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Paste your HTML code here..." rows={6}
            style={{ ...inp, resize: "vertical", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }} />
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={submit} disabled={!title.trim() || !content.trim()}
          style={{ ...btn("#8b5cf6", "#fff"), opacity: (!title.trim() || !content.trim()) ? 0.5 : 1 }}>
          {initial?.id ? "Save Changes →" : "Add Practical →"}
        </button>
        <button onClick={onCancel} style={btn("#f1f5f9", "#64748b")}>Cancel</button>
      </div>
    </div>
  );
}

// ── Main PracticalsSection ─────────────────────────────────────────────────────
export default function PracticalsSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [practicals, setPracticals] = useState<Practical[]>(getPracticals);
  const [active, setActive] = useState<Practical | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      {active && <IframeModal content={active.content} type={active.type} title={active.title} onClose={() => setActive(null)} />}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Section 3 · Practicals</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.05 }}>Hands-On Practicals</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>
              {practicals.length} practical{practicals.length !== 1 ? "s" : ""}. Click a card to run it in a full-screen viewer.
            </p>
          </div>
          {isAdmin && (
            <button onClick={() => { setAdding(v => !v); setEditing(null); }}
              style={{ ...btn(adding ? "#f1f5f9" : "#10b981", adding ? "#64748b" : "#fff"), padding: "10px 20px" }}>
              {adding ? "✕ Cancel" : "+ Add Practical"}
            </button>
          )}
        </div>

        {adding && isAdmin && (
          <PracticalForm
            onSave={p => { setPracticals(addPractical(p)); setAdding(false); }}
            onCancel={() => setAdding(false)} />
        )}

        {practicals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔬</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "#64748b", marginBottom: 6 }}>No practicals yet</div>
            {isAdmin && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Add a GitHub link or paste HTML code to create your first practical.</div>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 16 }}>
            {practicals.map((p, idx) => (
              <div key={p.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "3px solid " + p.accent, borderRadius: 14, padding: "22px", transition: "all 0.2s", animation: `cardEntrance 0.4s ease ${idx * 0.06}s both`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = "0 8px 30px " + p.accent + "22"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; el.style.transform = "translateY(0)"; }}>

                {editing === p.id ? (
                  <PracticalForm
                    initial={p}
                    onSave={changes => { setPracticals(updatePractical(p.id, changes)); setEditing(null); }}
                    onCancel={() => setEditing(null)} />
                ) : (
                  <>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: p.accent + "14", border: "1px solid " + p.accent + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {p.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: p.accent, letterSpacing: "0.08em", marginBottom: 4 }}>{p.label}</div>
                        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{p.title}</div>
                      </div>
                      {isAdmin && (
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <button onClick={() => setEditing(p.id)} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer", color: "#64748b" }}>✏</button>
                          <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) setPracticals(deletePractical(p.id)); }}
                            style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer", color: "#dc2626" }}>🗑</button>
                        </div>
                      )}
                    </div>

                    {p.desc && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: "0 0 12px" }}>{p.desc}</p>}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {p.tags.map(tag => (
                        <span key={tag} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.accent, background: p.accent + "12", border: "1px solid " + p.accent + "22", borderRadius: 5, padding: "2px 8px" }}>{tag}</span>
                      ))}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.type === "github" ? "#3b82f6" : "#10b981", background: p.type === "github" ? "#eff6ff" : "#f0fdf4", border: "1px solid " + (p.type === "github" ? "#bfdbfe" : "#86efac"), borderRadius: 5, padding: "2px 8px" }}>
                        {p.type === "github" ? "GitHub" : "HTML"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setActive(p)}
                        style={{ flex: 1, background: p.accent + "14", border: "1px solid " + p.accent + "28", borderRadius: 9, padding: "10px", color: p.accent, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif", cursor: "pointer", transition: "all 0.15s" }}>
                        Run Practical ▷
                      </button>
                      {p.type === "github" && (
                        <a href={p.content} target="_blank" rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 9, textDecoration: "none", color: "#64748b", fontSize: 14 }}>
                          ↗
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
