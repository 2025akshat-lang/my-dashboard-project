import { useState, useRef } from "react";
import {
  MockCategory, MockExam, MockTest,
  getCategories, addCategory, renameCategory, deleteCategory,
  addExam, renameExam, deleteExam,
  addTest, renameTest, deleteTest,
} from "../config/mockTestStore";

// ── Shared styles ──────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};
const btn = (bg: string, color: string, border = "none"): React.CSSProperties => ({
  background: bg, color, border, borderRadius: 8, padding: "9px 18px",
  fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
});

// ── Inline rename widget ───────────────────────────────────────────────────────
function InlineRename({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(value);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input autoFocus value={v} onChange={e => setV(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSave(v); if (e.key === "Escape") onCancel(); }}
        style={{ ...inp, width: "auto", flex: 1, padding: "6px 10px", fontSize: 13 }} />
      <button onClick={() => onSave(v)} style={{ ...btn("#8b5cf6", "#fff"), padding: "6px 12px", fontSize: 12 }}>Save</button>
      <button onClick={onCancel} style={{ ...btn("#f1f5f9", "#64748b"), padding: "6px 12px", fontSize: 12 }}>✕</button>
    </div>
  );
}

// ── IframeModal ────────────────────────────────────────────────────────────────
function IframeModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", background: "#0f172a", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{title}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>Open in new tab ↗</a>
          <button onClick={onClose} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>✕ Close</button>
        </div>
      </div>
      <iframe src={url} title={title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style={{ flex: 1, border: "none", width: "100%", height: "100%" }} allow="fullscreen" />
    </div>
  );
}

// ── JSON Quiz Runner ───────────────────────────────────────────────────────────
interface QuizQuestion { q: string; opts: string[]; ans: number; }
interface QuizData { title: string; duration: number; questions: QuizQuestion[]; }

