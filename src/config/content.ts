// ═══════════════════════════════════════════════════════════════════
//  KNOWLEDGE OS — MASTER CONTENT CONFIGURATION
//  ─────────────────────────────────────────────────────────────────
//  This is the single source of truth for all dashboard content.
//  Edit here to add, remove, or reorder content across the site.
//  No other file needs to change for most content updates.
//
//  HOW TO ADD CONTENT:
//  • New simulation  → add entry to SIMULATIONS array below
//  • New practical   → add entry to PRACTICALS array below
//  • New dashboard section → add to DASHBOARD_CONTAINERS + create
//    a section component in src/sections/ + add a route in App.tsx
// ═══════════════════════════════════════════════════════════════════

export const GITHUB_BASE = "https://2025akshat-lang.github.io/Akshat";

// ─── Simulation ───────────────────────────────────────────────────
// Add a new simulation by copying one block and editing the fields.
// 'file' is the HTML filename in the GitHub repo (case-sensitive).
// 'category' is used for the filter tabs in the Simulations section.

export interface SimItem {
  id: string;
  title: string;
  file: string;
  category: string;
  subtitle: string;
}

export const SIMULATIONS: SimItem[] = [
  {
    id: "watercycle",
    title: "Water Cycle Model",
    file: "Water_cycle.html",
    category: "Physics",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "evaporation",
    title: "Evaporation vs Boiling",
    file: "Evaporation_Vs_boiling.html",
    category: "Chemistry",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "distillation",
    title: "Distillation Setup",
    file: "Distillation_setup.html",
    category: "Chemistry",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "crystallization",
    title: "Crystallization Process",
    file: "crystallization.html",
    category: "Chemistry",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "vacuum",
    title: "Vacuum Evaporation",
    file: "vaccum_evaporation.html",
    category: "Physics",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "mixture",
    title: "Mixture Analysis",
    file: "Mixture.html",
    category: "Chemistry",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "chromatography",
    title: "Paper Chromatography",
    file: "Chromatography.html",
    category: "Chemistry",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "sublimation",
    title: "Sublimation",
    file: "Sublimation.html",
    category: "Chemistry",
    subtitle: "Class 9th Science Model",
  },
  {
    id: "mindmap",
    title: "Mind Map: Solutions",
    file: "Mindmapsolution.html",
    category: "Visual",
    subtitle: "Class 9th Science Model",
  },
  // ── Add more simulations below this line ──────────────────────────
];

// ─── Practicals ───────────────────────────────────────────────────
// Add a new practical by copying one block.
// 'accent' is the card highlight color (hex).

export interface PracticalItem {
  id: string;
  label: string;   // shown as "3.a · Chemistry"
  title: string;
  file: string;
  accent: string;
  desc: string;
  tags: string[];
  icon: string;
}

