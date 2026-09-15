// ─── Auth Configuration ───────────────────────────────────────────────────────
// To add a new auth provider: add an entry to AUTH_PROVIDERS with enabled: true
// and implement its handler in LoginPage.tsx

export interface AuthProvider {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  comingSoon?: boolean;
  description?: string;
}

export const AUTH_PROVIDERS: AuthProvider[] = [
  {
    id: "credentials",
    label: "Email & Password",
    icon: "✦",
    enabled: true,
    description: "Sign in with your personal credentials",
  },
  {
    id: "github",
    label: "Continue with GitHub",
    icon: "⌥",
    enabled: false,
    comingSoon: true,
    description: "OAuth via GitHub — wire GITHUB_CLIENT_ID to enable",
  },
  {
    id: "google",
    label: "Continue with Google",
    icon: "◉",
    enabled: false,
    comingSoon: true,
    description: "OAuth via Google — wire GOOGLE_CLIENT_ID to enable",
  },
  {
    id: "access-code",
    label: "Access Code",
    icon: "◈",
    enabled: false,
    comingSoon: true,
    description: "Share a code with friends for gated access",
  },
  {
    id: "magic-link",
    label: "Magic Link",
    icon: "⟁",
    enabled: false,
    comingSoon: true,
    description: "Passwordless email link — wire SMTP to enable",
  },
];

// ─── Credentials (change here for personal use) ───────────────────────────────
// For production: replace with a real auth backend
export const PERSONAL_CREDENTIALS = {
  email: "akshat@knowledgeos.dev",
  password: "akshat2025",
  name: "Akshat",
  role: "Owner",
};

// ─── Collections ──────────────────────────────────────────────────────────────
export interface Collection {
  id: string;
  label: string;
  description: string;
  count: number;
  icon: string;
  accent: string;
  tag: string;
  route: string;
}

export const COLLECTIONS: Collection[] = [
  { id: "notes", label: "Notes", description: "Lecture notes, research summaries, concept maps and written references", count: 142, icon: "✦", accent: "#60a5fa", tag: "Knowledge", route: "notes" },
  { id: "lab", label: "Lab Work", description: "Experimental data, lab reports, observations and scientific findings", count: 38, icon: "⬡", accent: "#34d399", tag: "Experiments", route: "lab" },
  { id: "practicals", label: "Practicals", description: "Hands-on exercises, step-by-step guides and practical demonstrations", count: 57, icon: "◈", accent: "#a78bfa", tag: "Applied", route: "practicals" },
  { id: "teaching", label: "Teaching Materials", description: "Slides, lesson plans, syllabi, handouts and classroom resources", count: 89, icon: "⊞", accent: "#fb923c", tag: "Education", route: "teaching" },
  { id: "projects", label: "Future Projects", description: "Research proposals, roadmaps, ideation boards and upcoming work", count: 24, icon: "◉", accent: "#f472b6", tag: "Pipeline", route: "projects" },
  { id: "mock", label: "Mock Tests", description: "Practice papers, past exams, timed assessments and answer keys", count: 63, icon: "◧", accent: "#facc15", tag: "Practice", route: "mock" },
  { id: "quiz", label: "Quizzes", description: "Short-form knowledge checks, MCQ banks and formative assessments", count: 111, icon: "⊕", accent: "#22d3ee", tag: "Assessment", route: "quiz" },
  { id: "assessment", label: "Auto Assessment", description: "AI-graded assignments, rubric-based scoring and adaptive tests", count: 19, icon: "⟁", accent: "#818cf8", tag: "AI-Powered", route: "assessment" },
  { id: "animation", label: "Animations", description: "Visual explainers, motion graphics and concept animations", count: 47, icon: "▷", accent: "#f87171", tag: "Visual", route: "animation" },
  { id: "simulation", label: "Simulations", description: "Interactive models, virtual labs, physics and chemistry simulators", count: 31, icon: "⌬", accent: "#4ade80", tag: "Interactive", route: "simulation" },
];

