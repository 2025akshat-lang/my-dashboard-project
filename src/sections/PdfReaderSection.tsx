import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type DocType = "pdf" | "html" | "text";
type ReadMode = "day" | "night" | "sepia";

interface Bookmark { id: string; label: string; addedAt: string; }
interface PdfDoc {
  id: string;
  title: string;
  category: string;
  type: DocType;
  url: string;        // for pdf/html — GitHub raw or any public URL
  content?: string;   // for text type — stored inline
  bookmarks: Bookmark[];
  addedAt: string;
}

const STORAGE_KEY = "knowledgeos_pdfdocs";
const SEED: PdfDoc[] = [
  {
    id: "sample-text",
    title: "Reading Guide — KnowledgeOS",
    category: "General",
    type: "text",
    url: "",
    content: "Welcome to the PDF & Notes Reader.\n\nYou can:\n• Add PDF documents via GitHub raw URL or any public link\n• Add HTML interactive pages via URL\n• Paste text notes directly for a clean reading experience\n• Switch between Day, Night, and Sepia reading modes\n• Bookmark important sections\n• Open any document in full screen\n\nTip: Upload your study PDFs to GitHub and paste the raw URL here for seamless access.",
    bookmarks: [],
    addedAt: "2025-09-01",
  },
];

function loadDocs(): PdfDoc[] {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(s) && s.length) return s;
  } catch { /* empty */ }
  return SEED;
}
function saveDocs(d: PdfDoc[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

// ── Shared styles ──────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};

// ── Add Document Form ──────────────────────────────────────────────────────────
function AddDocForm({ onAdd, onCancel }: { onAdd: (d: Omit<PdfDoc, "id" | "bookmarks" | "addedAt">) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState<DocType>("pdf");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  function submit() {
    if (!title.trim()) return;
    if (type !== "text" && !url.trim()) return;
    if (type === "text" && !content.trim()) return;
    onAdd({ title: title.trim(), category: category.trim() || "General", type, url: url.trim(), content: type === "text" ? content.trim() : undefined });
  }

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Add Document</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>TITLE *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Organic Chemistry Notes" style={inp} />
        </div>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>CATEGORY</label>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Chemistry, Physics, General…" style={inp} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {(["pdf", "html", "text"] as DocType[]).map(t => (
          <button key={t} onClick={() => setType(t)}
            style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${type === t ? "#8b5cf6" : "#e2e8f0"}`, background: type === t ? "#ede9fe" : "#fff", color: type === t ? "#7c3aed" : "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", fontWeight: type === t ? 700 : 400 }}>
            {t === "pdf" ? "📄 PDF Link" : t === "html" ? "🌐 HTML Link" : "📝 Text Note"}
          </button>
        ))}
      </div>
      {type !== "text" ? (
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>URL *</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder={type === "pdf" ? "https://raw.githubusercontent.com/…/notes.pdf" : "https://username.github.io/repo/page.html"} style={inp} />
        </div>
      ) : (
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>CONTENT *</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} placeholder="Paste your text notes here…"
            style={{ ...inp, resize: "vertical", fontFamily: "'Outfit',sans-serif", lineHeight: 1.7 }} />
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={submit} style={{ background: "#8b5cf6", border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add Document →</button>
        <button onClick={onCancel} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "9px 16px", color: "#64748b", fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Text Reader ────────────────────────────────────────────────────────────────
const MODE_STYLES: Record<ReadMode, React.CSSProperties> = {
  day:   { background: "#ffffff", color: "#1e293b" },
  night: { background: "#0f172a", color: "#94a3b8" },
  sepia: { background: "#fdf6e3", color: "#433422" },
};

// ── Main Section ───────────────────────────────────────────────────────────────
export default function PdfReaderSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [docs, setDocs] = useState<PdfDoc[]>(loadDocs);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<PdfDoc | null>(null);
  const [mode, setMode] = useState<ReadMode>("day");
  const [fullscreen, setFullscreen] = useState(false);
  const [search, setSearch] = useState("");
  const [newBkmLabel, setNewBkmLabel] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  function addDoc(data: Omit<PdfDoc, "id" | "bookmarks" | "addedAt">) {
    const doc: PdfDoc = { ...data, id: Date.now().toString(), bookmarks: [], addedAt: new Date().toISOString().slice(0, 10) };
    const updated = [doc, ...docs];
    setDocs(updated); saveDocs(updated); setAdding(false);
  }

  function deleteDoc(id: string) {
    if (!confirm("Delete this document?")) return;
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated); saveDocs(updated);
    if (selected?.id === id) setSelected(null);
  }

  function addBookmark() {
    if (!selected || !newBkmLabel.trim()) return;
    const bkm: Bookmark = { id: Date.now().toString(), label: newBkmLabel.trim(), addedAt: new Date().toLocaleString() };
    const updated = docs.map(d => d.id === selected.id ? { ...d, bookmarks: [...d.bookmarks, bkm] } : d);
    setDocs(updated); saveDocs(updated);
    setSelected(prev => prev ? { ...prev, bookmarks: [...prev.bookmarks, bkm] } : prev);
    setNewBkmLabel("");
  }

  function deleteBookmark(bkmId: string) {
    if (!selected) return;
    const updated = docs.map(d => d.id === selected.id ? { ...d, bookmarks: d.bookmarks.filter(b => b.id !== bkmId) } : d);
    setDocs(updated); saveDocs(updated);
    setSelected(prev => prev ? { ...prev, bookmarks: prev.bookmarks.filter(b => b.id !== bkmId) } : prev);
  }

  const categories = ["All", ...Array.from(new Set(docs.map(d => d.category)))];
  const filtered = docs.filter(d =>
    (catFilter === "All" || d.category === catFilter) &&
    (d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()))
  );

  const modeBar: Record<ReadMode, string> = { day: "☀ Day", night: "🌙 Night", sepia: "📖 Sepia" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      {/* Fullscreen overlay for non-text docs */}
      {fullscreen && selected && selected.type !== "text" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#0f172a", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", background: "#0f172a", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{selected.title}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={selected.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>↗ New tab</a>
              <button onClick={() => setFullscreen(false)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>✕ Close</button>
            </div>
          </div>
          <iframe src={selected.url} title={selected.title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style={{ flex: 1, border: "none", width: "100%", height: "100%" }} allow="fullscreen" />
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>PDF & Notes Reader</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.05 }}>Document Library</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>{docs.length} document{docs.length !== 1 ? "s" : ""} · PDF, HTML, and text notes</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setAdding(v => !v); }}
              style={{ background: adding ? "#f1f5f9" : "#8b5cf6", border: "none", borderRadius: 10, padding: "10px 20px", color: adding ? "#64748b" : "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {adding ? "✕ Cancel" : "+ Add Document"}
            </button>
          )}
        </div>

        {adding && isAdmin && <AddDocForm onAdd={addDoc} onCancel={() => setAdding(false)} />}

        <div style={{ display: "grid", gridTemplateColumns: selected ? "300px 1fr" : "1fr", gap: 20, alignItems: "start" }}>
          {/* Library panel */}
          <div>
            <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
                style={{ ...inp, fontSize: 12 }} />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {categories.map(c => (
                  <button key={c} onClick={() => setCatFilter(c)}
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: "4px 10px", borderRadius: 100, cursor: "pointer", border: `1px solid ${catFilter === c ? "#8b5cf6" : "#e2e8f0"}`, background: catFilter === c ? "#ede9fe" : "#fff", color: catFilter === c ? "#7c3aed" : "#64748b", fontWeight: catFilter === c ? 700 : 400 }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 12, border: "1px dashed #e2e8f0" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b" }}>No documents found</div>
                </div>
              )}
              {filtered.map(doc => {
                const icons: Record<DocType, string> = { pdf: "📄", html: "🌐", text: "📝" };
                const isActive = selected?.id === doc.id;
                return (
                  <div key={doc.id}
                    onClick={() => setSelected(doc)}
                    style={{ background: isActive ? "#ede9fe" : "#fff", border: `1px solid ${isActive ? "#8b5cf6" : "#e2e8f0"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{icons[doc.type]}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: isActive ? "#7c3aed" : "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{doc.category} · {doc.addedAt}</div>
                      </div>
                      {isAdmin && (
                        <button onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }}
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 12, padding: 2, flexShrink: 0 }}>🗑</button>
                      )}
                    </div>
                    {doc.bookmarks.length > 0 && (
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#8b5cf6", marginTop: 6 }}>📌 {doc.bookmarks.length} bookmark{doc.bookmarks.length !== 1 ? "s" : ""}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reader panel */}
          {selected && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh" }}>
              {/* Reader toolbar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px 12px 0 0", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{selected.title}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {(Object.keys(modeBar) as ReadMode[]).map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: "5px 10px", borderRadius: 7, cursor: "pointer", border: `1px solid ${mode === m ? "#8b5cf6" : "#e2e8f0"}`, background: mode === m ? "#ede9fe" : "#fff", color: mode === m ? "#7c3aed" : "#64748b", fontWeight: mode === m ? 700 : 400 }}>
                      {modeBar[m]}
                    </button>
                  ))}
                  {selected.type !== "text" && (
                    <>
                      <a href={selected.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "5px 10px", textDecoration: "none" }}>↗</a>
                      <button onClick={() => setFullscreen(true)}
                        style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", background: "#ede9fe", border: "1px solid #c4b5fd", borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>⛶ Full</button>
                    </>
                  )}
                </div>
              </div>

              {/* Document render area */}
              <div style={{ flex: 1, border: "1px solid #e2e8f0", borderTop: "none", overflow: "hidden", minHeight: "55vh" }}>
                {selected.type === "text" ? (
                  <div style={{ height: "100%", overflowY: "auto", ...MODE_STYLES[mode], padding: "32px 40px", transition: "all 0.3s", minHeight: "55vh" }}>
                    <pre style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 2, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, color: "inherit" }}>{selected.content}</pre>
                  </div>
                ) : (
                  <iframe src={selected.url} title={selected.title}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    style={{ width: "100%", height: "100%", border: "none", minHeight: "55vh", display: "block" }}
                    allow="fullscreen" />
                )}
              </div>

              {/* Bookmarks panel */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "12px 16px" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>📌 Bookmarks</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: selected.bookmarks.length > 0 ? 8 : 0 }}>
                  {selected.bookmarks.map(b => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 8px" }}>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#334155" }}>{b.label}</span>
                      <button onClick={() => deleteBookmark(b.id)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 10, padding: 0, lineHeight: 1 }}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={newBkmLabel} onChange={e => setNewBkmLabel(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addBookmark()}
                    placeholder='Add bookmark (e.g. "Page 45 — Reactions")'
                    style={{ ...inp, fontSize: 11, flex: 1 }} />
                  <button onClick={addBookmark} style={{ background: "#8b5cf6", border: "none", borderRadius: 7, padding: "7px 14px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>+ Mark</button>
                </div>
              </div>
            </div>
          )}

          {!selected && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "#64748b", marginBottom: 4 }}>Select a document to read</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Choose from the library on the left</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
