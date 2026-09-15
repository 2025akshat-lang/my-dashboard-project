import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import DashboardPage, { NavBar } from "./DashboardPage";
import DashboardHome from "./DashboardHome";
import SourcesPage from "./SourcesPage";
import SimulationsPage from "./SimulationsPage";
import SimulationsSection from "./sections/SimulationsSection";
import MockTestSection from "./sections/MockTestSection";
import PracticalsSection from "./sections/PracticalsSection";
import ArtCraftSection from "./sections/ArtCraftSection";
import StudyMaterialsSection from "./sections/StudyMaterialsSection";
import FutureProjectsSection from "./sections/FutureProjectsSection";
import AdminPanel from "./sections/AdminPanel";
import PdfReaderSection from "./sections/PdfReaderSection";
import PlaygroundSection from "./sections/PlaygroundSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import ChemToolkitSection from "./sections/ChemToolkitSection";
import GovtExamSection from "./sections/GovtExamSection";
import CodeSnippetSection from "./sections/CodeSnippetSection";
import StemClassroomSection from "./sections/StemClassroomSection";
import { COLLECTIONS, SIMULATIONS, GITHUB_SIMULATIONS_BASE, PERSONAL_CREDENTIALS } from "./config";
import { findUser } from "./config/users";

// ─── Collection Detail ────────────────────────────────────────────────────────

