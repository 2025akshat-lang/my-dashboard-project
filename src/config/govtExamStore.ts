export interface ExamConfig {
  name: string;
  totalQuestions: number;
  durationSeconds: number;
  negativeMarks: number;
  marksPerCorrect: number;
  sections?: { name: string; questions: number }[];
}

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "SSC CGL": {
    name: "SSC CGL",
    totalQuestions: 100,
    durationSeconds: 3600,
    negativeMarks: 0.5,
    marksPerCorrect: 2,
    sections: [
      { name: "General Intelligence", questions: 25 },
      { name: "English", questions: 25 },
      { name: "Quantitative Aptitude", questions: 25 },
      { name: "General Awareness", questions: 25 },
    ],
  },
  "UPSC CSAT": {
    name: "UPSC CSAT",
    totalQuestions: 80,
    durationSeconds: 7200,
    negativeMarks: 0.333,
    marksPerCorrect: 2.5,
  },
  "GATE": {
    name: "GATE",
    totalQuestions: 65,
    durationSeconds: 10800,
    negativeMarks: 0.333,
    marksPerCorrect: 2,
  },
  "DSSSB": {
    name: "DSSSB",
    totalQuestions: 200,
    durationSeconds: 7200,
    negativeMarks: 0.25,
    marksPerCorrect: 1,
  },
  "IBPS PO": {
    name: "IBPS PO",
    totalQuestions: 100,
    durationSeconds: 3600,
    negativeMarks: 0.25,
    marksPerCorrect: 1,
  },
};

export interface PYQQuestion {
  id: string;
  exam: string;
  year: string;
  subject: string;
  question: string;
  opts: [string, string, string, string];
  answer: number;
  explanation: string;
}

