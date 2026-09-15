import { useState, useRef } from "react";
import { SOURCES, SIMULATIONS, GITHUB_SIMULATIONS_BASE, GITHUB_UI_REPO } from "./config";

interface Props {
  onNavigate: (page: string) => void;
}

function LocalUploadSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("notes");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fl: FileList | File[]) => setFiles((p) => [...p, ...Array.from(fl)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || !name || !email) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  };

  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "11px 14px", color: "#f9fafb", fontSize: 13, fontFamily: "'Outfit',sans-serif", outline: "none", boxSizing: "border-box" };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 20, color: "#4ade80" }}>✓</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Files received.</div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{files.length} file{files.length !== 1 ? "s" : ""} added to your collection.</p>
        <button onClick={() => { setSubmitted(false); setFiles([]); setName(""); setEmail(""); setNotes(""); }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#818cf8", background: "none", border: "1px solid rgba(129,140,248,0.3)", borderRadius: 6, padding: "8px 20px", cursor: "pointer" }}>
          Upload more →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="responsive-grid">
      {/* Drop zone */}
      <div>
        <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); e.dataTransfer.files.length && addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: dragging ? "2px dashed #818cf8" : "2px dashed rgba(255,255,255,0.08)", borderRadius: 14, padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", background: dragging ? "rgba(129,140,248,0.05)" : "rgba(255,255,255,0.02)", transition: "all 0.2s", marginBottom: 12 }}>
          <input ref={inputRef} type="file" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#818cf8" }}>+</div>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#9ca3af", textAlign: "center", margin: 0 }}>
            <strong style={{ color: "#e5e7eb" }}>Drop files</strong> or click to browse
          </p>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151", margin: 0 }}>PDF · DOCX · MP4 · HTML · ZIP · Any format</p>
        </div>
        {files.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#374151", letterSpacing: "0.08em", marginBottom: 6 }}>{files.length} FILE{files.length !== 1 ? "S" : ""}</div>
            {files.slice(0, 6).map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#818cf8" }}>◼</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#d1d5db", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} style={{ color: "#374151", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>×</button>
              </div>
            ))}
            {files.length > 6 && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151", padding: "4px 12px" }}>+{files.length - 6} more</div>}
          </div>
        )}
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[{ l: "Your Name", v: name, s: setName, p: "Akshat", t: "text" }, { l: "Email", v: email, s: setEmail, p: "akshat@knowledgeos.dev", t: "email" }].map(({ l, v, s, p, t }) => (
          <div key={l}>
            <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4b5563", letterSpacing: "0.08em", display: "block", marginBottom: 6, textTransform: "uppercase" }}>{l}</label>
            <input type={t} value={v} placeholder={p} onChange={(e) => s(e.target.value)} style={inputStyle} />
          </div>
        ))}
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4b5563", letterSpacing: "0.08em", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Collection</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer", background: "#080810" }}>
            {["notes","lab","practicals","teaching","projects","mock","quiz","assessment","animation","simulation"].map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4b5563", letterSpacing: "0.08em", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Topic, chapter, context..." style={{ ...inputStyle, resize: "none" }} />
        </div>
        <button type="submit" disabled={submitting || !files.length || !name || !email}
          style={{ background: "linear-gradient(135deg,#818cf8,#22d3ee)", border: "none", borderRadius: 10, padding: "13px", color: "#000", fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif", cursor: "pointer", opacity: (!files.length || !name || !email) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {submitting ? <><span style={{ width: 12, height: 12, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Adding…</> : "Add to Collection →"}
        </button>
      </div>
    </form>
  );
}

export default function SourcesPage({ onNavigate }: Props) {
  const [activeSource, setActiveSource] = useState("github-sim");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const githubSources = SOURCES.filter((s) => s.type === "github");
  const otherSources = SOURCES.filter((s) => s.type !== "github");

  return (
    <div style={{ background: "#000", minHeight: "100vh", paddingTop: 56 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#60a5fa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Connected Sources</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.05 }}>
            All your materials,<br />from anywhere.
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#4b5563", maxWidth: 500, lineHeight: 1.7, margin: 0 }}>
            Connect GitHub repos, Google Drive, OneDrive, or upload directly. Every source feeds your collections automatically.
          </p>
        </div>

        {/* GitHub repos */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>GitHub Repositories</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
            {githubSources.map((src) => (
              <div key={src.id} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${src.accent}22`, borderRadius: 14, padding: "22px", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${src.accent}15`, border: `1px solid ${src.accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: src.accent }}>
                      {src.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>{src.label}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151" }}>{src.count} items</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#4ade80", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 4, padding: "3px 8px" }}>LINKED</div>
                </div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#4b5563", marginBottom: 16, lineHeight: 1.6 }}>{src.description}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>
                    View Repo ↗
                  </a>
                  <a href={src.previewUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: src.accent, background: `${src.accent}0d`, border: `1px solid ${src.accent}25`, borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>
                    Open Live ↗
                  </a>
                </div>
              </div>
            ))}

            {/* Add GitHub repo card */}
            <div style={{ background: "rgba(255,255,255,0.01)", border: "2px dashed rgba(255,255,255,0.07)", borderRadius: 14, padding: "22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 160 }}>
              <div style={{ fontSize: 24, color: "#374151" }}>+</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#4b5563", textAlign: "center" }}>Add another GitHub repository</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#1f2937", textAlign: "center" }}>Paste your repo or GitHub Pages URL</div>
              <input placeholder="https://github.com/..." style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "9px 12px", color: "#6b7280", fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: "none", marginTop: 4, boxSizing: "border-box" }} />
            </div>
          </div>
        </section>

        {/* Simulations browser */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Simulations from GitHub · 2025akshat-lang/Akshat</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
            {SIMULATIONS.map((sim) => (
              <a key={sim.id} href={`${GITHUB_SIMULATIONS_BASE}/${sim.file}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "rgba(255,255,255,0.02)", border: `1px solid ${sim.accent}18`, borderRadius: 10, padding: "14px 16px", textDecoration: "none", transition: "all 0.18s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${sim.accent}0c`; el.style.borderColor = `${sim.accent}38`; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; el.style.borderColor = `${sim.accent}18`; el.style.transform = "translateY(0)"; }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: sim.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{sim.category}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#d1d5db", marginBottom: 4, lineHeight: 1.3 }}>{sim.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151" }}>Open ↗</div>
              </a>
            ))}
          </div>
        </section>

        {/* Other sources */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Other Sources</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {otherSources.map((src) => (
              <div key={src.id} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${src.accent}18`, borderRadius: 12, padding: "18px 18px 14px", opacity: (src as any).comingSoon ? 0.5 : 1 }}>
                <div style={{ fontSize: 18, color: src.accent, marginBottom: 10 }}>{src.icon}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#e5e7eb", marginBottom: 4 }}>{src.label}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#4b5563", marginBottom: 10 }}>{src.description}</div>
                {(src as any).comingSoon ? (
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#374151", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "3px 8px", letterSpacing: "0.06em" }}>COMING SOON</span>
                ) : (
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: src.accent }}>Active</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Local Upload */}
        <section>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#60a5fa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Upload from Local Storage</div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: 16, padding: "28px" }}>
            <LocalUploadSection />
          </div>
        </section>
      </div>
    </div>
  );
}
