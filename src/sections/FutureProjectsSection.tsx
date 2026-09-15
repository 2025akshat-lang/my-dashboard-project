import { useState } from "react";

const STORAGE_KEY = "knowledgeos_projects";

interface Project {
  id: string;
  title: string;
  desc: string;
  status: "idea" | "planning" | "building" | "paused";
  tags: string[];
  createdAt: string;
}

const STATUS_META: Record<Project["status"], { label: string; color: string; bg: string; border: string }> = {
  idea:     { label: "Idea",     color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" },
  planning: { label: "Planning", color: "#0891b2", bg: "#e0f2fe", border: "#7dd3fc" },
  building: { label: "Building", color: "#059669", bg: "#dcfce7", border: "#86efac" },
  paused:   { label: "Paused",   color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1" },
};

const SEED_PROJECTS: Project[] = [
  { id: "1", title: "AI Tutor App", desc: "Personalised AI tutor that adapts to learning gaps detected from quiz results and assessment performance.", status: "idea", tags: ["AI", "Tutoring", "React"], createdAt: "2025-09-01" },
  { id: "2", title: "Virtual Lab v2", desc: "Next-gen simulation platform with WebGL-based 3D lab experiments and real-time data graphing.", status: "planning", tags: ["WebGL", "3D", "Chemistry"], createdAt: "2025-09-05" },
  { id: "3", title: "Adaptive Quiz Engine", desc: "CBT quiz system that adjusts question difficulty dynamically based on user response patterns.", status: "idea", tags: ["Algorithm", "CBT", "TypeScript"], createdAt: "2025-09-07" },
];

function loadProjects(): Project[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored && stored.length) return stored;
  } catch { /* empty */ }
  return SEED_PROJECTS;
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};

export default function FutureProjectsSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<Project["status"]>("idea");
  const [tagsRaw, setTagsRaw] = useState("");
  const [filterStatus, setFilterStatus] = useState<Project["status"] | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function submit() {
    if (!title.trim()) return;
    const newProj: Project = {
      id: Date.now().toString(),
      title: title.trim(),
      desc: desc.trim(),
      status,
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setTitle(""); setDesc(""); setTagsRaw(""); setStatus("idea"); setAdding(false);
  }

  function cycleStatus(id: string) {
    const order: Project["status"][] = ["idea", "planning", "building", "paused"];
    const updated = projects.map((p) => {
      if (p.id !== id) return p;
      return { ...p, status: order[(order.indexOf(p.status) + 1) % order.length] };
    });
    setProjects(updated);
    saveProjects(updated);
  }

  function deleteProject(id: string) {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
  }

  function saveRename(id: string) {
    if (!editTitle.trim()) return;
    const updated = projects.map(p => p.id === id ? { ...p, title: editTitle.trim() } : p);
    setProjects(updated);
    saveProjects(updated);
    setEditingId(null);
  }

  const displayed = filterStatus === "all" ? projects : projects.filter((p) => p.status === filterStatus);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Section 6 · Future Projects</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.05 }}>Ideas Board</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>Capture project ideas, track their status, and plan ahead.</p>
          </div>
          {isAdmin && (
            <button onClick={() => setAdding((v) => !v)}
              style={{ background: adding ? "#f1f5f9" : "#8b5cf6", border: "none", borderRadius: 10, padding: "10px 20px", color: adding ? "#64748b" : "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {adding ? "✕ Cancel" : "+ Add Project"}
            </button>
          )}
        </div>

        {/* Add form */}
        {adding && isAdmin && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, marginBottom: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 18 }}>New Project</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title *" style={inp} />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description" rows={3}
                style={{ ...inp, resize: "vertical" }} />
              <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="Tags (comma separated: AI, React, Chemistry)" style={inp} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["idea","planning","building","paused"] as const).map((s) => {
                  const m = STATUS_META[s];
                  return (
                    <button key={s} onClick={() => setStatus(s)}
                      style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "7px 14px", borderRadius: 8, cursor: "pointer", border: `1px solid ${status === s ? m.border : "#e2e8f0"}`, background: status === s ? m.bg : "#f8fafc", color: status === s ? m.color : "#64748b", fontWeight: status === s ? 700 : 400, transition: "all 0.15s" }}>
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <button onClick={submit} disabled={!title.trim()}
                style={{ background: "#8b5cf6", border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Outfit',sans-serif", cursor: "pointer", opacity: !title.trim() ? 0.5 : 1 }}>
                Save Project →
              </button>
            </div>
          </div>
        )}

        {/* Status filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {(["all","idea","planning","building","paused"] as const).map((s) => {
            const meta = s === "all" ? { label: "All", color: "#8b5cf6", bg: "#ede9fe", border: "#c4b5fd" } : STATUS_META[s];
            const count = s === "all" ? projects.length : projects.filter(p => p.status === s).length;
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "6px 14px", borderRadius: 100, cursor: "pointer", border: `1px solid ${filterStatus === s ? meta.border : "#e2e8f0"}`, background: filterStatus === s ? meta.bg : "#fff", color: filterStatus === s ? meta.color : "#64748b", fontWeight: filterStatus === s ? 700 : 400, transition: "all 0.15s" }}>
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Cards grid */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "#64748b" }}>No projects in this filter</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%, 320px),1fr))", gap: 16 }}>
            {displayed.map((proj, idx) => {
              const meta = STATUS_META[proj.status];
              return (
                <div key={proj.id}
                  style={{ background: "#fff", border: `1px solid ${meta.border}`, borderTop: `3px solid ${meta.color}`, borderRadius: 16, padding: "20px 20px 16px", animation: `cardEntrance 0.4s ease ${idx * 0.06}s both`, transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = `0 8px 24px ${meta.color}22`; el.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; el.style.transform = "translateY(0)"; }}>

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    {isAdmin ? (
                      <button onClick={() => cycleStatus(proj.id)} title="Click to advance status"
                        style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 100, padding: "3px 10px", cursor: "pointer", fontWeight: 700 }}>
                        ● {meta.label}
                      </button>
                    ) : (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 100, padding: "3px 10px", fontWeight: 700 }}>
                        ● {meta.label}
                      </span>
                    )}
                    {isAdmin && (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => { setEditingId(proj.id); setEditTitle(proj.title); }}
                          style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer", color: "#64748b" }}>✏</button>
                        <button onClick={() => { if (confirm(`Delete "${proj.title}"?`)) deleteProject(proj.id); }}
                          style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer", color: "#dc2626" }}>✕</button>
                      </div>
                    )}
                  </div>

                  {editingId === proj.id ? (
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveRename(proj.id); if (e.key === "Escape") setEditingId(null); }}
                        style={{ ...inp, flex: 1, padding: "6px 10px" }} />
                      <button onClick={() => saveRename(proj.id)} style={{ background: "#8b5cf6", border: "none", borderRadius: 7, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 7, padding: "6px 10px", color: "#64748b", fontSize: 12, cursor: "pointer" }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.25, marginBottom: 8 }}>{proj.title}</div>
                  )}

                  {proj.desc && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#475569", lineHeight: 1.65, margin: "0 0 12px" }}>{proj.desc}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                    {proj.tags.map((t) => (
                      <span key={t} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }}>Added {proj.createdAt}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
