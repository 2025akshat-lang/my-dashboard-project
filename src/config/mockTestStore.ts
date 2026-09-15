// Mock Test hierarchical store — Category → Exam → MockTest → Content
// All CRUD persisted to localStorage.

export type MockContentType = "github" | "json";

export interface MockTest {
  id: string;
  name: string; // "Mock 1", "Mock 2", etc.
  type: MockContentType;
  content: string; // GitHub HTML URL or JSON string
  createdAt: string;
}

export interface MockExam {
  id: string;
  name: string; // "SSC CGL", "UPSC", etc.
  tests: MockTest[];
  createdAt: string;
}

export interface MockCategory {
  id: string;
  name: string; // "Govt Exam", "Entrance Exams", etc.
  icon: string;
  exams: MockExam[];
  createdAt: string;
}

const STORAGE_KEY = "knowledgeos_mocktests_v2";

const SEED: MockCategory[] = [
  {
    id: "govt",
    name: "Govt Exams",
    icon: "🏛️",
    createdAt: "2025-09-01",
    exams: [
      {
        id: "ssc",
        name: "SSC CGL",
        createdAt: "2025-09-01",
        tests: [
          {
            id: "ssc-m1",
            name: "Mock 1",
            type: "json",
            content: JSON.stringify({
              title: "SSC CGL Mock 1",
              duration: 60,
              questions: [
                { q: "What is the capital of India?", opts: ["Mumbai", "Delhi", "Chennai", "Kolkata"], ans: 1 },
                { q: "Who wrote the Indian Constitution?", opts: ["Nehru", "Gandhi", "Ambedkar", "Patel"], ans: 2 },
                { q: "Which river is longest in India?", opts: ["Ganga", "Yamuna", "Godavari", "Indus"], ans: 0 },
              ]
            }),
            createdAt: "2025-09-01",
          },
        ],
      },
    ],
  },
  {
    id: "entrance",
    name: "Entrance Exams",
    icon: "🎓",
    createdAt: "2025-09-02",
    exams: [
      {
        id: "jee",
        name: "JEE Mains",
        createdAt: "2025-09-02",
        tests: [],
      },
    ],
  },
];

function load(): MockCategory[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(stored)) return stored;
  } catch { /* empty */ }
  return SEED;
}

function save(data: MockCategory[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCategories(): MockCategory[] {
  return load();
}

export function addCategory(name: string, icon: string): MockCategory[] {
  const data = load();
  data.push({ id: Date.now().toString(), name, icon, exams: [], createdAt: new Date().toISOString().slice(0, 10) });
  save(data);
  return data;
}

export function renameCategory(catId: string, name: string): MockCategory[] {
  const data = load().map(c => c.id === catId ? { ...c, name } : c);
  save(data);
  return data;
}

export function deleteCategory(catId: string): MockCategory[] {
  const data = load().filter(c => c.id !== catId);
  save(data);
  return data;
}

export function addExam(catId: string, name: string): MockCategory[] {
  const data = load().map(c => {
    if (c.id !== catId) return c;
    return { ...c, exams: [...c.exams, { id: Date.now().toString(), name, tests: [], createdAt: new Date().toISOString().slice(0, 10) }] };
  });
  save(data);
  return data;
}

export function renameExam(catId: string, examId: string, name: string): MockCategory[] {
  const data = load().map(c => {
    if (c.id !== catId) return c;
    return { ...c, exams: c.exams.map(e => e.id === examId ? { ...e, name } : e) };
  });
  save(data);
  return data;
}

export function deleteExam(catId: string, examId: string): MockCategory[] {
  const data = load().map(c => {
    if (c.id !== catId) return c;
    return { ...c, exams: c.exams.filter(e => e.id !== examId) };
  });
  save(data);
  return data;
}

export function addTest(catId: string, examId: string, name: string, type: MockContentType, content: string): MockCategory[] {
  const data = load().map(c => {
    if (c.id !== catId) return c;
    return {
      ...c,
      exams: c.exams.map(e => {
        if (e.id !== examId) return e;
        const t: MockTest = { id: Date.now().toString(), name, type, content, createdAt: new Date().toISOString().slice(0, 10) };
        return { ...e, tests: [...e.tests, t] };
      }),
    };
  });
  save(data);
  return data;
}

export function renameTest(catId: string, examId: string, testId: string, name: string): MockCategory[] {
  const data = load().map(c => {
    if (c.id !== catId) return c;
    return {
      ...c,
      exams: c.exams.map(e => {
        if (e.id !== examId) return e;
        return { ...e, tests: e.tests.map(t => t.id === testId ? { ...t, name } : t) };
      }),
    };
  });
  save(data);
  return data;
}

export function deleteTest(catId: string, examId: string, testId: string): MockCategory[] {
  const data = load().map(c => {
    if (c.id !== catId) return c;
    return {
      ...c,
      exams: c.exams.map(e => {
        if (e.id !== examId) return e;
        return { ...e, tests: e.tests.filter(t => t.id !== testId) };
      }),
    };
  });
  save(data);
  return data;
}
