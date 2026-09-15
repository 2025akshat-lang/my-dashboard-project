export interface LessonActivity {
  id: string;
  phase: "Opening" | "Direct Instruction" | "Guided Practice" | "Independent Practice" | "Closure";
  description: string;
  durationMinutes: number;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  objectives: string[];
  materials: string[];
  activities: LessonActivity[];
  assessment: string;
  standardsRef: string;
  createdAt: string;
}

export interface RubricLevel {
  label: string;
  score: number;
  descriptor: string;
}

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: number;
  levels: RubricLevel[];
}

export interface Rubric {
  id: string;
  title: string;
  subject: string;
  totalPoints: number;
  criteria: RubricCriterion[];
  createdAt: string;
}

// ── Seed Lesson Plans ──────────────────────────────────────────────────────

export const SEED_LESSON_PLANS: LessonPlan[] = [
  {
    id: "seed-lp-1",
    title: "Chemical Reactions & Equations",
    subject: "Chemistry",
    grade: "Grade 9",
    standardsRef: "NGSS HS-PS1-7 / RST.9-10.3",
    createdAt: "2024-01-01T00:00:00.000Z",
    objectives: [
      "Distinguish between physical and chemical changes with observable evidence.",
      "Identify the reactants and products in a chemical equation.",
      "Balance simple chemical equations using the law of conservation of mass.",
      "Classify reactions as synthesis, decomposition, single-replacement, or double-replacement.",
    ],
    materials: [
      "Whiteboard and markers",
      "Safety goggles and lab aprons",
      "Baking soda and vinegar (demonstration)",
      "Printed worksheet: balancing equations practice (30 copies)",
      "Periodic table reference cards",
      "Chromebooks / tablets (1 per student pair) for PhET simulation",
    ],
    activities: [
      {
        id: "lp1-a1",
        phase: "Opening",
        durationMinutes: 8,
        description:
          "Show a short video clip of a dramatic exothermic reaction (e.g., thermite). Ask students: 'What evidence tells you a chemical change occurred?' Collect responses using think-pair-share and record key terms (heat, light, gas, precipitate, colour change) on the board.",
      },
      {
        id: "lp1-a2",
        phase: "Direct Instruction",
        durationMinutes: 15,
        description:
          "Introduce the law of conservation of mass using the atomic model. Demonstrate balancing H₂ + O₂ → H₂O on the board step-by-step, emphasising coefficient vs. subscript. Cover the four main reaction types with one example each, recording in student notes.",
      },
      {
        id: "lp1-a3",
        phase: "Guided Practice",
        durationMinutes: 12,
        description:
          "Live baking soda + vinegar demonstration. Students complete a structured observation sheet recording reactants, products, and evidence of chemical change. Class balances the equation for NaHCO₃ + CH₃COOH together using the whiteboard.",
      },
      {
        id: "lp1-a4",
        phase: "Independent Practice",
        durationMinutes: 15,
        description:
          "Students open the PhET 'Reactants, Products and Leftovers' simulation in pairs to visualise limiting reagents. Then individually complete 6 balancing-equations problems on the worksheet, classifying each reaction type.",
      },
      {
        id: "lp1-a5",
        phase: "Closure",
        durationMinutes: 5,
        description:
          "Exit ticket: students write one balanced equation from memory and state which reaction type it represents. Teacher reviews 3 common misconceptions before dismissal.",
      },
    ],
    assessment:
      "Formative: observation sheet and exit ticket checked during/after class. Summative: unit quiz (next class) covering balancing equations (10 items) and reaction classification (5 items), worth 30 points total.",
  },
  {
    id: "seed-lp-2",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    grade: "Grade 9",
    standardsRef: "NGSS HS-PS2-1 / CCSS.MATH.CONTENT.HSA-CED.A.1",
    createdAt: "2024-01-02T00:00:00.000Z",
    objectives: [
      "State Newton's three laws of motion in student-friendly language.",
      "Apply Newton's second law (F = ma) to solve single-force problems.",
      "Predict the motion of objects using free-body diagrams.",
      "Connect Newton's third law to real-world action-reaction pairs.",
    ],
    materials: [
      "Whiteboard and markers",
      "Safety goggles",
      "Dynamics carts and track (1 set per lab group of 4)",
      "Spring scales (1 per group)",
      "Hanging masses: 100 g, 200 g, 500 g sets",
      "Stopwatches (1 per group)",
      "Graph paper or Chromebooks with Google Sheets",
      "Printed F = ma problem sets",
    ],
    activities: [
      {
        id: "lp2-a1",
        phase: "Opening",
        durationMinutes: 7,
        description:
          "Play a 90-second clip of astronauts in the ISS demonstrating inertia (floating objects). Ask: 'Why do the objects keep moving even with no push?' Students predict using prior knowledge. Bridge to Newton's first law definition.",
      },
      {
        id: "lp2-a2",
        phase: "Direct Instruction",
        durationMinutes: 18,
        description:
          "Present all three laws with formal statements, everyday examples, and mathematical notation. Derive F = ma units (Newtons). Introduce free-body diagram (FBD) conventions: dot for object, labelled arrows for all forces. Solve two worked examples (horizontal push on a box; vertical hanging mass) step-by-step.",
      },
      {
        id: "lp2-a3",
        phase: "Guided Practice",
        durationMinutes: 10,
        description:
          "Teacher projects three FBD scenarios; students draw and label independently then check answers with partner. Class solves F = ma for net force, mass, and acceleration in turn, with teacher cold-calling for each step.",
      },
      {
        id: "lp2-a4",
        phase: "Independent Practice",
        durationMinutes: 15,
        description:
          "Lab activity: students apply measured forces to dynamics carts using spring scales and hanging masses, recording force and resulting acceleration. They calculate experimental mass vs. actual mass and compute % error. Data recorded in Google Sheets and a best-fit line plotted.",
      },
      {
        id: "lp2-a5",
        phase: "Closure",
        durationMinutes: 5,
        description:
          "3-2-1 reflection: 3 things learned, 2 real-world examples of Newton's laws, 1 question they still have. Collected as formative data to guide next lesson.",
      },
    ],
    assessment:
      "Formative: FBD check and 3-2-1 reflection. Summative: lab report (next week) assessing data collection accuracy, graph quality, and error analysis (25 points). Unit test covers all three laws and F = ma calculations (40 points).",
  },
  {
    id: "seed-lp-3",
    title: "Cell Structure & Function",
    subject: "Biology",
    grade: "Grade 9",
    standardsRef: "NGSS HS-LS1-2 / RST.9-10.7",
    createdAt: "2024-01-03T00:00:00.000Z",
    objectives: [
      "Identify and describe the function of at least 8 major cell organelles.",
      "Distinguish between prokaryotic and eukaryotic cells with structural evidence.",
      "Compare and contrast plant and animal cells.",
      "Relate organelle structure to its specific function using the structure-function principle.",
    ],
    materials: [
      "Compound light microscopes (1 per pair)",
      "Prepared slides: onion root tip and human cheek cells",
      "Blank cell diagram worksheets",
      "Coloured pencils",
      "Chromebooks for interactive cell model (CellsAlive.com)",
      "Chart paper and markers for group posters",
      "Textbook: Biology (Miller & Levine), Chapter 7",
    ],
    activities: [
      {
        id: "lp3-a1",
        phase: "Opening",
        durationMinutes: 8,
        description:
          "Analogy warm-up: 'If a cell were a city, what would each part of the city represent?' Students brainstorm in small groups for 3 minutes. Share-out connects city roles (power plant, post office, city hall) to organelle functions, building conceptual scaffolding before formal vocabulary.",
      },
      {
        id: "lp3-a2",
        phase: "Direct Instruction",
        durationMinutes: 15,
        description:
          "Present a labelled diagram of a eukaryotic animal cell via projector, covering nucleus, mitochondria, ER (rough and smooth), Golgi apparatus, ribosomes, lysosomes, cell membrane, and cytoplasm. For each organelle: state name → function → analogy. Then compare to plant cell (add cell wall, chloroplast, large central vacuole) and prokaryote (no membrane-bound organelles).",
      },
      {
        id: "lp3-a3",
        phase: "Guided Practice",
        durationMinutes: 12,
        description:
          "Students view onion root tip and cheek cell slides under microscopes. They sketch and label observable structures, then use CellsAlive interactive model to identify organelles they cannot resolve under light microscopy. Class discusses: why are some organelles invisible at 400×?",
      },
      {
        id: "lp3-a4",
        phase: "Independent Practice",
        durationMinutes: 15,
        description:
          "Group task: each group of 3–4 students receives a 'cell organelle trading card' template and is assigned 2 organelles. They research structure, function, and plant/animal/prokaryote presence, then create a poster-style card. Cards are displayed for a brief gallery walk.",
      },
      {
        id: "lp3-a5",
        phase: "Closure",
        durationMinutes: 5,
        description:
          "Quick-check quiz: teacher reads 5 function clues aloud; students write the organelle name on mini whiteboards. Discuss any misconceptions (common: confusing smooth and rough ER, or ribosome location). Preview next lesson: membrane transport.",
      },
    ],
    assessment:
      "Formative: microscope sketches checked for accuracy; whiteboard quiz tracked per-student. Summative: cell diagram label test (10 organelles, 20 points) and short-answer comparison of plant vs. animal cells (10 points). Organelle trading cards graded with provided rubric (20 points).",
  },
];