function CollectionDetail({ collectionId, onNavigate }: { collectionId: string; onNavigate: (p: string) => void }) {
  const card = COLLECTIONS.find((c) => c.id === collectionId);
  if (!card) return null;

  const sampleTitles: Record<string, string[]> = {
    notes: ["Electromagnetic Induction — Ch. 12", "Atomic Structure — Bohr's Model", "Organic Chemistry — Functional Groups", "Newton's Laws of Motion", "Thermodynamics — Laws & Applications"],
    lab: ["Ester Synthesis Lab Report", "Titration Practical — Acid-Base", "Microscopy Observations", "Electrochemistry Cell Setup", "Chromatography Results"],
    practicals: ["Distillation Step-by-Step Guide", "Crystallization Procedure", "Filtration Technique Manual", "pH Testing Protocol", "Sublimation Observation Sheet"],
    teaching: ["Class 9 Chemistry Syllabus", "Lesson Plan — Sep 2025", "Revision Handout — Metals", "Worksheet: Periodic Table", "Slide Deck — Water Cycle"],
    projects: ["AI Tutor App — Proposal", "Virtual Lab v2 Roadmap", "3D Molecule Viewer Concept", "Adaptive Quiz Engine Draft", "Gamified Learning Platform"],
    mock: ["Chemistry Mock Paper I", "Physics Mock Paper III", "Biology Mid-Term Paper", "Full Syllabus Mock — 2025", "Chapter Test — Organic"],
    quiz: ["Periodic Table MCQ Bank", "Bonding Quick Quiz", "Speed Quiz — Chemical Equations", "Formative: Carbon Compounds", "Chapter 5 Knowledge Check"],
    assessment: ["Auto-Graded Assignment 1", "Rubric: Lab Report Assessment", "Adaptive Chemistry Quiz", "Class Performance Report", "Weakness Identifier Test"],
    animation: ["Electron Orbital Animation", "Water Cycle Motion Graphic", "Mitosis Explainer Video", "Acid-Base Reaction Visual", "Periodic Trends Animation"],
    simulation: ["Virtual Chemistry Lab", "Newton's Cradle Sim", "Ohm's Law Interactive", "DNA Replication Sim", "Gas Laws Simulator"],
  };

  const items = sampleTitles[collectionId] || [];

  return (
    <div style={{ background: "#000", minHeight: "100vh", paddingTop: 56 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 100px" }}>
        <button onClick={() => onNavigate("home")} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#374151", background: "none", border: "none", cursor: "pointer", marginBottom: 36, display: "flex", alignItems: "center", gap: 8 }}>
          ← Back to Home
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 44, flexWrap: "wrap" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${card.accent}15`, border: `1px solid ${card.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: card.accent }}>
            {card.icon}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: card.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{card.tag}</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1 }}>{card.label}</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#6b7280", margin: 0 }}>{card.description}</p>
          </div>
        </div>

        {/* Items grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10, marginBottom: 20 }}>
          {items.map((title, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${card.accent}0a`; el.style.borderColor = `${card.accent}30`; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = "rgba(255,255,255,0.07)"; }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#d1d5db", flex: 1 }}>{title}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151" }}>Open →</span>
            </div>
          ))}
          <button onClick={() => onNavigate("sources")}
            style={{ background: `${card.accent}07`, border: `1px dashed ${card.accent}28`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", border: `1px solid ${card.accent}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: card.accent }}>+ Add new item to {card.label}</span>
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
          {[{ l: "Total Items", v: card.count.toString() }, { l: "Last Added", v: "Today" }, { l: "Collection", v: card.tag }].map((s) => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "28px 24px", maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#818cf8,#22d3ee)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Fraunces',serif" }}>K</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#1f2937" }}>KnowledgeOS · Personal · Under Development</span>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {["Notes","Simulations","Sources","Submit"].map((l) => (
          <span key={l} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#1f2937" }}>{l}</span>
        ))}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#111827" }}>v1.0.0-dev · 2025</span>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

const SESSION_KEY = "knowledgeos_session";
const SESSION_ROLE_KEY = "knowledgeos_role";

export default function App() {
  const [userName, setUserName] = useState<string | null>(() => {
    try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
  });
  const [userRole, setUserRole] = useState<"admin" | "viewer">(() => {
    try { return (localStorage.getItem(SESSION_ROLE_KEY) as "admin" | "viewer") || "viewer"; } catch { return "viewer"; }
  });
  const [page, setPage] = useState("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = (name: string, role: "admin" | "viewer" = "admin") => {
    try { localStorage.setItem(SESSION_KEY, name); localStorage.setItem(SESSION_ROLE_KEY, role); } catch { /* no-op */ }
    setUserName(name);
    setUserRole(role);
    setPage("home");
  };

  const handleLogout = () => {
    try { localStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_ROLE_KEY); } catch { /* no-op */ }
    setUserName(null);
    setUserRole("viewer");
    setPage("home");
  };

  const handleNavigate = (p: string) => {
    // Viewers cannot access admin panel
    if (p === "admin" && userRole !== "admin") return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  if (!userName) {
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  const isAdmin = userRole === "admin";
  const isCollectionPage = page.startsWith("collection:");
  const collectionId = isCollectionPage ? page.split(":")[1] : null;

  return (
    <>
      <GlobalStyles />
      <div style={{ background: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
        <NavBar
          userName={userName}
          onNavigate={handleNavigate}
          currentPage={page}
          onLogout={handleLogout}
        />

        {page === "home" && (
          <DashboardHome userName={userName} onNavigate={handleNavigate} isAdmin={isAdmin} />
        )}

        {page === "simulations" && (
          <SimulationsSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "mocktest" && (
          <MockTestSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "practicals" && (
          <PracticalsSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "artcraft" && (
          <ArtCraftSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "studymaterials" && (
          <StudyMaterialsSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "futureprojects" && (
          <FutureProjectsSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "pdfreader" && (
          <PdfReaderSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "playground" && (
          <PlaygroundSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "analytics" && (
          <AnalyticsSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "chemtoolkit" && (
          <ChemToolkitSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "govtexam" && (
          <GovtExamSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "codesnippet" && (
          <CodeSnippetSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "stemclassroom" && (
          <StemClassroomSection onBack={() => handleNavigate("home")} isAdmin={isAdmin} />
        )}

        {page === "admin" && isAdmin && (
          <AdminPanel onBack={() => handleNavigate("home")} />
        )}

        {page === "sources" && (
          <>
            <SourcesPage onNavigate={handleNavigate} />
            <Footer />
          </>
        )}

        {page === "upload" && (
          <>
            <SourcesPage onNavigate={handleNavigate} />
            <Footer />
          </>
        )}

        {isCollectionPage && collectionId && (
          <>
            <CollectionDetail collectionId={collectionId} onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}

// ─── Global styles ────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400;1,9..144,800;1,9..144,900&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #0a081e; color: #fff; -webkit-font-smoothing: antialiased; }
      button { cursor: pointer; }
      a { text-decoration: none; }

      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 2px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.45); }

      /* ── Keyframes ── */
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulseDot { 0%,100%{opacity:1;box-shadow:0 0 8px #8b5cf6} 50%{opacity:.4;box-shadow:0 0 4px #8b5cf6} }
      @keyframes particleFloat {
        0%,100%{transform:translateY(0) translateX(0)}
        33%{transform:translateY(-18px) translateX(8px)}
        66%{transform:translateY(8px) translateX(-10px)}
      }
      @keyframes blobDrift {
        0%,100%{transform:translate(0,0) scale(1)}
        33%{transform:translate(30px,-20px) scale(1.05)}
        66%{transform:translate(-20px,15px) scale(0.97)}
      }
      @keyframes fadeSlideUp {
        from{opacity:0;transform:translateY(24px)}
        to{opacity:1;transform:translateY(0)}
      }
      @keyframes cardEntrance {
        from{opacity:0;transform:translateY(20px)}
        to{opacity:1;transform:translateY(0)}
      }
      @keyframes scrollPulse {
        0%,100%{opacity:.3;transform:scaleY(0.8)}
        50%{opacity:1;transform:scaleY(1)}
      }
      @keyframes shimmer {
        0%{background-position:-200% 0}
        100%{background-position:200% 0}
      }

      @media (max-width: 768px) {
        .responsive-grid { grid-template-columns: 1fr !important; }
        .desktop-nav { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
      }
      @media (min-width: 769px) {
        .mobile-menu-btn { display: none !important; }
      }
      @media (max-width: 480px) {
        .hide-mobile { display: none !important; }
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-text-fill-color: #f9fafb;
        -webkit-box-shadow: 0 0 0 1000px rgba(10,8,30,0.95) inset;
        transition: background-color 5000s ease-in-out 0s;
      }

      ::selection { background: rgba(139,92,246,0.35); color: #f9fafb; }
    `}</style>
  );
}
