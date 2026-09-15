// Practicals store — persisted to localStorage
// Admin can add/edit/delete; viewers read-only.

export type PracticalType = "github" | "html";

export interface Practical {
  id: string;
  title: string;
  label: string; // e.g. "3.a · Chemistry"
  icon: string;
  accent: string;
  desc: string;
  tags: string[];
  type: PracticalType;
  content: string; // GitHub URL or raw HTML string
  createdAt: string;
}

const STORAGE_KEY = "knowledgeos_practicals_v2";

const SEED: Practical[] = [
  { id: "butterfly", title: "Chemistry Practical", label: "3.a · Chemistry", icon: "🦋", accent: "#10b981", desc: "Interactive chemistry practical with animated molecular structures.", tags: ["Chemistry", "Molecules", "Interactive"], type: "github", content: "https://2025akshat-lang.github.io/Akshat/Butterfly_debugged_preserve_all.html", createdAt: "2025-09-01" },
  { id: "physics", title: "Physics Practical", label: "3.b · Physics", icon: "⚡", accent: "#06b6d4", desc: "Physics experiments with real-time simulations and data visualisation.", tags: ["Physics", "Waves", "Simulation"], type: "github", content: "https://2025akshat-lang.github.io/Akshat/Fullwa.html", createdAt: "2025-09-01" },
  { id: "biochemistry", title: "Biochemistry Lab", label: "3.c · Biochemistry", icon: "🧬", accent: "#a78bfa", desc: "Biochemistry interactive lab covering enzymes and cellular processes.", tags: ["Biochemistry", "Enzymes", "Cells"], type: "github", content: "https://2025akshat-lang.github.io/Akshat/Biochemistry.html", createdAt: "2025-09-01" },
  { id: "instrumentation", title: "Instrumentation Lab", label: "3.d · Instrumentation", icon: "🔬", accent: "#f59e0b", desc: "Instrumentation and measurement techniques with virtual lab equipment.", tags: ["Instruments", "Measurement", "Lab"], type: "github", content: "https://2025akshat-lang.github.io/Akshat/instrumental.html", createdAt: "2025-09-01" },
  { id: "chemistry-overview", title: "Chemistry Overview", label: "3.e · Chemistry Overview", icon: "⚗️", accent: "#f97316", desc: "Comprehensive chemistry overview covering core reactions and concepts.", tags: ["Chemistry", "Reactions", "Overview"], type: "github", content: "https://2025akshat-lang.github.io/Akshat/Chemistry.html", createdAt: "2025-09-01" },
  { id: "labvisit", title: "Virtual Lab Visit", label: "3.f · Virtual Lab Visit", icon: "🏫", accent: "#ec4899", desc: "Virtual tour of a real chemistry laboratory with equipment explanations.", tags: ["Lab Tour", "Virtual", "Equipment"], type: "github", content: "https://2025akshat-lang.github.io/Akshat/Lab_visit.html", createdAt: "2025-09-01" },
];

function load(): Practical[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(stored) && stored.length) return stored;
  } catch { /* empty */ }
  return SEED;
}

function save(data: Practical[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPracticals(): Practical[] {
  return load();
}

export function addPractical(p: Omit<Practical, "id" | "createdAt">): Practical[] {
  const data = load();
  const newItem: Practical = { ...p, id: Date.now().toString(), createdAt: new Date().toISOString().slice(0, 10) };
  data.push(newItem);
  save(data);
  return data;
}

export function updatePractical(id: string, changes: Partial<Omit<Practical, "id" | "createdAt">>): Practical[] {
  const data = load().map(p => p.id === id ? { ...p, ...changes } : p);
  save(data);
  return data;
}

export function deletePractical(id: string): Practical[] {
  const data = load().filter(p => p.id !== id);
  save(data);
  return data;
}

export function reorderPracticals(ids: string[]): Practical[] {
  const data = load();
  const map = Object.fromEntries(data.map(p => [p.id, p]));
  const reordered = ids.map(id => map[id]).filter(Boolean);
  save(reordered);
  return reordered;
}

export const ACCENT_OPTIONS = ["#10b981", "#06b6d4", "#a78bfa", "#f59e0b", "#f97316", "#ec4899", "#3b82f6", "#ef4444", "#84cc16", "#8b5cf6"];
export const ICON_OPTIONS = ["🦋", "⚡", "🧬", "🔬", "⚗️", "🏫", "🧪", "📐", "🌡️", "💊", "🔭", "⚙️", "🧲", "💡", "🌿"];