export const PRACTICALS: PracticalItem[] = [
  {
    id: "butterfly",
    label: "3.a · Chemistry",
    title: "Butterfly Life Cycle",
    file: "Butterfly_debugged_preserve_all.html",
    accent: "#10b981",
    desc: "Interactive animated practical exploring the life cycle of a butterfly — biological transformations and chemical processes involved in metamorphosis.",
    tags: ["Biology", "Chemistry", "Animation", "Life Cycle"],
    icon: "🦋",
  },
  {
    id: "physics",
    label: "3.b · Physics",
    title: "Physics Interactive Lab",
    file: "Fullwa.html",
    accent: "#06b6d4",
    desc: "Comprehensive physics practical simulation covering mechanics, energy, and wave phenomena with interactive demonstrations.",
    tags: ["Physics", "Mechanics", "Energy", "Waves"],
    icon: "⚡",
  },
  {
    id: "biochemistry",
    label: "3.c · Biochemistry",
    title: "Biochemistry Fundamentals",
    file: "Biochemistry.html",
    accent: "#a78bfa",
    desc: "Explores biochemical reactions, molecular structures, enzyme activity and metabolic pathways with visual interactive models.",
    tags: ["Biochemistry", "Molecules", "Enzymes", "Metabolism"],
    icon: "🧬",
  },
  {
    id: "instrumentation",
    label: "3.d · Instrumentation",
    title: "Instrumental Methods",
    file: "instrumental.html",
    accent: "#f59e0b",
    desc: "Covers instrumental methods of analysis including chromatography, spectroscopy, and electroanalytical techniques used in modern chemistry labs.",
    tags: ["Instrumentation", "Spectroscopy", "Chromatography", "Analysis"],
    icon: "🔬",
  },
  {
    id: "chemistry",
    label: "3.e · Chemistry Overview",
    title: "Chemistry Interactive",
    file: "Chemistry.html",
    accent: "#f97316",
    desc: "General chemistry interactive overview — covers core reactions, element properties, and chemical principles in an animated format.",
    tags: ["Chemistry", "Overview", "Interactive", "Reactions"],
    icon: "⚗️",
  },
  {
    id: "labvisit",
    label: "3.f · Virtual Lab Visit",
    title: "Virtual Lab Tour",
    file: "Lab_visit.html",
    accent: "#ec4899",
    desc: "A guided virtual tour of a science laboratory — equipment overview, safety protocols, and experimental setups for Class 9th students.",
    tags: ["Lab", "Virtual Tour", "General Science", "Equipment"],
    icon: "🏫",
  },
  // ── Add more practicals below this line ───────────────────────────
];

// ─── Dashboard Containers ─────────────────────────────────────────
// Each entry creates one card on the main dashboard home page.
// 'id' must match the routing key used in App.tsx.
// Set 'enabled: false' to hide a section without deleting it.

export interface DashboardContainer {
  id: string;
  label: string;
  desc: string;
  icon: string;
  accent: string;
  countLabel: string;   // e.g. "9 simulations"
  sub: string[];        // preview chips shown on the card
  enabled: boolean;
}