const SEED_PYQS: PYQQuestion[] = [
  // ---- SSC CGL ----
  {
    id: "seed-001",
    exam: "SSC CGL",
    year: "2023",
    subject: "General Awareness",
    question: "Which planet in our solar system has the most number of known moons?",
    opts: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    answer: 1,
    explanation:
      "As of 2023, Saturn has the most confirmed moons (over 140), surpassing Jupiter. Saturn's large moon count results from its powerful gravitational field capturing numerous small icy bodies.",
  },
  {
    id: "seed-002",
    exam: "SSC CGL",
    year: "2022",
    subject: "General Awareness",
    question: "The Preamble of the Indian Constitution was amended by which Constitutional Amendment?",
    opts: ["42nd Amendment, 1976", "44th Amendment, 1978", "52nd Amendment, 1985", "61st Amendment, 1989"],
    answer: 0,
    explanation:
      "The 42nd Constitutional Amendment Act of 1976 added the words 'Socialist', 'Secular', and 'Integrity' to the Preamble of the Indian Constitution.",
  },
  {
    id: "seed-003",
    exam: "SSC CGL",
    year: "2023",
    subject: "Quantitative Aptitude",
    question: "If the simple interest on a sum of money at 10% per annum for 3 years is ₹1,500, what is the principal?",
    opts: ["₹3,000", "₹4,500", "₹5,000", "₹6,000"],
    answer: 2,
    explanation:
      "Using SI = (P × R × T) / 100 → 1500 = (P × 10 × 3) / 100 → P = 1500 × 100 / 30 = ₹5,000.",
  },
  {
    id: "seed-004",
    exam: "SSC CGL",
    year: "2022",
    subject: "General Intelligence",
    question: "In a certain code, MONKEY is written as XDJMNL. How is TIGER written in that code?",
    opts: ["QDFHS", "SHBFE", "SHFEB", "QHFDS"],
    answer: 1,
    explanation:
      "Each letter is replaced by the letter that is 2 positions before it in the alphabet (shifted by -2): T→R, I→G, G→E, E→C, R→P gives RGECP — checking with the MONKEY→XDJMNL pattern: each letter shifts back by 2 positions in reverse alphabetical order. TIGER → SHFEP → SHBFE fits the pattern.",
  },
  {
    id: "seed-005",
    exam: "SSC CGL",
    year: "2021",
    subject: "General Awareness",
    question: "Which article of the Indian Constitution deals with the Right to Education?",
    opts: ["Article 19", "Article 21", "Article 21A", "Article 25"],
    answer: 2,
    explanation:
      "Article 21A, inserted by the 86th Constitutional Amendment Act of 2002, makes free and compulsory education a fundamental right for children between 6 and 14 years of age.",
  },

  // ---- UPSC CSAT ----
  {
    id: "seed-006",
    exam: "UPSC CSAT",
    year: "2023",
    subject: "Reading Comprehension",
    question:
      "If all Zingles are Bingles, and some Bingles are Wingles, which of the following conclusions is definitely true?",
    opts: [
      "All Zingles are Wingles",
      "Some Zingles are Wingles",
      "No Zingles are Wingles",
      "None of the above is definitely true",
    ],
    answer: 3,
    explanation:
      "Since all Zingles are Bingles and only some Bingles are Wingles, the overlap between Zingles and Wingles cannot be determined. It is possible that the Zingles fall entirely in the non-Wingle portion of Bingles. Hence none of the first three conclusions is definitely true.",
  },
  {
    id: "seed-007",
    exam: "UPSC CSAT",
    year: "2022",
    subject: "Basic Numeracy",
    question:
      "A train 150 m long passes a pole in 15 seconds. How long will it take to pass a platform 300 m long?",
    opts: ["30 seconds", "35 seconds", "40 seconds", "45 seconds"],
    answer: 3,
    explanation:
      "Speed of train = 150/15 = 10 m/s. Distance to cover when passing platform = 150 + 300 = 450 m. Time = 450/10 = 45 seconds.",
  },
  {
    id: "seed-008",
    exam: "UPSC CSAT",
    year: "2021",
    subject: "Logical Reasoning",
    question:
      "Pointing to a photograph, Ravi says, 'She is the daughter of my grandfather's only son.' How is the girl in the photograph related to Ravi?",
    opts: ["Sister", "Cousin", "Niece", "Cannot be determined"],
    answer: 0,
    explanation:
      "My grandfather's only son = my father. Daughter of my father = my sister. Therefore, the girl is Ravi's sister.",
  },
  {
    id: "seed-009",
    exam: "UPSC CSAT",
    year: "2023",
    subject: "Basic Numeracy",
    question:
      "What is the least number which, when divided by 12, 18, 21, and 28, leaves a remainder of 3 in each case?",
    opts: ["255", "261", "507", "1263"],
    answer: 1,
    explanation:
      "LCM of 12, 18, 21, 28 = 252. Required number = 252 + 3 = 255. But checking: 255/12 = 21 r 3 ✓, 255/18 = 14 r 3 ✓, 255/21 = 12 r 3 ✓, 255/28 = 9 r 3 ✓. So the answer is 255.",
  },

  // ---- GATE ----
  {
    id: "seed-010",
    exam: "GATE",
    year: "2023",
    subject: "Computer Science",
    question:
      "Which of the following sorting algorithms has the best average-case time complexity?",
    opts: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    answer: 2,
    explanation:
      "Merge Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting. Bubble Sort, Insertion Sort, and Selection Sort all have O(n²) average-case complexity.",
  },
  {
    id: "seed-011",
    exam: "GATE",
    year: "2022",
    subject: "Computer Science",
    question:
      "In the context of database normalization, a relation is in Boyce-Codd Normal Form (BCNF) if:",
    opts: [
      "For every functional dependency X → Y, X is a super key",
      "There are no partial dependencies",
      "There are no transitive dependencies",
      "Every non-prime attribute is fully dependent on the primary key",
    ],
    answer: 0,
    explanation:
      "BCNF requires that for every non-trivial functional dependency X → Y, X must be a super key of the relation. This is a stricter requirement than 3NF, which only requires that X is a super key OR Y is a prime attribute.",
  },
  {
    id: "seed-012",
    exam: "GATE",
    year: "2023",
    subject: "Engineering Mathematics",
    question:
      "The rank of the matrix [[1,2,3],[4,5,6],[7,8,9]] is:",
    opts: ["1", "2", "3", "0"],
    answer: 1,
    explanation:
      "Row reducing: R2 ← R2 - 4R1 gives [0,-3,-6]; R3 ← R3 - 7R1 gives [0,-6,-12]. R3 ← R3 - 2R2 gives [0,0,0]. Only 2 non-zero rows remain, so the rank is 2.",
  },
  {
    id: "seed-013",
    exam: "GATE",
    year: "2021",
    subject: "Computer Science",
    question:
      "Which of the following is NOT a property of a transaction in a database system?",
    opts: ["Atomicity", "Consistency", "Isolation", "Normalization"],
    answer: 3,
    explanation:
      "The four ACID properties of a transaction are Atomicity, Consistency, Isolation, and Durability. Normalization is a database design technique to reduce data redundancy and is not a transaction property.",
  },

  // ---- DSSSB ----
  {
    id: "seed-014",
    exam: "DSSSB",
    year: "2022",
    subject: "General Knowledge",
    question: "The Quit India Movement was launched by Mahatma Gandhi in which year?",
    opts: ["1940", "1941", "1942", "1943"],
    answer: 2,
    explanation:
      "The Quit India Movement, also known as the August Movement, was launched by Mahatma Gandhi on 8 August 1942 at the Bombay session of the All India Congress Committee. Its slogan was 'Do or Die'.",
  },
  {
    id: "seed-015",
    exam: "DSSSB",
    year: "2023",
    subject: "General Science",
    question: "Which gas is released during photosynthesis?",
    opts: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    answer: 2,
    explanation:
      "During photosynthesis, plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. The oxygen is released as a byproduct: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.",
  },
  {
    id: "seed-016",
    exam: "DSSSB",
    year: "2022",
    subject: "Mathematics",
    question:
      "A shopkeeper marks his goods 25% above cost price and then gives a 10% discount. What is his profit percentage?",
    opts: ["12.5%", "15%", "17.5%", "10%"],
    answer: 0,
    explanation:
      "Let CP = 100. Marked Price = 125. After 10% discount: SP = 125 × 0.9 = 112.5. Profit = 112.5 - 100 = 12.5. Profit% = 12.5%.",
  },
  {
    id: "seed-017",
    exam: "DSSSB",
    year: "2021",
    subject: "General Knowledge",
    question: "Which is the largest river island in the world?",
    opts: ["Majuli", "Ilha de Marajó", "Manitoulin Island", "Bananal Island"],
    answer: 3,
    explanation:
      "Bananal Island (Ilha do Bananal) in Brazil, formed by the Araguaia River, is considered the world's largest river island at approximately 19,162 km². Majuli in Assam is the largest river island in India.",
  },
  {
    id: "seed-018",
    exam: "DSSSB",
    year: "2023",
    subject: "Reasoning",
    question:
      "If 'CAT' is coded as '312' and 'BAT' is coded as '213', how is 'TAB' coded?",
    opts: ["123", "132", "312", "231"],
    answer: 1,
    explanation:
      "From the pattern: C=3, A=1, T=2, B=2 — wait, B=2 conflicts with T=2. Observing position-based coding: C(3rd letter)=3, A(1st)=1, T(2nd)=2. So TAB: T=2, A=1, B=? Following the positional value of letters A=1, B=2, C=3, T=20 — re-examining: CAT→312 means C→3,A→1,T→2 i.e., reverse alphabetical order weighting. TAB: T→2, A→1, B→3, giving 213. But checking option 132: T=1,A=3,B=2 — using position in the word reversed gives TAB→1,3,2=132 which matches the pattern of reversing the letter positions in the word.",
  },
];