// ── Seed Rubrics ───────────────────────────────────────────────────────────

const RUBRIC_LEVELS_LAB: (descriptor4: string, descriptor3: string, descriptor2: string, descriptor1: string) => RubricLevel[] =
  (d4, d3, d2, d1) => [
    { label: "Excellent",   score: 4, descriptor: d4 },
    { label: "Proficient",  score: 3, descriptor: d3 },
    { label: "Developing",  score: 2, descriptor: d2 },
    { label: "Beginning",   score: 1, descriptor: d1 },
  ];

export const SEED_RUBRICS: Rubric[] = [
  {
    id: "seed-rb-1",
    title: "Lab Report Assessment Rubric",
    subject: "Science",
    totalPoints: 100,
    createdAt: "2024-01-01T00:00:00.000Z",
    criteria: [
      {
        id: "rb1-c1",
        criterion: "Introduction",
        weight: 25,
        levels: RUBRIC_LEVELS_LAB(
          "Clearly states the research question, hypothesis with scientific reasoning, and relevant background theory. All key terms defined accurately.",
          "States research question and hypothesis with adequate reasoning. Most background information is accurate and relevant.",
          "Research question or hypothesis is present but vague or lacks scientific reasoning. Background is incomplete.",
          "Introduction is missing the research question or hypothesis. Background information is absent or inaccurate.",
        ),
      },
      {
        id: "rb1-c2",
        criterion: "Methodology",
        weight: 25,
        levels: RUBRIC_LEVELS_LAB(
          "Step-by-step procedure is detailed, reproducible, and logically sequenced. Variables (independent, dependent, controlled) clearly identified. Safety measures noted.",
          "Procedure is mostly clear and reproducible. Variables are identified. Minor gaps in sequencing or safety notes.",
          "Procedure is partially described; some steps are missing or unclear. Variables are not fully identified.",
          "Procedure is too vague to reproduce. Variables are not identified and safety is not addressed.",
        ),
      },
      {
        id: "rb1-c3",
        criterion: "Results",
        weight: 25,
        levels: RUBRIC_LEVELS_LAB(
          "Data is accurately recorded in a well-organised table. Graph is correctly labelled (title, axes, units) and appropriate to the data type. Quantitative observations are specific.",
          "Data table is present and mostly accurate. Graph is labelled but may have minor errors (missing units or title). Observations are generally specific.",
          "Data table or graph is missing or contains significant errors. Observations are qualitative only or imprecise.",
          "No data table or graph provided. Raw data is disorganised or missing entirely.",
        ),
      },
      {
        id: "rb1-c4",
        criterion: "Conclusion",
        weight: 25,
        levels: RUBRIC_LEVELS_LAB(
          "Clearly states whether hypothesis was supported with specific data evidence. Explains results using scientific concepts. Identifies at least two sources of error and proposes improvements.",
          "Hypothesis outcome is addressed with some data reference. Scientific concepts used adequately. One source of error identified.",
          "Conclusion partially addresses the hypothesis without clear data evidence. Limited scientific explanation. Error analysis is superficial.",
          "Conclusion does not reference the hypothesis or data. No scientific explanation or error analysis is provided.",
        ),
      },
    ],
  },
  {
    id: "seed-rb-2",
    title: "Project Presentation Rubric",
    subject: "General",
    totalPoints: 100,
    createdAt: "2024-01-02T00:00:00.000Z",
    criteria: [
      {
        id: "rb2-c1",
        criterion: "Content",
        weight: 30,
        levels: RUBRIC_LEVELS_LAB(
          "Information is accurate, thorough, and well-researched. All key concepts are explained clearly with relevant examples and supporting evidence.",
          "Information is mostly accurate and covers the main concepts. Examples are provided but depth may be inconsistent.",
          "Some information is accurate; key concepts are present but explanations are superficial or partially incorrect.",
          "Information contains significant inaccuracies or is missing major concepts. Little to no supporting evidence.",
        ),
      },
      {
        id: "rb2-c2",
        criterion: "Delivery",
        weight: 30,
        levels: RUBRIC_LEVELS_LAB(
          "Speaks confidently and clearly. Maintains strong eye contact. Appropriate pace and volume throughout. Engages the audience with enthusiasm.",
          "Mostly clear and confident delivery. Good eye contact most of the time. Pace or volume may be occasionally off.",
          "Delivery is hesitant or reads from notes frequently. Limited eye contact. Pace or volume affects clarity at times.",
          "Reads directly from notes/slides with minimal eye contact. Very quiet, rushed, or unclear throughout.",
        ),
      },
      {
        id: "rb2-c3",
        criterion: "Visual Aids",
        weight: 20,
        levels: RUBRIC_LEVELS_LAB(
          "Slides/visuals are professional, visually clear, and directly support the content. Minimal text; graphics and data visualisations are used effectively.",
          "Visuals are mostly clear and relevant. Slides may be text-heavy in places but still aid understanding.",
          "Visuals are present but some are confusing, cluttered, or irrelevant. Limited use of graphics.",
          "Visuals are missing, illegible, or distract from the presentation. Heavy reliance on slide text as a script.",
        ),
      },
      {
        id: "rb2-c4",
        criterion: "Q&A Response",
        weight: 20,
        levels: RUBRIC_LEVELS_LAB(
          "Answers questions accurately and with depth. Acknowledges the limits of their knowledge when appropriate. Responds thoughtfully and professionally.",
          "Answers most questions adequately. Occasionally struggles but generally demonstrates subject knowledge.",
          "Answers are partially correct or vague. Relies on prompting or repetition to address questions.",
          "Unable to answer most questions. Shows limited understanding of the material presented.",
        ),
      },
    ],
  },
];

