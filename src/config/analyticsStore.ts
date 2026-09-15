// AnalyticsStore — test results and study session tracking
// Drive D config. Importable by Drive D sections (MockTestSection, AnalyticsSection).
// Do not import into Drive C files.

export interface TestResult {
  id: string;
  examName: string;
  subject: string;
  score: number;       // correct answers
  total: number;       // total questions
  accuracy: number;    // 0-100
  durationMs: number;
  timestamp: string;   // ISO date
}

export interface StudySession {
  id: string;
  subject: string;
  durationMinutes: number;
  note: string;
  timestamp: string;
}

const RESULTS_KEY = "knowledgeos_analytics_results";
const SESSIONS_KEY = "knowledgeos_analytics_sessions";

// ── Test Results ───────────────────────────────────────────────────────────────

export function getTestResults(): TestResult[] {
  try { return JSON.parse(localStorage.getItem(RESULTS_KEY) || "[]"); } catch { return []; }
}

export function logTestResult(r: Omit<TestResult, "id">): void {
  const results = getTestResults();
  results.unshift({ ...r, id: Date.now().toString() });
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results.slice(0, 200)));
}

export function deleteTestResult(id: string): void {
  const results = getTestResults().filter(r => r.id !== id);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

// ── Study Sessions ─────────────────────────────────────────────────────────────

export function getStudySessions(): StudySession[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]"); } catch { return []; }
}

export function logStudySession(s: Omit<StudySession, "id">): void {
  const sessions = getStudySessions();
  sessions.unshift({ ...s, id: Date.now().toString() });
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 500)));
}

export function deleteStudySession(id: string): void {
  const sessions = getStudySessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

// ── Aggregates ─────────────────────────────────────────────────────────────────

export interface SubjectStats {
  subject: string;
  count: number;
  avgAccuracy: number;
  totalTime: number;
}

export function getSubjectStats(): SubjectStats[] {
  const results = getTestResults();
  const map: Record<string, { acc: number[]; time: number }> = {};
  for (const r of results) {
    if (!map[r.subject]) map[r.subject] = { acc: [], time: 0 };
    map[r.subject].acc.push(r.accuracy);
    map[r.subject].time += r.durationMs;
  }
  return Object.entries(map).map(([subject, d]) => ({
    subject,
    count: d.acc.length,
    avgAccuracy: Math.round(d.acc.reduce((a, b) => a + b, 0) / d.acc.length),
    totalTime: d.time,
  })).sort((a, b) => b.count - a.count);
}

export function getTotalStudyMinutes(): number {
  return getStudySessions().reduce((s, sess) => s + sess.durationMinutes, 0);
}

export function getAvgAccuracy(): number {
  const r = getTestResults();
  if (!r.length) return 0;
  return Math.round(r.reduce((s, x) => s + x.accuracy, 0) / r.length);
}

// ── Activity Heatmap (last 30 days) ──────────────────────────────────────────

export function getActivityByDate(): Record<string, number> {
  const results = getTestResults();
  const sessions = getStudySessions();
  const map: Record<string, number> = {};
  const add = (timestamp: string) => {
    const day = timestamp.slice(0, 10);
    map[day] = (map[day] || 0) + 1;
  };
  results.forEach(r => add(r.timestamp));
  sessions.forEach(s => add(s.timestamp));
  return map;
}