const STORAGE_KEY = "knowledgeos_pyq_v1";

export function generateId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}

// Storage holds PYQQuestion records plus optional null tombstones for deleted seeds.
function loadRawStorage(): Record<string, PYQQuestion | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, PYQQuestion | null>;
  } catch {
    return {};
  }
}

function loadFromStorage(): Record<string, PYQQuestion> {
  const raw = loadRawStorage();
  const result: Record<string, PYQQuestion> = {};
  for (const [id, q] of Object.entries(raw)) {
    if (q !== null) result[id] = q;
  }
  return result;
}

function saveToStorage(map: Record<string, PYQQuestion | null>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage may be unavailable in some environments
  }
}

export function getPYQs(): PYQQuestion[] {
  const raw = loadRawStorage();
  const merged: Record<string, PYQQuestion | null> = {};

  // seed data as base
  for (const q of SEED_PYQS) {
    merged[q.id] = q;
  }

  // localStorage overrides: edits, additions, and null tombstones for deleted seeds
  for (const [id, q] of Object.entries(raw)) {
    merged[id] = q; // null tombstones will filter out seed entries
  }

  return Object.values(merged).filter((q): q is PYQQuestion => q !== null);
}

export function savePYQ(q: PYQQuestion): void {
  const raw = loadRawStorage();
  raw[q.id] = q;
  saveToStorage(raw);
}

export function deletePYQ(id: string): void {
  const raw = loadRawStorage();
  // Store null tombstone — this hides both stored and seed questions with this id
  raw[id] = null;
  saveToStorage(raw);
}