// ── Storage helpers ────────────────────────────────────────────────────────

const LESSONS_KEY = "knowledgeos_lessons_v1";
const RUBRICS_KEY = "knowledgeos_rubrics_v1";

export function generateId(): string {
  return `stem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Lesson Plans ──────────────────────────────────────────────────────────

export function getLessonPlans(): LessonPlan[] {
  try {
    const raw = localStorage.getItem(LESSONS_KEY);
    if (!raw) return [...SEED_LESSON_PLANS];

    const stored: LessonPlan[] = JSON.parse(raw);
    const storedIds = new Set(stored.map((p) => p.id));
    const merged = [...stored];
    for (const seed of SEED_LESSON_PLANS) {
      if (!storedIds.has(seed.id)) merged.push(seed);
    }
    return merged;
  } catch {
    return [...SEED_LESSON_PLANS];
  }
}

export function saveLessonPlan(plan: LessonPlan): void {
  const all = getLessonPlans();
  const idx = all.findIndex((p) => p.id === plan.id);
  if (idx >= 0) {
    all[idx] = plan;
  } else {
    all.unshift(plan);
  }
  localStorage.setItem(LESSONS_KEY, JSON.stringify(all));
}

export function deleteLessonPlan(id: string): void {
  const all = getLessonPlans().filter((p) => p.id !== id);
  localStorage.setItem(LESSONS_KEY, JSON.stringify(all));
}

// ── Rubrics ───────────────────────────────────────────────────────────────

export function getRubrics(): Rubric[] {
  try {
    const raw = localStorage.getItem(RUBRICS_KEY);
    if (!raw) return [...SEED_RUBRICS];

    const stored: Rubric[] = JSON.parse(raw);
    const storedIds = new Set(stored.map((r) => r.id));
    const merged = [...stored];
    for (const seed of SEED_RUBRICS) {
      if (!storedIds.has(seed.id)) merged.push(seed);
    }
    return merged;
  } catch {
    return [...SEED_RUBRICS];
  }
}

export function saveRubric(rubric: Rubric): void {
  const all = getRubrics();
  const idx = all.findIndex((r) => r.id === rubric.id);
  if (idx >= 0) {
    all[idx] = rubric;
  } else {
    all.unshift(rubric);
  }
  localStorage.setItem(RUBRICS_KEY, JSON.stringify(all));
}

export function deleteRubric(id: string): void {
  const all = getRubrics().filter((r) => r.id !== id);
  localStorage.setItem(RUBRICS_KEY, JSON.stringify(all));
}
