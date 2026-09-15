import { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "knowledgeos_notes";

type NoteFormat = "pdf" | "ppt" | "text" | "youtube" | "other";

interface Note {
  id: string;
  title: string;
  format: NoteFormat;
  content: string;
  fileName?: string;
  fileSize?: string;
  topic?: string;
  uploadedAt: string;
  preview?: string;
}

function formatIcon(f: NoteFormat) {
  const map: Record<NoteFormat, string> = { pdf: "📄", ppt: "📊", text: "📝", youtube: "▶", other: "📎" };
  return map[f];
}

function formatLabel(f: NoteFormat) {
  const map: Record<NoteFormat, string> = { pdf: "PDF", ppt: "PPT/Slides", text: "Text Note", youtube: "YT Transcript", other: "File" };
  return map[f];
}

function detectFormat(name: string): NoteFormat {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return "pdf";
  if (["ppt","pptx"].includes(ext)) return "ppt";
  if (["txt","md","docx","doc"].includes(ext)) return "text";
  return "other";
}

function loadNotes(): Note[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
  padding: "11px 14px", fontFamily: "'Outfit',sans-serif", fontSize: 14,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};

export default function StudyMaterialsSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [view, setView] = useState<"browse" | "upload" | "youtube">("browse");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTopic, setUploadTopic] = useState("");
  const [uploadContent, setUploadContent] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [ytUrl, setYtUrl] = useState("");
  const [ytTranscript, setYtTranscript] = useState("");
  const [ytTitle, setYtTitle] = useState("");

  useEffect(() => { saveNotes(notes); }, [notes]);

  function addNote(n: Omit<Note, "id" | "uploadedAt">) {
    const note: Note = { ...n, id: Date.now().toString(), uploadedAt: new Date().toLocaleString() };
    setNotes((prev) => [note, ...prev]);
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (previewNote?.id === id) setPreviewNote(null);
  }

  async function handleFileSelect(files: FileList | null) {
    if (!files || !files.length) return;
    const file = files[0];
    setPendingFile(file);
    setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
    if (file.type.startsWith("text/")) {
      const text = await file.text();
      setUploadContent(text.slice(0, 5000));
    }
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }

  function submitUpload() {
    if (!uploadTitle.trim()) return;
    const fmt = pendingFile ? detectFormat(pendingFile.name) : "text";
    addNote({
      title: uploadTitle.trim(),
      format: fmt,
      content: uploadContent,
      fileName: pendingFile?.name,
      fileSize: pendingFile ? `${(pendingFile.size / 1024).toFixed(1)} KB` : undefined,
      topic: uploadTopic.trim() || undefined,
      preview: uploadContent.slice(0, 200),
    });
    setUploadTitle(""); setUploadTopic(""); setUploadContent(""); setPendingFile(null);
    setView("browse");
  }

  function submitYoutube() {
    if (!ytTitle.trim() || !ytTranscript.trim()) return;
    addNote({
      title: ytTitle.trim(),
      format: "youtube",
      content: ytTranscript,
      fileName: ytUrl || undefined,
      topic: "YouTube",
      preview: ytTranscript.slice(0, 200),
    });
    setYtTitle(""); setYtUrl(""); setYtTranscript("");
    setView("browse");
  }

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.topic || "").toLowerCase().includes(search.toLowerCase())
  );

  const AMBER = "#f59e0b";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      {/* Preview overlay */}
      {previewNote && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, maxWidth: 720, width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{previewNote.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{formatLabel(previewNote.format)} · {previewNote.uploadedAt}</div>
              </div>
              <button onClick={() => setPreviewNote(null)} style={{ background: "none", border: "none", color: "#64748b", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
              {previewNote.content ? (
                <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#334155", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{previewNote.content}</pre>
              ) : (
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", textAlign: "center", paddingTop: 40 }}>
                  File stored: <strong style={{ color: "#0f172a" }}>{previewNote.fileName}</strong>
                  <br /><span style={{ fontSize: 12 }}>Preview not available for binary files.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Section 5 · Study Materials</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.05 }}>Study Materials</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>
              {notes.length} item{notes.length !== 1 ? "s" : ""} stored · Upload any format
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {([
              { key: "browse", label: "Browse Notes" },
              ...(isAdmin ? [{ key: "upload", label: "+ Upload File" }, { key: "youtube", label: "▶ YT Transcript" }] : []),
            ] as { key: string; label: string }[]).map((tab) => (
              <button key={tab.key} onClick={() => setView(tab.key as typeof view)}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "8px 16px", borderRadius: 9, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                  background: view === tab.key ? `${AMBER}18` : "#fff",
                  borderColor: view === tab.key ? `${AMBER}55` : "#e2e8f0",
                  color: view === tab.key ? AMBER : "#64748b",
                  fontWeight: view === tab.key ? 700 : 400,
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* BROWSE */}
        {view === "browse" && (
          <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes by title or topic…"
              style={{ ...inp, marginBottom: 22 }} />
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 60 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "#64748b", marginBottom: 8 }}>
                  {notes.length === 0 ? "No notes yet" : "No results"}
                </div>
                {isAdmin && notes.length === 0 && (
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Upload a file or paste a YouTube transcript to get started.</div>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%, 300px),1fr))", gap: 14 }}>
                {filtered.map((note) => (
                  <div key={note.id}
                    style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: `3px solid ${AMBER}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = `0 8px 24px ${AMBER}22`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; el.style.transform = "translateY(0)"; }}
                    onClick={() => setPreviewNote(note)}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 22 }}>{formatIcon(note.format)}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: AMBER, background: `${AMBER}14`, border: `1px solid ${AMBER}30`, borderRadius: 6, padding: "2px 7px" }}>{formatLabel(note.format)}</span>
                        {isAdmin && (
                          <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                            style={{ background: "#fee2e2", border: "none", borderRadius: 5, padding: "2px 7px", color: "#dc2626", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>✕</button>
                        )}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1.3 }}>{note.title}</div>
                    {note.topic && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginBottom: 6 }}>#{note.topic}</div>}
                    {note.preview && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{note.preview}</p>}
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }}>{note.uploadedAt}{note.fileSize ? ` · ${note.fileSize}` : ""}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* UPLOAD FILE — admin only */}
        {view === "upload" && isAdmin && (
          <div style={{ maxWidth: 640 }}>
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${dragOver ? AMBER : "#e2e8f0"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? `${AMBER}08` : "#fff", transition: "all 0.2s", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{pendingFile ? "✅" : "📂"}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#64748b", marginBottom: 4 }}>
                {pendingFile ? pendingFile.name : "Drop file here or click to browse"}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8" }}>PDF · PPT · TXT · DOCX · any format</div>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="Note title *" style={inp} />
              <input value={uploadTopic} onChange={(e) => setUploadTopic(e.target.value)} placeholder="Topic / tag (optional)" style={inp} />
              <textarea value={uploadContent} onChange={(e) => setUploadContent(e.target.value)}
                placeholder="Paste text content here (auto-filled for .txt files)" rows={6}
                style={{ ...inp, resize: "vertical", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#334155" }} />
              <button onClick={submitUpload} disabled={!uploadTitle.trim()}
                style={{ background: uploadTitle.trim() ? AMBER : "#f1f5f9", border: "none", borderRadius: 10, padding: "13px", color: uploadTitle.trim() ? "#fff" : "#94a3b8", fontSize: 14, fontWeight: 600, fontFamily: "'Outfit',sans-serif", cursor: uploadTitle.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                Save Note →
              </button>
            </div>
          </div>
        )}

        {/* YOUTUBE TRANSCRIPT — admin only */}
        {view === "youtube" && isAdmin && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 18, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
              Paste a YouTube transcript (from YT → "Show transcript") and give it a title. It will be saved as a searchable note.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={ytTitle} onChange={(e) => setYtTitle(e.target.value)} placeholder="Video / transcript title *" style={inp} />
              <input value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="YouTube URL (optional reference)" style={inp} />
              <textarea value={ytTranscript} onChange={(e) => setYtTranscript(e.target.value)} placeholder="Paste transcript text here…"
                rows={10} style={{ ...inp, resize: "vertical", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#334155" }} />
              <button onClick={submitYoutube} disabled={!ytTitle.trim() || !ytTranscript.trim()}
                style={{ background: ytTitle.trim() && ytTranscript.trim() ? AMBER : "#f1f5f9", border: "none", borderRadius: 10, padding: "13px", color: ytTitle.trim() && ytTranscript.trim() ? "#fff" : "#94a3b8", fontSize: 14, fontWeight: 600, fontFamily: "'Outfit',sans-serif", cursor: ytTitle.trim() && ytTranscript.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                Save Transcript →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
