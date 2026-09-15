import { useState, useEffect, useCallback, useRef } from "react";
import {
  getPYQs,
  savePYQ,
  deletePYQ,
  generateId,
  EXAM_CONFIGS,
  PYQQuestion,
} from "../config/govtExamStore";

interface Props {
  onBack: () => void;
  isAdmin?: boolean;
}

// ─── Shared style tokens ──────────────────────────────────────────────────────
const fontBody = "'Outfit', sans-serif";
const fontSerif = "'Fraunces', serif";
const fontMono = "'JetBrains Mono', monospace";

const pill = (active: boolean): React.CSSProperties => ({
  padding: "6px 16px",
  borderRadius: 999,
  border: `1.5px solid ${active ? "#1a1a2e" : "#d1d5db"}`,
  background: active ? "#1a1a2e" : "#fff",
  color: active ? "#fff" : "#374151",
  fontFamily: fontBody,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.15s",
});

const btnPrimary: React.CSSProperties = {
  background: "#1a1a2e",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 22px",
  fontFamily: fontBody,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  background: "#fff",
  color: "#1a1a2e",
  border: "1.5px solid #1a1a2e",
  borderRadius: 10,
  padding: "10px 22px",
  fontFamily: fontBody,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #e5e7eb",
  borderRadius: 8,
  padding: "8px 12px",
  fontFamily: fontBody,
  fontSize: 14,
  outline: "none",
  background: "#fafafa",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: fontBody,
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
  display: "block",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type SimState = "select" | "running" | "finished";

interface SimAnswer {
  chosen: number | null; // 0-based option index
  marked: boolean;
}

// ── Custom Quiz Score History ────────────────────────────────────────────────
const QUIZ_HISTORY_KEY = "knowledgeos_custom_quiz_history";
interface QuizScore { id: string; subject: string; count: number; durationMin: number; correct: number; wrong: number; skipped: number; finalScore: number; timestamp: string; breakdown: { question: string; userAns: number; correct: number; timeMs: number }[]; }
const saveQuizScore = (s: QuizScore) => { try { const all: QuizScore[] = JSON.parse(localStorage.getItem(QUIZ_HISTORY_KEY) || "[]"); localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify([s, ...all].slice(0, 20))); } catch {} };
const loadQuizHistory = (): QuizScore[] => { try { return JSON.parse(localStorage.getItem(QUIZ_HISTORY_KEY) || "[]"); } catch { return []; } };

