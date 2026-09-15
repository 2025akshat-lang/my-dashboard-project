import { useState } from "react";
import {
  getTestResults, getStudySessions, getSubjectStats, getTotalStudyMinutes,
  getAvgAccuracy, getActivityByDate, logStudySession, deleteTestResult, deleteStudySession,
  TestResult, StudySession,
} from "../config/analyticsStore";

// ── Shared styles ──────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13,
  color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
};

// ── SVG Bar Chart — Score History ──────────────────────────────────────────────
function ScoreBarChart({ results }: { results: TestResult[] }) {
  const W = 640, H = 180, PAD = { left: 40, right: 12, top: 12, bottom: 48 };
  const data = results.slice(0, 20).reverse();
  if (!data.length) return (
    <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
      No test data yet. Complete a quiz to see your scores here.
    </div>
  );

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW = Math.min(36, chartW / data.length - 4);
  const colW = chartW / data.length;
  const yLines = [0, 25, 50, 75, 100];

  function barColor(acc: number) { return acc >= 80 ? "#10b981" : acc >= 60 ? "#f59e0b" : "#ef4444"; }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, overflow: "visible" }}>
      {/* Y gridlines */}
      {yLines.map(y => {
        const cy = PAD.top + chartH - (y / 100) * chartH;
        return (
          <g key={y}>
            <line x1={PAD.left} y1={cy} x2={W - PAD.right} y2={cy} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.left - 5} y={cy + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono">{y}%</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((r, i) => {
        const x = PAD.left + i * colW + (colW - barW) / 2;
        const barH = (r.accuracy / 100) * chartH;
        const y = PAD.top + chartH - barH;
        const label = r.examName.length > 8 ? r.examName.slice(0, 7) + "…" : r.examName;
        return (
          <g key={r.id}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={barColor(r.accuracy)} opacity={0.85} />
            <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="9" fill={barColor(r.accuracy)} fontFamily="JetBrains Mono">{r.accuracy}%</text>
            <text x={x + barW / 2} y={PAD.top + chartH + 14} textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily="Outfit" transform={`rotate(-25, ${x + barW / 2}, ${PAD.top + chartH + 14})`}>{label}</text>
          </g>
        );
      })}
      {/* X axis */}
      <line x1={PAD.left} y1={PAD.top + chartH} x2={W - PAD.right} y2={PAD.top + chartH} stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

// ── SVG Subject Distribution ───────────────────────────────────────────────────
const SUBJECT_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6"];

function SubjectChart({ stats }: { stats: ReturnType<typeof getSubjectStats> }) {
  if (!stats.length) return (
    <div style={{ padding: "24px 0", textAlign: "center", color: "#94a3b8", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>No subject data yet.</div>
  );
  const max = Math.max(...stats.map(s => s.avgAccuracy));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {stats.map((s, i) => (
        <div key={s.subject}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{s.subject}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748b" }}>{s.avgAccuracy}% avg · {s.count} test{s.count !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ height: 10, background: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(s.avgAccuracy / Math.max(max, 100)) * 100}%`, background: SUBJECT_COLORS[i % SUBJECT_COLORS.length], borderRadius: 5, transition: "width 0.6s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Activity Heatmap (last 30 days) ───────────────────────────────────────────
function ActivityHeatmap({ data }: { data: Record<string, number> }) {
  const days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: data[key] || 0 });
  }
  const max = Math.max(...days.map(d => d.count), 1);

  function intensity(count: number): string {
    if (!count) return "#f1f5f9";
    const ratio = count / max;
    if (ratio < 0.33) return "#ddd6fe";
    if (ratio < 0.66) return "#8b5cf6";
    return "#5b21b6";
  }

  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Last 30 days activity</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {days.map(d => (
          <div key={d.date} title={`${d.date}: ${d.count} activit${d.count !== 1 ? "ies" : "y"}`}
            style={{ width: 18, height: 18, borderRadius: 4, background: intensity(d.count), cursor: "default", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }}>Less</span>
        {["#f1f5f9", "#ddd6fe", "#8b5cf6", "#5b21b6"].map(c => <div key={c} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />)}
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }}>More</span>
      </div>
    </div>
  );
}

// ── Log Session Form (admin) ───────────────────────────────────────────────────
function LogSessionForm({ onLog }: { onLog: () => void }) {
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  function submit() {
    if (!subject.trim() || !duration.trim()) return;
    logStudySession({ subject: subject.trim(), durationMinutes: parseInt(duration) || 0, note: note.trim(), timestamp: new Date().toISOString() });
    setSubject(""); setDuration(""); setNote(""); setOpen(false); onLog();
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "9px 16px", color: "#059669", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      + Log Study Session
    </button>
  );

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Log a Study Session</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (e.g. Chemistry)" style={inp} />
        <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (minutes)" type="number" min="1" style={inp} />
      </div>
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" style={{ ...inp, marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={submit} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save Session →</button>
        <button onClick={() => setOpen(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "8px 12px", color: "#64748b", fontFamily: "'Outfit',sans-serif", fontSize: 12, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Root AnalyticsSection ──────────────────────────────────────────────────────
export default function AnalyticsSection({ onBack, isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(v => v + 1);

  const results = getTestResults();
  const sessions = getStudySessions();
  const subjectStats = getSubjectStats();
  const totalStudyMin = getTotalStudyMinutes();
  const avgAcc = getAvgAccuracy();
  const activityMap = getActivityByDate();
  const bestSubject = subjectStats.find(s => s.avgAccuracy === Math.max(...subjectStats.map(x => x.avgAccuracy)));

  const statCards = [
    { label: "Tests Taken", value: results.length.toString(), sub: "total attempts", accent: "#8b5cf6", icon: "📝" },
    { label: "Avg Accuracy", value: avgAcc ? `${avgAcc}%` : "—", sub: "across all tests", accent: "#3b82f6", icon: "🎯" },
    { label: "Study Time", value: totalStudyMin >= 60 ? `${Math.floor(totalStudyMin / 60)}h ${totalStudyMin % 60}m` : `${totalStudyMin}m`, sub: "logged sessions", accent: "#10b981", icon: "⏱" },
    { label: "Best Subject", value: bestSubject?.subject || "—", sub: bestSubject ? `${bestSubject.avgAccuracy}% avg` : "no data", accent: "#f59e0b", icon: "⭐" },
  ];

  const [activeTab, setActiveTab] = useState<"overview" | "tests" | "sessions">("overview");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px" }} key={tick}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Progress Tracker</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.05 }}>Learning Analytics</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>Score trends, subject breakdown, activity heatmap, and study log.</p>
          </div>
          {isAdmin && <LogSessionForm onLog={refresh} />}
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))", gap: 14, marginBottom: 28 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: `3px solid ${s.accent}`, borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: s.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#94a3b8" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {(["overview", "tests", "sessions"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.15s", textTransform: "capitalize",
                background: activeTab === t ? "#fff" : "transparent",
                color: activeTab === t ? "#8b5cf6" : "#64748b",
                boxShadow: activeTab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
              {t === "overview" ? "📊 Overview" : t === "tests" ? "📝 Test Log" : "📅 Study Log"}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Score History</div>
                <ScoreBarChart results={results} />
                <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                  {[["#10b981", "≥ 80%"], ["#f59e0b", "60–79%"], ["#ef4444", "< 60%"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Subject Performance</div>
                <SubjectChart stats={subjectStats} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>Activity</div>
                <ActivityHeatmap data={activityMap} />
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Quick Stats</div>
                {[
                  { label: "Tests this week", value: results.filter(r => { const d = new Date(r.timestamp); const now = new Date(); return (now.getTime() - d.getTime()) < 7 * 86400000; }).length },
                  { label: "Best score", value: results.length ? `${Math.max(...results.map(r => r.accuracy))}%` : "—" },
                  { label: "Subjects covered", value: subjectStats.length },
                  { label: "Study sessions", value: sessions.length },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b" }}>{s.label}</span>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test log tab */}
        {activeTab === "tests" && (
          <div>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "#64748b", marginBottom: 4 }}>No test results yet</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Complete a quiz in the Mock Test section to see results here.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.map(r => {
                  const color = r.accuracy >= 80 ? "#10b981" : r.accuracy >= 60 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={r.id} style={{ background: "#fff", border: `1px solid #e2e8f0`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{r.examName}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8" }}>{r.subject} · {r.timestamp.slice(0, 10)}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 800, color }}>{r.accuracy}%</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }}>{r.score}/{r.total} correct</div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => { deleteTestResult(r.id); refresh(); }}
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 13 }}>🗑</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Study log tab */}
        {activeTab === "sessions" && (
          <div>
            {sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px dashed #e2e8f0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "#64748b", marginBottom: 4 }}>No study sessions logged</div>
                {isAdmin && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Use "Log Study Session" above to track your study time.</div>}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sessions.map(s => (
                  <div key={s.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: "3px solid #10b981", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{s.subject}</div>
                      {s.note && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.note}</div>}
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{s.timestamp.slice(0, 10)}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 800, color: "#10b981" }}>{s.durationMinutes}m</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }}>studied</div>
                    </div>
                    {isAdmin && (
                      <button onClick={() => { deleteStudySession(s.id); refresh(); }}
                        style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 13 }}>🗑</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