function QuizRunner({ data, onClose }: { data: QuizData; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(data.questions.map(() => null));
  const [done, setDone] = useState(false);

  const q = data.questions[current];
  const score = done ? answers.filter((a, i) => a === data.questions[i].ans).length : 0;

  function select(opt: number) {
    const updated = [...answers]; updated[current] = opt; setAnswers(updated);
  }

  if (done) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 480, width: "90%", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Result</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 48, fontWeight: 700, color: "#8b5cf6", marginBottom: 8 }}>{score}/{data.questions.length}</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#64748b", marginBottom: 32 }}>
            {Math.round(score / data.questions.length * 100)}% accuracy
          </div>
          <div style={{ display: "flex", gap: 12, flexDirection: "column", textAlign: "left", marginBottom: 24 }}>
            {data.questions.map((q, i) => (
              <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: answers[i] === q.ans ? "#dcfce7" : "#fee2e2", border: `1px solid ${answers[i] === q.ans ? "#86efac" : "#fca5a5"}` }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{q.q}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: answers[i] === q.ans ? "#166534" : "#991b1b" }}>
                  Your answer: {answers[i] !== null ? q.opts[answers[i]!] : "Skipped"} · Correct: {q.opts[q.ans]}
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ ...btn("#8b5cf6", "#fff"), width: "100%" }}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 540, width: "92%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.1em" }}>Q{current + 1}/{data.questions.length}</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{data.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20, lineHeight: 1.5 }}>{q.q}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {q.opts.map((opt, i) => {
            const selected = answers[current] === i;
            return (
              <button key={i} onClick={() => select(i)}
                style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${selected ? "#8b5cf6" : "#e2e8f0"}`, background: selected ? "#ede9fe" : "#f8fafc", color: "#0f172a", textAlign: "left", fontFamily: "'Outfit',sans-serif", fontSize: 14, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: selected ? "#8b5cf6" : "#e2e8f0", color: selected ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>
                  {["A", "B", "C", "D"][i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            style={{ ...btn("#f1f5f9", "#64748b"), opacity: current === 0 ? 0.4 : 1 }}>← Prev</button>
          {current < data.questions.length - 1
            ? <button onClick={() => setCurrent(c => c + 1)} style={btn("#8b5cf6", "#fff")}>Next →</button>
            : <button onClick={() => setDone(true)} style={btn("#10b981", "#fff")}>Submit ✓</button>
          }
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#8b5cf6", width: `${(current + 1) / data.questions.length * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>
    </div>
  );
}

// ── Add form panel ─────────────────────────────────────────────────────────────
function AddForm({ label, placeholder, onAdd, onCancel, extra }: {
  label: string; placeholder: string; onAdd: (name: string, extra?: string) => void;
  onCancel: () => void; extra?: { label: string; placeholder: string };
}) {
  const [name, setName] = useState("");
  const [extraVal, setExtraVal] = useState("");
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) onAdd(name, extraVal); }}
          placeholder={placeholder} style={{ ...inp, flex: 1, minWidth: 180 }} />
        {extra && (
          <input value={extraVal} onChange={e => setExtraVal(e.target.value)} placeholder={extra.placeholder}
            style={{ ...inp, flex: "0 0 90px", minWidth: 80 }} />
        )}
        <button onClick={() => name.trim() && onAdd(name, extraVal)} style={{ ...btn("#8b5cf6", "#fff"), whiteSpace: "nowrap" }}>Add →</button>
        <button onClick={onCancel} style={{ ...btn("#f1f5f9", "#64748b") }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Level 0 — Categories list ──────────────────────────────────────────────────
function CategoriesView({ isAdmin, onSelect }: { isAdmin: boolean; onSelect: (cat: MockCategory) => void }) {
  const [cats, setCats] = useState<MockCategory[]>(getCategories);
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Section 2 · Mock Tests</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#0f172a", margin: 0 }}>Exam Categories</h2>
        </div>
        {isAdmin && (
          <button onClick={() => setAdding(v => !v)} style={{ ...btn(adding ? "#f1f5f9" : "#8b5cf6", adding ? "#64748b" : "#fff"), padding: "9px 18px" }}>
            {adding ? "✕ Cancel" : "+ Add Category"}
          </button>
        )}
      </div>

      {adding && isAdmin && (
        <AddForm label="New exam category" placeholder="Category name (e.g. Govt Exam)" extra={{ label: "Icon", placeholder: "Emoji" }}
          onAdd={(name, icon) => { setCats(addCategory(name, icon || "📋")); setAdding(false); }}
          onCancel={() => setAdding(false)} />
      )}

      {cats.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "#64748b", marginBottom: 6 }}>No categories yet</div>
          {isAdmin && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Click "+ Add Category" to get started.</div>}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 14 }}>
          {cats.map((cat, idx) => (
            <div key={cat.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "3px solid #8b5cf6", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", animation: `cardEntrance 0.35s ease ${idx * 0.06}s both` }}>
              {renaming === cat.id ? (
                <InlineRename value={cat.name}
                  onSave={name => { setCats(renameCategory(cat.id, name)); setRenaming(null); }}
                  onCancel={() => setRenaming(null)} />
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{cat.icon}</span>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: "#0f172a", flex: 1 }}>{cat.name}</div>
                  </div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", marginBottom: 14 }}>
                    {cat.exams.length} exam{cat.exams.length !== 1 ? "s" : ""} · {cat.exams.reduce((n, e) => n + e.tests.length, 0)} mock tests
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onSelect(cat)} style={{ ...btn("#8b5cf6", "#fff"), flex: 1, padding: "9px" }}>Open →</button>
                    {isAdmin && (
                      <>
                        <button onClick={() => setRenaming(cat.id)} style={{ ...btn("#f1f5f9", "#64748b"), padding: "9px 12px" }}>✏</button>
                        <button onClick={() => { if (confirm(`Delete "${cat.name}" and all its content?`)) setCats(deleteCategory(cat.id)); }}
                          style={{ ...btn("#fee2e2", "#dc2626"), padding: "9px 12px" }}>🗑</button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Level 1 — Exams inside a category ─────────────────────────────────────────
function ExamsView({ cat, isAdmin, onBack, onSelect }: { cat: MockCategory; isAdmin: boolean; onBack: () => void; onSelect: (exam: MockExam) => void }) {
  const [cats, setCats] = useState<MockCategory[]>(getCategories);
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const currentCat = cats.find(c => c.id === cat.id) || cat;

  return (
    <>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← All Categories
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{currentCat.icon} {currentCat.name}</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#0f172a", margin: 0 }}>Exams</h2>
        </div>
        {isAdmin && (
          <button onClick={() => setAdding(v => !v)} style={{ ...btn(adding ? "#f1f5f9" : "#8b5cf6", adding ? "#64748b" : "#fff") }}>
            {adding ? "✕ Cancel" : "+ Add Exam"}
          </button>
        )}
      </div>

      {adding && isAdmin && (
        <AddForm label="New exam" placeholder="Exam name (e.g. SSC CGL, UPSC)"
          onAdd={name => { setCats(addExam(currentCat.id, name)); setAdding(false); }}
          onCancel={() => setAdding(false)} />
      )}

      {currentCat.exams.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, color: "#64748b", marginBottom: 4 }}>No exams in this category</div>
          {isAdmin && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Add an exam like "SSC CGL" or "UPSC".</div>}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentCat.exams.map((exam, idx) => (
            <div key={exam.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", animation: `cardEntrance 0.3s ease ${idx * 0.05}s both` }}>
              {renaming === exam.id ? (
                <InlineRename value={exam.name}
                  onSave={name => { setCats(renameExam(currentCat.id, exam.id, name)); setRenaming(null); }}
                  onCancel={() => setRenaming(null)} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{exam.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8" }}>{exam.tests.length} mock test{exam.tests.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onSelect(exam)} style={{ ...btn("#8b5cf6", "#fff"), padding: "8px 16px" }}>Open →</button>
                    {isAdmin && (
                      <>
                        <button onClick={() => setRenaming(exam.id)} style={{ ...btn("#f1f5f9", "#64748b"), padding: "8px 12px" }}>✏</button>
                        <button onClick={() => { if (confirm(`Delete "${exam.name}" and all its mocks?`)) setCats(deleteExam(currentCat.id, exam.id)); }}
                          style={{ ...btn("#fee2e2", "#dc2626"), padding: "8px 12px" }}>🗑</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Level 2 — Mock tests inside an exam ───────────────────────────────────────
function MockTestsView({ cat, exam, isAdmin, onBack }: { cat: MockCategory; exam: MockExam; isAdmin: boolean; onBack: () => void }) {
  const [cats, setCats] = useState<MockCategory[]>(getCategories);
  const [adding, setAdding] = useState(false);
  const [addType, setAddType] = useState<"github" | "json">("github");
  const [addName, setAddName] = useState("");
  const [addContent, setAddContent] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [activeIframe, setActiveIframe] = useState<{ url: string; title: string } | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<{ data: any; title: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentCat = cats.find(c => c.id === cat.id) || cat;
  const currentExam = currentCat.exams.find(e => e.id === exam.id) || exam;

  function submitAdd() {
    if (!addName.trim() || !addContent.trim()) return;
    setCats(addTest(currentCat.id, currentExam.id, addName.trim(), addType, addContent.trim()));
    setAddName(""); setAddContent(""); setAdding(false);
  }

  function openTest(test: MockTest) {
    if (test.type === "github") {
      setActiveIframe({ url: test.content, title: test.name });
    } else {
      try {
        const data = JSON.parse(test.content);
        setActiveQuiz({ data, title: test.name });
      } catch {
        alert("Invalid JSON in this mock test.");
      }
    }
  }

  return (
    <>
      {activeIframe && <IframeModal url={activeIframe.url} title={activeIframe.title} onClose={() => setActiveIframe(null)} />}
      {activeQuiz && <QuizRunner data={activeQuiz.data} onClose={() => setActiveQuiz(null)} />}

      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back to Exams
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{currentCat.icon} {currentCat.name} · {currentExam.name}</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#0f172a", margin: 0 }}>Mock Tests</h2>
        </div>
        {isAdmin && (
          <button onClick={() => setAdding(v => !v)} style={{ ...btn(adding ? "#f1f5f9" : "#8b5cf6", adding ? "#64748b" : "#fff") }}>
            {adding ? "✕ Cancel" : "+ Add Mock Test"}
          </button>
        )}
      </div>

      {adding && isAdmin && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>Add Mock Test</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Mock test name (e.g. Mock 1)" style={inp} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setAddType("github")} style={{ ...btn(addType === "github" ? "#8b5cf6" : "#f1f5f9", addType === "github" ? "#fff" : "#64748b"), flex: 1, fontSize: 12 }}>
                🌐 GitHub HTML Link
              </button>
              <button onClick={() => setAddType("json")} style={{ ...btn(addType === "json" ? "#8b5cf6" : "#f1f5f9", addType === "json" ? "#fff" : "#64748b"), flex: 1, fontSize: 12 }}>
                📋 JSON Question Data
              </button>
            </div>
            {addType === "github" ? (
              <input value={addContent} onChange={e => setAddContent(e.target.value)}
                placeholder="GitHub Pages URL (e.g. https://username.github.io/repo/test.html)"
                style={inp} />
            ) : (
              <div>
                <textarea value={addContent} onChange={e => setAddContent(e.target.value)}
                  placeholder={`Paste JSON:\n{"title":"Test","duration":60,"questions":[{"q":"Q?","opts":["A","B","C","D"],"ans":0}]}`}
                  rows={5} style={{ ...inp, resize: "vertical", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }} />
                <div style={{ marginTop: 8 }}>
                  <input type="file" ref={fileRef} accept=".json" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setAddContent(ev.target?.result as string || ""); r.readAsText(f); }} />
                  <button onClick={() => fileRef.current?.click()} style={{ ...btn("#f1f5f9", "#64748b"), fontSize: 12 }}>
                    📂 Upload .json file
                  </button>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={submitAdd} disabled={!addName.trim() || !addContent.trim()}
                style={{ ...btn("#8b5cf6", "#fff"), opacity: (!addName.trim() || !addContent.trim()) ? 0.5 : 1 }}>
                Save Mock Test →
              </button>
              <button onClick={() => setAdding(false)} style={btn("#f1f5f9", "#64748b")}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {currentExam.tests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, color: "#64748b", marginBottom: 4 }}>No mock tests yet</div>
          {isAdmin && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Add a GitHub HTML link or JSON question data.</div>}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 14 }}>
          {currentExam.tests.map((test, idx) => (
            <div key={test.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "3px solid " + (test.type === "github" ? "#3b82f6" : "#10b981"), borderRadius: 14, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", animation: `cardEntrance 0.3s ease ${idx * 0.05}s both` }}>
              {renaming === test.id ? (
                <InlineRename value={test.name}
                  onSave={name => { setCats(renameTest(currentCat.id, currentExam.id, test.id, name)); setRenaming(null); }}
                  onCancel={() => setRenaming(null)} />
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{test.type === "github" ? "🌐" : "📋"}</span>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", flex: 1 }}>{test.name}</div>
                    {isAdmin && (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setRenaming(test.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#64748b" }}>✏</button>
                        <button onClick={() => { if (confirm(`Delete "${test.name}"?`)) setCats(deleteTest(currentCat.id, currentExam.id, test.id)); }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#dc2626" }}>🗑</button>
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: test.type === "github" ? "#3b82f6" : "#10b981", marginBottom: 12, background: test.type === "github" ? "#eff6ff" : "#f0fdf4", padding: "3px 8px", borderRadius: 5, display: "inline-block" }}>
                    {test.type === "github" ? "GitHub HTML" : "JSON Quiz"}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginBottom: 14, wordBreak: "break-all", lineHeight: 1.5 }}>
                    {test.type === "github" ? test.content : "JSON data (" + (() => { try { return JSON.parse(test.content).questions?.length || 0; } catch { return 0; } })() + " questions)"}
                  </div>
                  <button onClick={() => openTest(test)} style={{ ...btn(test.type === "github" ? "#3b82f6" : "#10b981", "#fff"), width: "100%", padding: "10px" }}>
                    {test.type === "github" ? "Open Test ↗" : "Start Quiz ▷"}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Root MockTestSection ───────────────────────────────────────────────────────
export default function MockTestSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [view, setView] = useState<"categories" | "exams" | "tests">("categories");
  const [selectedCat, setSelectedCat] = useState<MockCategory | null>(null);
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(null);

  function goCategory(cat: MockCategory) { setSelectedCat(cat); setView("exams"); }
  function goExam(exam: MockExam) { setSelectedExam(exam); setView("tests"); }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px" }}>
        <button onClick={view === "categories" ? onBack : () => setView(view === "tests" ? "exams" : "categories")}
          style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 0, display: "flex", alignItems: "center", gap: 6 }}>
          ← {view === "categories" ? "Back to Dashboard" : view === "exams" ? "Back to Dashboard" : ""}
        </button>

        <div style={{ marginTop: 28 }}>
          {view === "categories" && (
            <CategoriesView isAdmin={isAdmin} onSelect={goCategory} />
          )}
          {view === "exams" && selectedCat && (
            <ExamsView cat={selectedCat} isAdmin={isAdmin} onBack={() => setView("categories")} onSelect={goExam} />
          )}
          {view === "tests" && selectedCat && selectedExam && (
            <MockTestsView cat={selectedCat} exam={selectedExam} isAdmin={isAdmin} onBack={() => setView("exams")} />
          )}
        </div>
      </div>
    </div>
  );
}