function CustomQuizTab() {
  const fontSerifCQ = "'Fraunces',serif";
  const fontBodyCQ = "'Outfit',sans-serif";
  const fontMonoCQ = "'JetBrains Mono',monospace";

  type Phase = "config" | "running" | "review" | "history";
  const [phase, setPhase] = useState<Phase>("config");

  // Config
  const [subject, setSubject] = useState("All");
  const [count, setCount] = useState(10);
  const [durationMin, setDurationMin] = useState(10);
  const [negMark] = useState(0.25);

  // Runtime
  const [questions, setQuestions] = useState<PYQQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const questionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Review
  const [score, setScore] = useState<QuizScore | null>(null);
  const [history, setHistory] = useState<QuizScore[]>([]);

  // Get available subjects from PYQ pool
  const allQ = getPYQs();
  const subjects = ["All", ...Array.from(new Set(allQ.map(q => q.subject)))];

  const startQuiz = () => {
    let pool = subject === "All" ? allQ : allQ.filter(q => q.subject === subject);
    if (pool.length === 0) { alert("No questions found for selected subject."); return; }
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setQuestions(shuffled);
    setAnswers(new Array(shuffled.length).fill(null));
    setFlagged(new Array(shuffled.length).fill(false));
    setQuestionTimes(new Array(shuffled.length).fill(0));
    setIdx(0);
    setTimeLeft(durationMin * 60);
    questionStartRef.current = Date.now();
    setPhase("running");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitQuiz(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const recordQuestionTime = (fromIdx: number) => {
    const elapsed = Date.now() - questionStartRef.current;
    setQuestionTimes(prev => { const n = [...prev]; n[fromIdx] = (n[fromIdx] || 0) + elapsed; return n; });
    questionStartRef.current = Date.now();
  };

  const navigate = (newIdx: number) => {
    recordQuestionTime(idx);
    setIdx(newIdx);
  };

  const selectAnswer = (opt: number) => {
    setAnswers(prev => { const n = [...prev]; n[idx] = opt; return n; });
  };

  const toggleFlag = () => setFlagged(prev => { const n = [...prev]; n[idx] = !n[idx]; return n; });

  const submitQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recordQuestionTime(idx);
    let correct = 0, wrong = 0;
    const breakdown = questions.map((q, i) => {
      const ua = answers[i];
      const isCorrect = ua !== null && ua === q.answer - 1;
      const isWrong = ua !== null && !isCorrect;
      if (isCorrect) correct++;
      if (isWrong) wrong++;
      return { question: q.question.slice(0, 80), userAns: ua ?? -1, correct: q.answer - 1, timeMs: questionTimes[i] || 0 };
    });
    const skipped = questions.length - correct - wrong;
    const finalScore = Math.max(0, correct * 2 - wrong * negMark);
    const s: QuizScore = {
      id: Date.now().toString(36),
      subject, count: questions.length, durationMin,
      correct, wrong, skipped, finalScore,
      timestamp: new Date().toISOString(),
      breakdown,
    };
    saveQuizScore(s);
    setScore(s);
    setPhase("review");
  };

  useEffect(() => { setHistory(loadQuizHistory()); }, []);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  // ── Config screen
  if (phase === "config") return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: fontSerifCQ, fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Configure Custom Quiz</h2>
        <button onClick={() => { setHistory(loadQuizHistory()); setPhase("history"); }}
          style={{ fontFamily: fontMonoCQ, fontSize: 12, color: "#6366f1", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
          📋 History ({loadQuizHistory().length})
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Subject</div>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontFamily: fontBodyCQ, fontSize: 14, color: "#1a1a2e", background: "#fff", cursor: "pointer" }}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Questions</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[5,10,15,20].map(n => (
              <button key={n} onClick={() => setCount(n)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer", fontFamily: fontMonoCQ, fontSize: 13, fontWeight: 700,
                  background: count === n ? "#1a1a2e" : "#fff", color: count === n ? "#fff" : "#374151", border: `1.5px solid ${count === n ? "#1a1a2e" : "#e5e7eb"}` }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Duration</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[5,10,15,30].map(n => (
              <button key={n} onClick={() => setDurationMin(n)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer", fontFamily: fontMonoCQ, fontSize: 13, fontWeight: 700,
                  background: durationMin === n ? "#1a1a2e" : "#fff", color: durationMin === n ? "#fff" : "#374151", border: `1.5px solid ${durationMin === n ? "#1a1a2e" : "#e5e7eb"}` }}>
                {n}m
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Rules</div>
          <div style={{ fontFamily: fontBodyCQ, fontSize: 13, color: "#78350f", lineHeight: 1.7 }}>
            +2 per correct answer<br/>
            -{negMark} per wrong answer<br/>
            0 for skipped
          </div>
        </div>
      </div>
      <button onClick={startQuiz}
        style={{ width: "100%", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 12, padding: "16px 0", fontFamily: fontSerifCQ, fontSize: 18, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}>
        ⚡ Start Quiz
      </button>
      <div style={{ textAlign: "center", marginTop: 10, fontFamily: fontMonoCQ, fontSize: 11, color: "#9ca3af" }}>
        {allQ.filter(q => subject === "All" || q.subject === subject).length} questions available in pool
      </div>
    </div>
  );

  // ── Running screen
  if (phase === "running") {
    const q = questions[idx];
    return (
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a1a2e", borderRadius: 12, padding: "12px 20px", marginBottom: 20 }}>
          <span style={{ fontFamily: fontMonoCQ, fontSize: 13, color: "#e2e8f0" }}>Q {idx+1}/{questions.length} · {subject}</span>
          <span style={{ fontFamily: fontMonoCQ, fontSize: 20, fontWeight: 700, color: timeLeft < 60 ? "#ef4444" : "#22c55e" }}>{fmt(timeLeft)}</span>
          <button onClick={() => { if (window.confirm("Submit quiz?")) submitQuiz(); }}
            style={{ fontFamily: fontBodyCQ, fontSize: 13, fontWeight: 600, color: "#fff", background: "#6366f1", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>
            Submit
          </button>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6366f1", background: "#eef2ff", borderRadius: 6, padding: "3px 8px" }}>{q.exam} · {q.year}</span>
                <button onClick={toggleFlag}
                  style={{ fontFamily: fontMonoCQ, fontSize: 11, cursor: "pointer", background: flagged[idx] ? "#fef3c7" : "#f9fafb", color: flagged[idx] ? "#92400e" : "#9ca3af", border: "1px solid " + (flagged[idx] ? "#fde68a" : "#e5e7eb"), borderRadius: 6, padding: "3px 8px" }}>
                  {flagged[idx] ? "🚩 Flagged" : "Flag"}
                </button>
              </div>
              <p style={{ fontFamily: fontBodyCQ, fontSize: 16, fontWeight: 500, color: "#1a1a2e", lineHeight: 1.6, margin: 0 }}>{q.question}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.opts.map((opt, oi) => {
                const selected = answers[idx] === oi;
                return (
                  <button key={oi} onClick={() => selectAnswer(oi)}
                    style={{ textAlign: "left", padding: "12px 18px", borderRadius: 10, cursor: "pointer", fontFamily: fontBodyCQ, fontSize: 15, lineHeight: 1.5,
                      background: selected ? "#1a1a2e" : "#fff", color: selected ? "#fff" : "#1a1a2e",
                      border: "1.5px solid " + (selected ? "#1a1a2e" : "#e5e7eb"), transition: "all 0.15s" }}>
                    <span style={{ fontFamily: fontMonoCQ, fontSize: 12, marginRight: 10, opacity: 0.7 }}>{["A","B","C","D"][oi]}</span>{opt}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => navigate(Math.max(0, idx - 1))} disabled={idx === 0}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontFamily: fontBodyCQ, fontSize: 14, fontWeight: 600, background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", opacity: idx === 0 ? 0.4 : 1 }}>
                ← Prev
              </button>
              <button onClick={() => navigate(Math.min(questions.length - 1, idx + 1))} disabled={idx === questions.length - 1}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontFamily: fontBodyCQ, fontSize: 14, fontWeight: 600, background: "#1a1a2e", color: "#fff", border: "none", opacity: idx === questions.length - 1 ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          </div>
          <div style={{ width: 180 }}>
            <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>Question Palette</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
              {questions.map((_, i) => (
                <button key={i} onClick={() => navigate(i)}
                  style={{ aspectRatio: "1", borderRadius: 6, cursor: "pointer", fontFamily: fontMonoCQ, fontSize: 11, fontWeight: 700, border: "1.5px solid transparent",
                    background: i === idx ? "#6366f1" : answers[i] !== null ? "#22c55e" : flagged[i] ? "#f59e0b" : "#f3f4f6",
                    color: i === idx || answers[i] !== null ? "#fff" : flagged[i] ? "#fff" : "#374151" }}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {[["#22c55e","Answered"],["#f59e0b","Flagged"],["#f3f4f6","Not visited"],["#6366f1","Current"]].map(([c,l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: c, border: c === "#f3f4f6" ? "1px solid #d1d5db" : "none" }} />
                  <span style={{ fontFamily: fontMonoCQ, fontSize: 10, color: "#9ca3af" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Review screen
  if (phase === "review" && score) return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius: 16, padding: "28px 32px", marginBottom: 24, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Final Score</div>
          <div style={{ fontFamily: fontSerifCQ, fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score.finalScore.toFixed(1)}</div>
          <div style={{ fontFamily: fontBodyCQ, fontSize: 13, color: "#64748b", marginTop: 4 }}>out of {score.count * 2} possible</div>
        </div>
        {([["✓ Correct", score.correct, "#22c55e"],["✗ Wrong", score.wrong, "#ef4444"],["— Skipped", score.skipped, "#94a3b8"]] as [string, number, string][]).map(([l,v,c]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fontSerifCQ, fontSize: 28, fontWeight: 700, color: c }}>{v}</div>
            <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#64748b" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Answer Breakdown</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {questions.map((q, i) => {
          const ua = score.breakdown[i].userAns;
          const ca = score.breakdown[i].correct;
          const isCorrect = ua === ca;
          const isSkipped = ua === -1;
          const timeS = (score.breakdown[i].timeMs / 1000).toFixed(1);
          return (
            <div key={i} style={{ background: "#fff", border: "1.5px solid " + (isSkipped ? "#e5e7eb" : isCorrect ? "#bbf7d0" : "#fecaca"), borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6b7280" }}>Q{i+1} · {q.exam} · {q.subject}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#9ca3af" }}>⏱ {timeS}s</span>
                  <span style={{ fontFamily: fontMonoCQ, fontSize: 11, fontWeight: 700, color: isSkipped ? "#9ca3af" : isCorrect ? "#16a34a" : "#dc2626", background: isSkipped ? "#f9fafb" : isCorrect ? "#f0fdf4" : "#fef2f2", borderRadius: 6, padding: "2px 8px" }}>
                    {isSkipped ? "Skipped" : isCorrect ? "+2" : "-" + negMark}
                  </span>
                </div>
              </div>
              <p style={{ fontFamily: fontBodyCQ, fontSize: 14, color: "#374151", margin: "0 0 10px", lineHeight: 1.5 }}>{q.question}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {q.opts.map((opt, oi) => (
                  <span key={oi} style={{ fontFamily: fontBodyCQ, fontSize: 13, padding: "4px 10px", borderRadius: 6,
                    background: oi === ca ? "#f0fdf4" : oi === ua && !isCorrect ? "#fef2f2" : "#f9fafb",
                    color: oi === ca ? "#16a34a" : oi === ua && !isCorrect ? "#dc2626" : "#6b7280",
                    border: "1px solid " + (oi === ca ? "#86efac" : oi === ua && !isCorrect ? "#fca5a5" : "#e5e7eb"),
                    fontWeight: oi === ca ? 700 : 400 }}>
                    {["A","B","C","D"][oi]}. {opt}
                  </span>
                ))}
              </div>
              {q.explanation && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, fontFamily: fontBodyCQ, fontSize: 13, color: "#0369a1" }}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setPhase("config")}
          style={{ flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer", fontFamily: fontBodyCQ, fontSize: 15, fontWeight: 700, background: "#1a1a2e", color: "#fff", border: "none" }}>
          New Quiz
        </button>
        <button onClick={() => { setHistory(loadQuizHistory()); setPhase("history"); }}
          style={{ flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer", fontFamily: fontBodyCQ, fontSize: 15, fontWeight: 600, background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" }}>
          View History
        </button>
      </div>
    </div>
  );

  // ── History screen
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPhase("config")}
          style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#6b7280", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
          ← Back
        </button>
        <h2 style={{ fontFamily: fontSerifCQ, fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Quiz History</h2>
      </div>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontFamily: fontBodyCQ }}>No quiz history yet. Take your first quiz!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map(h => (
            <div key={h.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontFamily: fontBodyCQ, fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>{h.subject} · {h.count} questions · {h.durationMin}min</div>
                <div style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{new Date(h.timestamp).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#22c55e" }}>✓{h.correct}</span>
                <span style={{ fontFamily: fontMonoCQ, fontSize: 11, color: "#ef4444" }}>✗{h.wrong}</span>
                <span style={{ fontFamily: fontSerifCQ, fontSize: 20, fontWeight: 700, color: "#1a1a2e" }}>{h.finalScore.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GovtExamSection({ onBack, isAdmin }: Props) {
  const [activeTab, setActiveTab] = useState<"flashcards" | "simulator" | "customquiz">("flashcards");

  return (
    <div style={{ minHeight: "100vh", paddingTop: 58, background: "#fff" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: fontBody,
            fontSize: 14,
            color: "#6b7280",
            padding: 0,
            marginBottom: 24,
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Heading */}
        <h1
          style={{
            fontFamily: fontSerif,
            fontSize: 32,
            fontWeight: 700,
            color: "#1a1a2e",
            margin: "0 0 4px",
          }}
        >
          Government Exam Prep
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 15, color: "#6b7280", margin: "0 0 28px" }}>
          PYQ flashcards and timed mock exam simulator for SSC, UPSC, GATE, DSSSB, IBPS and more.
        </p>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "2px solid #f3f4f6" }}>
          {(["flashcards", "simulator", "customquiz"] as const).map((t) => {
            const labels: Record<"flashcards" | "simulator" | "customquiz", string> = {
              flashcards: "PYQ Flashcards",
              simulator: "Timed Exam Simulator",
              customquiz: "⚡ Custom Quiz",
            };
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === t ? "2.5px solid #1a1a2e" : "2.5px solid transparent",
                  padding: "10px 20px",
                  fontFamily: fontBody,
                  fontSize: 15,
                  fontWeight: activeTab === t ? 700 : 500,
                  color: activeTab === t ? "#1a1a2e" : "#9ca3af",
                  cursor: "pointer",
                  marginBottom: -2,
                }}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        {activeTab === "flashcards" && <FlashcardsTab isAdmin={isAdmin} />}
        {activeTab === "simulator" && <SimulatorTab isAdmin={isAdmin} />}
        {activeTab === "customquiz" && <CustomQuizTab />}
      </div>
    </div>
  );
}

// ─── Tab 1: PYQ Flashcards ────────────────────────────────────────────────────
function FlashcardsTab({ isAdmin }: { isAdmin?: boolean }) {
  const [questions, setQuestions] = useState<PYQQuestion[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const MASTERY_KEY = "knowledgeos_pyq_mastery";
  const loadMastery = (): Set<string> => {
    try { return new Set(JSON.parse(localStorage.getItem(MASTERY_KEY) || "[]")); }
    catch { return new Set(); }
  };
  const saveMastery = (s: Set<string>) => {
    try { localStorage.setItem(MASTERY_KEY, JSON.stringify([...s])); } catch {}
  };
  const [masteredIds, setMasteredIds] = useState<Set<string>>(loadMastery);
  const [showOnlyUnmastered, setShowOnlyUnmastered] = useState(false);

  // Add form state
  const [form, setForm] = useState({
    exam: Object.keys(EXAM_CONFIGS)[0],
    year: String(new Date().getFullYear()),
    subject: "",
    question: "",
    opts: ["", "", "", ""] as [string, string, string, string],
    answer: 1,
    explanation: "",
  });

  const reload = () => setQuestions(getPYQs());

  useEffect(() => {
    reload();
  }, []);

  const examKeys = ["All", ...Object.keys(EXAM_CONFIGS)];

  const filtered = questions.filter((q) => {
    const examOk = selectedExam === "All" || q.exam === selectedExam;
    const subOk = selectedSubject === "All" || q.subject === selectedSubject;
    const mastOk = !showOnlyUnmastered || !masteredIds.has(q.id);
    return examOk && subOk && mastOk;
  });

  const toggleMastery = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveMastery(next);
      return next;
    });
  };

  // Subjects derived from current exam filter
  const subjects = [
    "All",
    ...Array.from(
      new Set(
        questions
          .filter((q) => selectedExam === "All" || q.exam === selectedExam)
          .map((q) => q.subject)
      )
    ),
  ];

  const safeIndex = filtered.length === 0 ? 0 : Math.min(currentIndex, filtered.length - 1);
  const card = filtered[safeIndex] ?? null;

  const navigate = (dir: number) => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => {
        const next = i + dir;
        if (next < 0) return filtered.length - 1;
        if (next >= filtered.length) return 0;
        return next;
      });
    }, 80);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this question?")) return;
    deletePYQ(id);
    reload();
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleSave = () => {
    if (!form.question.trim() || form.opts.some((o) => !o.trim())) {
      alert("Please fill in all required fields.");
      return;
    }
    savePYQ({ id: generateId(), ...form });
    reload();
    setShowAddForm(false);
    setForm({
      exam: Object.keys(EXAM_CONFIGS)[0],
      year: String(new Date().getFullYear()),
      subject: "",
      question: "",
      opts: ["", "", "", ""],
      answer: 1,
      explanation: "",
    });
  };

  const optLabels = ["A", "B", "C", "D"];

  return (
    <div>
      {/* Mastery Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280" }}>
            Mastery Progress: {masteredIds.size} / {questions.length} cards
          </span>
          <button
            onClick={() => { setShowOnlyUnmastered(v => !v); setCurrentIndex(0); setFlipped(false); }}
            style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer",
              background: showOnlyUnmastered ? "#1a1a2e" : "#f3f4f6",
              color: showOnlyUnmastered ? "#fff" : "#374151",
              border: "1px solid #e5e7eb", borderRadius: 20, padding: "4px 12px",
            }}
          >
            {showOnlyUnmastered ? "Showing: Unmastered" : "Show All"}
          </button>
        </div>
        <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3, background: "#22c55e",
            width: questions.length ? `${(masteredIds.size / questions.length) * 100}%` : "0%",
            transition: "width 0.4s",
          }} />
        </div>
      </div>

      {/* Exam filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {examKeys.map((e) => (
          <button
            key={e}
            style={pill(selectedExam === e)}
            onClick={() => {
              setSelectedExam(e);
              setSelectedSubject("All");
              setCurrentIndex(0);
              setFlipped(false);
            }}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Subject filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {subjects.map((s) => (
          <button
            key={s}
            style={pill(selectedSubject === s)}
            onClick={() => {
              setSelectedSubject(s);
              setCurrentIndex(0);
              setFlipped(false);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Admin add button */}
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <button style={btnPrimary} onClick={() => setShowAddForm(true)}>
            + Add PYQ
          </button>
        </div>
      )}

      {/* Flashcard area */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#9ca3af",
            fontFamily: fontBody,
            fontSize: 16,
          }}
        >
          No questions match the selected filters.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Card */}
          <div style={{ perspective: "1000px", width: 520, maxWidth: "100%" }}>
            <div
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.5s",
                transform: flipped ? "rotateY(180deg)" : "none",
                position: "relative",
                height: 280,
                width: "100%",
              }}
            >
              {/* Front */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  background: "#fff",
                  border: "2px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span
                      style={{
                        fontFamily: fontMono,
                        fontSize: 11,
                        color: "#6366f1",
                        background: "#eef2ff",
                        borderRadius: 6,
                        padding: "3px 8px",
                      }}
                    >
                      {card!.exam} · {card!.year}
                    </span>
                    <span
                      style={{
                        fontFamily: fontMono,
                        fontSize: 11,
                        color: "#6b7280",
                        background: "#f9fafb",
                        borderRadius: 6,
                        padding: "3px 8px",
                      }}
                    >
                      {card!.subject}
                    </span>
                    {card && masteredIds.has(card.id) && (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#16a34a", background: "#f0fdf4", borderRadius: 6, padding: "3px 8px" }}>✓ Mastered</span>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: 16,
                      fontWeight: 500,
                      color: "#1a1a2e",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {card!.question}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: 12,
                    color: "#d1d5db",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Click "Flip card" to see the answer
                </p>
              </div>

              {/* Back */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "#f0fdf4",
                  border: "2px solid #86efac",
                  borderRadius: 16,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    fontFamily: fontMono,
                    fontSize: 12,
                    color: "#15803d",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Correct Answer
                </div>
                <div
                  style={{
                    background: "#dcfce7",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontFamily: fontBody,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#14532d",
                  }}
                >
                  {optLabels[card!.answer]}. {card!.opts[card!.answer]}
                </div>
                <div
                  style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.6,
                    borderTop: "1px solid #bbf7d0",
                    paddingTop: 10,
                  }}
                >
                  {card!.explanation}
                </div>
                {card && (
                  <button
                    onClick={() => toggleMastery(card.id)}
                    style={{
                      marginTop: 12, padding: "8px 18px",
                      background: masteredIds.has(card.id) ? "#22c55e" : "#f3f4f6",
                      color: masteredIds.has(card.id) ? "#fff" : "#374151",
                      border: "1.5px solid " + (masteredIds.has(card.id) ? "#22c55e" : "#e5e7eb"),
                      borderRadius: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
                      cursor: "pointer", fontWeight: 600,
                    }}
                  >
                    {masteredIds.has(card.id) ? "✓ Mastered" : "Mark as Mastered"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{
                ...btnSecondary,
                padding: "8px 18px",
                fontSize: 20,
                lineHeight: 1,
              }}
              onClick={() => navigate(-1)}
            >
              ←
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                style={{ ...btnPrimary, padding: "9px 24px" }}
                onClick={() => setFlipped((f) => !f)}
              >
                {flipped ? "Hide Answer" : "Flip Card"}
              </button>
              <div
                style={{
                  fontFamily: fontMono,
                  fontSize: 12,
                  color: "#9ca3af",
                  marginTop: 8,
                }}
              >
                Card {safeIndex + 1} of {filtered.length}
              </div>
            </div>

            <button
              style={{
                ...btnSecondary,
                padding: "8px 18px",
                fontSize: 20,
                lineHeight: 1,
              }}
              onClick={() => navigate(1)}
            >
              →
            </button>

            {isAdmin && (
              <button
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1.5px solid #fca5a5",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontFamily: fontBody,
                  fontSize: 13,
                  fontWeight: 600,
                }}
                onClick={() => handleDelete(card!.id)}
              >
                🗑 Delete
              </button>
            )}
          </div>

          {/* Options preview on front (always shown) */}
          <div
            style={{
              width: 520,
              maxWidth: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {card!.opts.map((opt, i) => (
              <div
                key={i}
                style={{
                  background: flipped && i === card!.answer ? "#dcfce7" : "#f9fafb",
                  border: `1.5px solid ${flipped && i === card!.answer ? "#86efac" : "#e5e7eb"}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontFamily: fontBody,
                  fontSize: 13,
                  color: flipped && i === card!.answer ? "#14532d" : "#374151",
                  fontWeight: flipped && i === card!.answer ? 700 : 400,
                }}
              >
                <span style={{ fontWeight: 700, marginRight: 6 }}>{optLabels[i]}.</span>
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add PYQ Modal */}
      {showAddForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddForm(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              width: "100%",
              maxWidth: 580,
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                fontFamily: fontSerif,
                fontSize: 22,
                fontWeight: 700,
                color: "#1a1a2e",
                margin: "0 0 24px",
              }}
            >
              Add PYQ Question
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Exam select */}
              <div>
                <label style={labelStyle}>Exam *</label>
                <select
                  style={{ ...inputStyle }}
                  value={form.exam}
                  onChange={(e) => setForm((f) => ({ ...f, exam: e.target.value }))}
                >
                  {Object.keys(EXAM_CONFIGS).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label style={labelStyle}>Year *</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2023"
                />
              </div>

              {/* Subject */}
              <div>
                <label style={labelStyle}>Subject *</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. General Awareness"
                />
              </div>

              {/* Question */}
              <div>
                <label style={labelStyle}>Question *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="Enter the question text"
                />
              </div>

              {/* Options */}
              {(["A", "B", "C", "D"] as const).map((lbl, i) => (
                <div key={lbl}>
                  <label style={labelStyle}>Option {lbl} *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.opts[i]}
                    onChange={(e) => {
                      const opts = [...form.opts] as [string, string, string, string];
                      opts[i] = e.target.value;
                      setForm((f) => ({ ...f, opts }));
                    }}
                    placeholder={`Option ${lbl}`}
                  />
                </div>
              ))}

              {/* Answer */}
              <div>
                <label style={labelStyle}>Correct Answer *</label>
                <select
                  style={inputStyle}
                  value={form.answer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, answer: Number(e.target.value) }))
                  }
                >
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i}>
                      {["A", "B", "C", "D"][i]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explanation */}
              <div>
                <label style={labelStyle}>Explanation</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  value={form.explanation}
                  onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
                  placeholder="Brief explanation for the correct answer"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
              <button style={btnSecondary} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button style={btnPrimary} onClick={handleSave}>
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Timed Exam Simulator ─────────────────────────────────────────────
function SimulatorTab({ isAdmin }: { isAdmin?: boolean }) {
  const [simState, setSimState] = useState<SimState>("select");
  const [selectedExamKey, setSelectedExamKey] = useState<string>(Object.keys(EXAM_CONFIGS)[0]);
  const [examQuestions, setExamQuestions] = useState<PYQQuestion[]>([]);
  const [answers, setAnswers] = useState<SimAnswer[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const examConfig = EXAM_CONFIGS[selectedExamKey];

  // Timer
  useEffect(() => {
    if (simState !== "running") return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simState, timeLeft]);

  const startExam = () => {
    const allPYQs = getPYQs();
    const byExam = allPYQs.filter((q) => q.exam === selectedExamKey);
    const others = allPYQs.filter((q) => q.exam !== selectedExamKey);

    let pool: PYQQuestion[] = [...byExam];
    const target = Math.min(examConfig.totalQuestions, 20);

    // Pad with random questions from other exams if needed
    if (pool.length < target && others.length > 0) {
      const shuffled = [...others].sort(() => Math.random() - 0.5);
      pool = [...pool, ...shuffled].slice(0, target);
    } else {
      pool = pool.slice(0, target);
    }

    setExamQuestions(pool);
    setAnswers(pool.map(() => ({ chosen: null, marked: false })));
    setCurrentQ(0);
    setTimeLeft(examConfig.durationSeconds);
    setSimState("running");
  };

  const handleSubmit = useCallback(() => {
    setSimState("finished");
  }, []);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const computeScore = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    examQuestions.forEach((q, i) => {
      const a = answers[i];
      if (a.chosen === null) {
        skipped++;
      } else if (a.chosen === q.answer) {
        correct++;
      } else {
        wrong++;
      }
    });
    const raw = correct * examConfig.marksPerCorrect;
    const deduction = wrong * examConfig.negativeMarks;
    const final = raw - deduction;
    return { correct, wrong, skipped, raw, deduction, final };
  };

  if (simState === "select") {
    return <SelectScreen
      selectedExamKey={selectedExamKey}
      setSelectedExamKey={setSelectedExamKey}
      onStart={startExam}
      isAdmin={isAdmin}
    />;
  }

  if (simState === "running") {
    return (
      <RunningScreen
        examKey={selectedExamKey}
        examConfig={examConfig}
        questions={examQuestions}
        answers={answers}
        setAnswers={setAnswers}
        currentQ={currentQ}
        setCurrentQ={setCurrentQ}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onSubmit={handleSubmit}
      />
    );
  }

  // finished
  const score = computeScore();
  return (
    <FinishedScreen
      examKey={selectedExamKey}
      examConfig={examConfig}
      questions={examQuestions}
      answers={answers}
      score={score}
      onRetake={() => setSimState("select")}
    />
  );
}

// ─── Select Screen ────────────────────────────────────────────────────────────
function SelectScreen({
  selectedExamKey,
  setSelectedExamKey,
  onStart,
  isAdmin,
}: {
  selectedExamKey: string;
  setSelectedExamKey: (k: string) => void;
  onStart: () => void;
  isAdmin?: boolean;
}) {
  return (
    <div>
      {isAdmin && (
        <div
          style={{
            background: "#fffbeb",
            border: "1.5px solid #fcd34d",
            borderRadius: 10,
            padding: "12px 18px",
            fontFamily: fontBody,
            fontSize: 13,
            color: "#92400e",
            marginBottom: 24,
          }}
        >
          Admin tip: Add more PYQs in the Flashcards tab to enrich the simulator question pool.
        </div>
      )}

      <h2
        style={{
          fontFamily: fontSerif,
          fontSize: 24,
          fontWeight: 700,
          color: "#1a1a2e",
          margin: "0 0 20px",
        }}
      >
        Choose an Exam
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {Object.entries(EXAM_CONFIGS).map(([key, cfg]) => {
          const selected = key === selectedExamKey;
          return (
            <button
              key={key}
              onClick={() => setSelectedExamKey(key)}
              style={{
                background: selected ? "#1a1a2e" : "#fff",
                border: `2px solid ${selected ? "#1a1a2e" : "#e5e7eb"}`,
                borderRadius: 14,
                padding: "20px 22px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: selected ? "0 4px 16px rgba(26,26,46,0.18)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: fontSerif,
                  fontSize: 17,
                  fontWeight: 700,
                  color: selected ? "#fff" : "#1a1a2e",
                  marginBottom: 10,
                }}
              >
                {cfg.name}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 0",
                }}
              >
                {[
                  ["Questions", String(cfg.totalQuestions)],
                  ["Duration", `${cfg.durationSeconds / 60} min`],
                  ["Per Correct", `+${cfg.marksPerCorrect}`],
                  ["Negative", `-${cfg.negativeMarks}`],
                ].map(([lbl, val]) => (
                  <div key={lbl}>
                    <div
                      style={{
                        fontFamily: fontMono,
                        fontSize: 10,
                        color: selected ? "#a5b4fc" : "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {lbl}
                    </div>
                    <div
                      style={{
                        fontFamily: fontMono,
                        fontSize: 13,
                        fontWeight: 700,
                        color: selected ? "#e0e7ff" : "#374151",
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <button style={{ ...btnPrimary, fontSize: 16, padding: "12px 36px" }} onClick={onStart}>
        Start Exam →
      </button>
    </div>
  );
}

// ─── Running Screen ───────────────────────────────────────────────────────────
function RunningScreen({
  examKey,
  examConfig,
  questions,
  answers,
  setAnswers,
  currentQ,
  setCurrentQ,
  timeLeft,
  formatTime,
  onSubmit,
}: {
  examKey: string;
  examConfig: { name: string; negativeMarks: number; marksPerCorrect: number };
  questions: PYQQuestion[];
  answers: SimAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<SimAnswer[]>>;
  currentQ: number;
  setCurrentQ: React.Dispatch<React.SetStateAction<number>>;
  timeLeft: number;
  formatTime: (s: number) => string;
  onSubmit: () => void;
}) {
  const q = questions[currentQ];
  const a = answers[currentQ];
  const optLabels = ["A", "B", "C", "D"];

  const selectOption = (i: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = { ...next[currentQ], chosen: i };
      return next;
    });
  };

  const toggleMark = () => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = { ...next[currentQ], marked: !next[currentQ].marked };
      return next;
    });
  };

  const paletteColor = (idx: number): string => {
    const ans = answers[idx];
    if (ans.chosen !== null && ans.marked) return "#7c3aed"; // answered + marked = purple
    if (ans.marked) return "#f59e0b";                        // marked = yellow
    if (ans.chosen !== null) return "#16a34a";               // answered = green
    if (idx === currentQ) return "#3b82f6";                  // current
    return "#d1d5db";                                        // not visited
  };

  // Quick score estimate
  let est = 0;
  answers.forEach((ans, i) => {
    if (ans.chosen === null) return;
    if (ans.chosen === questions[i].answer) est += examConfig.marksPerCorrect;
    else est -= examConfig.negativeMarks;
  });

  const isLowTime = timeLeft < 300;

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", fontFamily: fontBody, color: "#6b7280" }}>
        No questions available for this exam.
      </div>
    );
  }

  return (
    <div>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#1a1a2e",
          borderRadius: 12,
          padding: "12px 22px",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: "#fff" }}>
          {examConfig.name}
        </span>
        <span
          style={{
            fontFamily: fontMono,
            fontSize: 22,
            fontWeight: 700,
            color: isLowTime ? "#f87171" : "#86efac",
          }}
        >
          ⏱ {formatTime(timeLeft)}
        </span>
        <span style={{ fontFamily: fontMono, fontSize: 14, color: "#a5b4fc" }}>
          Score est: {est.toFixed(2)}
        </span>
        <button
          style={{
            ...btnSecondary,
            background: "transparent",
            color: "#f87171",
            borderColor: "#f87171",
            padding: "7px 16px",
            fontSize: 13,
          }}
          onClick={() => {
            if (window.confirm("Submit exam now?")) onSubmit();
          }}
        >
          Submit
        </button>
      </div>

      {questions.length < 10 && (
        <div
          style={{
            background: "#fffbeb",
            border: "1.5px solid #fcd34d",
            borderRadius: 10,
            padding: "10px 16px",
            fontFamily: fontBody,
            fontSize: 13,
            color: "#92400e",
            marginBottom: 20,
          }}
        >
          Only {questions.length} questions available for this exam. Using all of them.
        </div>
      )}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Left: question + options */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Question header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span
              style={{
                fontFamily: fontMono,
                fontSize: 12,
                color: "#6366f1",
                background: "#eef2ff",
                borderRadius: 6,
                padding: "3px 10px",
              }}
            >
              Q{currentQ + 1} of {questions.length}
            </span>
            <label
              style={{
                fontFamily: fontBody,
                fontSize: 13,
                color: "#6b7280",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <input type="checkbox" checked={a.marked} onChange={toggleMark} />
              Mark for Review
            </label>
          </div>

          <p
            style={{
              fontFamily: fontBody,
              fontSize: 16,
              fontWeight: 500,
              color: "#1a1a2e",
              lineHeight: 1.6,
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: 12,
              padding: "18px 20px",
              marginBottom: 16,
            }}
          >
            {q.question}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => {
              const chosen = a.chosen === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  style={{
                    background: chosen ? "#eef2ff" : "#fff",
                    border: `2px solid ${chosen ? "#6366f1" : "#e5e7eb"}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: fontBody,
                    fontSize: 14,
                    color: chosen ? "#4338ca" : "#374151",
                    fontWeight: chosen ? 600 : 400,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    transition: "all 0.12s",
                  }}
                >
                  <span
                    style={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: chosen ? "#6366f1" : "#e5e7eb",
                      color: chosen ? "#fff" : "#374151",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {optLabels[i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              style={{ ...btnSecondary, opacity: currentQ === 0 ? 0.4 : 1 }}
              onClick={() => setCurrentQ((i) => Math.max(0, i - 1))}
              disabled={currentQ === 0}
            >
              ← Previous
            </button>
            <button
              style={{ ...btnPrimary, opacity: currentQ === questions.length - 1 ? 0.4 : 1 }}
              onClick={() => setCurrentQ((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentQ === questions.length - 1}
            >
              Next →
            </button>
            {currentQ === questions.length - 1 && (
              <button
                style={{ ...btnPrimary, background: "#16a34a", marginLeft: "auto" }}
                onClick={() => {
                  if (window.confirm("Submit exam now?")) onSubmit();
                }}
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        {/* Right: Question palette */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            background: "#f9fafb",
            border: "1.5px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 12,
            }}
          >
            Question Palette
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQ(idx)}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: paletteColor(idx),
                  border: idx === currentQ ? "2px solid #1a1a2e" : "2px solid transparent",
                  borderRadius: 6,
                  fontFamily: fontMono,
                  fontSize: 11,
                  fontWeight: 700,
                  color:
                    paletteColor(idx) === "#d1d5db" ? "#6b7280" : "#fff",
                  cursor: "pointer",
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { color: "#d1d5db", label: "Not Visited" },
              { color: "#16a34a", label: "Answered" },
              { color: "#f59e0b", label: "For Review" },
              { color: "#7c3aed", label: "Ans + Review" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: fontBody, fontSize: 11, color: "#6b7280" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Finished Screen ──────────────────────────────────────────────────────────
function FinishedScreen({
  examKey,
  examConfig,
  questions,
  answers,
  score,
  onRetake,
}: {
  examKey: string;
  examConfig: { name: string; negativeMarks: number; marksPerCorrect: number };
  questions: PYQQuestion[];
  answers: SimAnswer[];
  score: {
    correct: number;
    wrong: number;
    skipped: number;
    raw: number;
    deduction: number;
    final: number;
  };
  onRetake: () => void;
}) {
  const optLabels = ["A", "B", "C", "D"];

  return (
    <div>
      {/* Score card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 32,
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h2 style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>
              Exam Complete
            </h2>
            <p style={{ fontFamily: fontBody, fontSize: 14, color: "#a5b4fc", margin: 0 }}>
              {examConfig.name}
            </p>
          </div>
          <button style={{ ...btnSecondary, background: "transparent", color: "#fff", borderColor: "#6366f1" }} onClick={onRetake}>
            Retake Exam
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { label: "Correct", value: String(score.correct), color: "#86efac" },
            { label: "Wrong", value: String(score.wrong), color: "#fca5a5" },
            { label: "Skipped", value: String(score.skipped), color: "#fcd34d" },
            { label: "Raw Score", value: score.raw.toFixed(2), color: "#c4b5fd" },
            { label: "Deduction", value: `-${score.deduction.toFixed(2)}`, color: "#f87171" },
            { label: "Final Score", value: score.final.toFixed(2), color: "#34d399" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 10,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontFamily: fontMono, fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, color }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question review */}
      <h3
        style={{
          fontFamily: fontSerif,
          fontSize: 20,
          fontWeight: 700,
          color: "#1a1a2e",
          margin: "0 0 16px",
        }}
      >
        Question-by-Question Review
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((q, idx) => {
          const a = answers[idx];
          const isCorrect = a.chosen !== null && a.chosen === q.answer;
          const isWrong = a.chosen !== null && a.chosen !== q.answer;
          const isSkipped = a.chosen === null;

          const borderColor = isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e5e7eb";
          const bgColor = isCorrect ? "#f0fdf4" : isWrong ? "#fff1f2" : "#f9fafb";
          const badge = isCorrect ? "✓ Correct" : isWrong ? "✗ Wrong" : "— Skipped";
          const badgeColor = isCorrect ? "#16a34a" : isWrong ? "#dc2626" : "#9ca3af";

          return (
            <div
              key={q.id}
              style={{
                background: bgColor,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontFamily: fontMono, fontSize: 12, color: "#6366f1", background: "#eef2ff", borderRadius: 6, padding: "3px 10px" }}>
                  Q{idx + 1} · {q.exam} · {q.subject}
                </span>
                <span style={{ fontFamily: fontMono, fontSize: 13, fontWeight: 700, color: badgeColor }}>
                  {badge}
                </span>
              </div>

              <p style={{ fontFamily: fontBody, fontSize: 14, fontWeight: 500, color: "#1a1a2e", lineHeight: 1.55, margin: "0 0 12px" }}>
                {q.question}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginBottom: 12 }}>
                {q.opts.map((opt, i) => {
                  const isUserChoice = a.chosen === i;
                  const isRightAns = i === q.answer;
                  let bg = "#fff";
                  let border = "#e5e7eb";
                  let color = "#374151";
                  if (isRightAns) { bg = "#dcfce7"; border = "#86efac"; color = "#14532d"; }
                  else if (isUserChoice && !isRightAns) { bg = "#fee2e2"; border = "#fca5a5"; color = "#991b1b"; }
                  return (
                    <div
                      key={i}
                      style={{
                        background: bg,
                        border: `1.5px solid ${border}`,
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontFamily: fontBody,
                        fontSize: 13,
                        color,
                        fontWeight: isRightAns || isUserChoice ? 600 : 400,
                      }}
                    >
                      <span style={{ fontWeight: 700, marginRight: 6 }}>{optLabels[i]}.</span>
                      {opt}
                      {isRightAns && " ✓"}
                      {isUserChoice && !isRightAns && " (Your answer)"}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div
                  style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: "#374151",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "10px 14px",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button style={{ ...btnPrimary, fontSize: 16, padding: "12px 36px" }} onClick={onRetake}>
          Retake Exam
        </button>
      </div>
    </div>
  );
}