export const DASHBOARD_CONTAINERS: DashboardContainer[] = [
  {
    id: "simulations",
    label: "Simulations & Animations",
    desc: "Interactive science models — Water Cycle, Distillation, Crystallization, Chromatography and more",
    icon: "⌬",
    accent: "#06b6d4",
    countLabel: `${SIMULATIONS.length} simulations`,
    sub: SIMULATIONS.slice(0, 4).map(s => s.title).concat([`+${SIMULATIONS.length - 4} more`]),
    enabled: true,
  },
  {
    id: "mocktest",
    label: "Mock Test & Assessment",
    desc: "CBT mock papers, topic-wise quiz with auto-grading and performance tracking",
    icon: "◧",
    accent: "#3b82f6",
    countLabel: "3 sub-sections",
    sub: ["2.a Mock Tests (K-12, JMI, DRDO)", "2.b Quiz (Topic Selector)", "2.c Auto Assessment"],
    enabled: true,
  },
  {
    id: "practicals",
    label: "Practicals",
    desc: "Hands-on animated practicals — Chemistry, Physics, Biochemistry, Instrumentation, Lab Visit",
    icon: "⬡",
    accent: "#10b981",
    countLabel: `${PRACTICALS.length} practicals`,
    sub: PRACTICALS.slice(0, 4).map(p => p.title).concat([`+${PRACTICALS.length - 4} more`]),
    enabled: true,
  },
  {
    id: "artcraft",
    label: "Art & Craft",
    desc: "Creative activities, visual art projects and hands-on craft work",
    icon: "◈",
    accent: "#f472b6",
    countLabel: "1 module",
    sub: ["Art and Craft Interactive"],
    enabled: true,
  },
  {
    id: "studymaterials",
    label: "Study Materials",
    desc: "Upload and organise notes in any format — PDF, PPT, text, YouTube transcripts",
    icon: "✦",
    accent: "#f59e0b",
    countLabel: "Upload & store",
    sub: ["Upload Notes (any format)", "Browse Stored Notes", "YouTube Transcripts"],
    enabled: true,
  },
  {
    id: "futureprojects",
    label: "Future Projects",
    desc: "Research proposals, concept boards, roadmaps and upcoming builds",
    icon: "◉",
    accent: "#8b5cf6",
    countLabel: "Ideas board",
    sub: ["AI Tutor App", "Virtual Lab v2", "Adaptive Quiz Engine", "+ Add idea"],
    enabled: true,
  },
  {
    id: "pdfreader",
    label: "PDF & Notes Reader",
    desc: "Library of PDF documents, HTML pages, and text notes with Day / Night / Sepia reading modes and bookmarks",
    icon: "📖",
    accent: "#8b5cf6",
    countLabel: "Documents",
    sub: ["PDF via URL", "HTML pages", "Text notes", "Bookmarks", "Day/Night/Sepia"],
    enabled: true,
  },
  {
    id: "playground",
    label: "Code & Science Lab",
    desc: "Sandboxed HTML/JS live editor, chemical equation balancer with step-by-step working, and LaTeX formula renderer",
    icon: "⚗",
    accent: "#10b981",
    countLabel: "3 tools",
    sub: ["HTML/JS Editor", "Chemistry Balancer", "LaTeX Renderer", "Saved Templates"],
    enabled: true,
  },
  {
    id: "analytics",
    label: "Learning Analytics",
    desc: "Visual score trends, subject performance breakdown, activity heatmap, and study session tracker",
    icon: "📊",
    accent: "#3b82f6",
    countLabel: "Progress tracker",
    sub: ["Score history", "Subject breakdown", "Activity heatmap", "Study log"],
    enabled: true,
  },
  {
    id: "chemtoolkit",
    label: "Chemistry Toolkit",
    desc: "Interactive periodic table, molar mass calculator, 3D molecular viewer, and ionic solubility matrix",
    icon: "⚛",
    accent: "#10b981",
    countLabel: "4 tools",
    sub: ["Periodic Table (118 elements)", "Molar Mass Calculator", "3D Molecular Viewer", "Solubility Matrix"],
    enabled: true,
  },
  {
    id: "govtexam",
    label: "Govt Exam Prep",
    desc: "Timed SSC/UPSC/GATE/DSSSB exam simulator with negative marking engine and PYQ flashcard vault",
    icon: "🏛",
    accent: "#f59e0b",
    countLabel: "Exam simulator",
    sub: ["SSC CGL", "UPSC CSAT", "GATE", "DSSSB", "PYQ Flashcards", "Negative Marking"],
    enabled: true,
  },
  {
    id: "codesnippet",
    label: "Code Snippet Vault",
    desc: "Multi-language code repository with syntax display, clipboard export, and live Markdown renderer",
    icon: "⌨",
    accent: "#3b82f6",
    countLabel: "Code library",
    sub: ["Python", "JavaScript", "TypeScript", "HTML/SQL/Bash", "Markdown Renderer"],
    enabled: true,
  },
  {
    id: "stemclassroom",
    label: "STEM Classroom Studio",
    desc: "Lesson plan builder with phase-structured activities and a weighted rubric generator with text export",
    icon: "📐",
    accent: "#f97316",
    countLabel: "Teaching tools",
    sub: ["Lesson Plans", "Rubric Builder", "Weighted Scoring", "Export as Text"],
    enabled: true,
  },
  // ── Add more containers below this line ───────────────────────────
  // Template:
  // {
  //   id: "your-section-id",
  //   label: "Section Name",
  //   desc: "Brief description shown on the card",
  //   icon: "emoji or symbol",
  //   accent: "#hexcolor",
  //   countLabel: "x items",
  //   sub: ["Sub item 1", "Sub item 2"],
  //   enabled: true,
  // },
];