// ─── Simulations from GitHub ──────────────────────────────────────────────────
export const SIMULATIONS = [
  { id: "hub", label: "Simulations Hub", file: "hub.html", category: "Navigation", accent: "#818cf8" },
  { id: "chemistry", label: "Chemistry", file: "Chemistry.html", category: "Chemistry", accent: "#34d399" },
  { id: "biochemistry", label: "Biochemistry", file: "Biochemistry.html", category: "Biology", accent: "#4ade80" },
  { id: "chromatography", label: "Chromatography", file: "Chromatography.html", category: "Practical", accent: "#60a5fa" },
  { id: "distillation", label: "Distillation Setup", file: "Distillation_setup.html", category: "Practical", accent: "#22d3ee" },
  { id: "evaporation", label: "Evaporation vs Boiling", file: "Evaporation_Vs_boiling.html", category: "Physics", accent: "#fb923c" },
  { id: "sublimation", label: "Sublimation", file: "Sublimation.html", category: "Chemistry", accent: "#a78bfa" },
  { id: "crystallization", label: "Crystallization", file: "crystallization.html", category: "Practical", accent: "#f472b6" },
  { id: "vacuum", label: "Vacuum Evaporation", file: "vaccum_evaporation.html", category: "Physics", accent: "#facc15" },
  { id: "mixture", label: "Mixtures", file: "Mixture.html", category: "Chemistry", accent: "#34d399" },
  { id: "watercycle", label: "Water Cycle", file: "Water_cycle.html", category: "Geography", accent: "#60a5fa" },
  { id: "butterfly", label: "Butterfly Life Cycle", file: "Butterfly_debugged_preserve_all.html", category: "Biology", accent: "#f472b6" },
  { id: "mindmap", label: "Mindmap: Solutions", file: "Mindmapsolution.html", category: "Visual", accent: "#818cf8" },
  { id: "labvisit", label: "Virtual Lab Visit", file: "Lab_visit.html", category: "Lab", accent: "#4ade80" },
  { id: "gallery", label: "Gallery", file: "Gallery.html", category: "Visual", accent: "#fb923c" },
  { id: "mockt", label: "Mock Test", file: "axat_mock.html", category: "Assessment", accent: "#facc15" },
  { id: "instrumental", label: "Instrumental Methods", file: "instrumental.html", category: "Chemistry", accent: "#22d3ee" },
  { id: "artcraft", label: "Art & Craft", file: "Art and craft.html", category: "Creative", accent: "#f87171" },
];

export const GITHUB_SIMULATIONS_BASE = "https://2025akshat-lang.github.io/Akshat";
export const GITHUB_UI_REPO = "https://2025akshat-lang.github.io/ui-design-ideas-akshat/";

// ─── Source integrations ──────────────────────────────────────────────────────
export const SOURCES = [
  {
    id: "github-sim",
    label: "GitHub · Simulations",
    description: "Chemistry, Biology, Physics simulations & practicals",
    url: "https://github.com/2025akshat-lang/Akshat",
    previewUrl: GITHUB_SIMULATIONS_BASE,
    icon: "⌥",
    accent: "#4ade80",
    count: 18,
    type: "github",
  },
  {
    id: "github-ui",
    label: "GitHub · UI Designs",
    description: "BRAIN Hacker login UI & interface experiments",
    url: "https://github.com/2025akshat-lang/ui-design-ideas-akshat",
    previewUrl: GITHUB_UI_REPO,
    icon: "◉",
    accent: "#818cf8",
    count: 1,
    type: "github",
  },
  {
    id: "drive",
    label: "Google Drive",
    description: "Connect your Drive to import documents and assets",
    url: "",
    previewUrl: "",
    icon: "▷",
    accent: "#facc15",
    count: 0,
    type: "drive",
    comingSoon: true,
  },
  {
    id: "local",
    label: "Local Storage",
    description: "Upload files directly from your device",
    url: "",
    previewUrl: "",
    icon: "◼",
    accent: "#60a5fa",
    count: 0,
    type: "local",
  },
  {
    id: "onedrive",
    label: "OneDrive",
    description: "Import from Microsoft OneDrive",
    url: "",
    previewUrl: "",
    icon: "⊞",
    accent: "#22d3ee",
    count: 0,
    type: "onedrive",
    comingSoon: true,
  },
  {
    id: "notion",
    label: "Notion",
    description: "Sync notes and databases from Notion",
    url: "",
    previewUrl: "",
    icon: "✦",
    accent: "#f472b6",
    count: 0,
    type: "notion",
    comingSoon: true,
  },
];
