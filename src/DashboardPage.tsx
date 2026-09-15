import { useState, useEffect, useRef } from "react";
import { COLLECTIONS, SIMULATIONS, GITHUB_SIMULATIONS_BASE } from "./config";

type Page = "home" | "sources" | "simulations" | "upload" | string;

interface Props {
  userName: string;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  onLogout: () => void;
}

// ─── Animated particle background ────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.05,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 6,
    hue: [240, 270, 210, 180, 300][Math.floor(Math.random() * 5)],
  }));

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: `hsl(${p.hue},80%,70%)`,
          opacity: p.opacity,
          animation: `particleFloat ${p.duration}s ease-in-out infinite`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Navbar (light / white theme) ────────────────────────────────────────────
export function NavBar({ userName, onNavigate, currentPage, onLogout }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { id: "home", label: "Dashboard" },
    { id: "simulations", label: "Simulations" },
    { id: "practicals", label: "Practicals" },
    { id: "studymaterials", label: "Notes" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "#ffffff",
      boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "0 1px 0 #e2e8f0",
      transition: "box-shadow 0.25s",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>K</div>
          <span style={{ color: "#0f172a", fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.01em" }}>KnowledgeOS</span>
        </button>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {navLinks.map((l) => (
            <button key={l.id} onClick={() => onNavigate(l.id)}
              style={{ background: currentPage === l.id ? "#f1f5f9" : "none", border: "none", cursor: "pointer", color: currentPage === l.id ? "#8b5cf6" : "#64748b", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: currentPage === l.id ? 700 : 500, padding: "8px 14px", borderRadius: 8, transition: "all 0.15s" }}
              onMouseEnter={e => { if (currentPage !== l.id) (e.currentTarget as HTMLElement).style.color = "#0f172a"; }}
              onMouseLeave={e => { if (currentPage !== l.id) (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: "#0f172a", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{userName}</span>
          </div>
          <button onClick={onLogout} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "6px 12px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8b5cf6"; el.style.color = "#8b5cf6"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#e2e8f0"; el.style.color = "#64748b"; }}>
            Sign out
          </button>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="mobile-menu-btn" style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, color: "#64748b", fontSize: 18, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>
            {menuOpen ? "✕" : "≡"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid #f1f5f9", background: "#fff", padding: "8px 16px 16px" }}>
          {navLinks.map((l) => (
            <button key={l.id} onClick={() => { onNavigate(l.id); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", background: currentPage === l.id ? "#f5f3ff" : "none", border: "none", color: currentPage === l.id ? "#8b5cf6" : "#334155", fontSize: 15, fontFamily: "'Outfit',sans-serif", padding: "12px 10px", textAlign: "left", cursor: "pointer", borderRadius: 8, fontWeight: currentPage === l.id ? 700 : 400 }}>
              {l.label}
            </button>
          ))}
          <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 8, paddingTop: 8 }}>
            <button onClick={() => { onLogout(); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", background: "none", border: "none", color: "#dc2626", fontSize: 14, fontFamily: "'Outfit',sans-serif", padding: "10px", textAlign: "left", cursor: "pointer", borderRadius: 8 }}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(target / 50);
      const t = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(t);
      }, 20);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ userName, onNavigate }: { userName: string; onNavigate: (p: Page) => void }) {
  const totalItems = COLLECTIONS.reduce((s, c) => s + c.count, 0);
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "100px 24px 60px", position: "relative", overflow: "hidden" }}>
      {/* Ambient blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "10%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 60%)", filter: "blur(80px)", animation: "blobDrift 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "5%", width: "55vw", height: "55vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 60%)", filter: "blur(80px)", animation: "blobDrift 16s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", top: "40%", left: "-5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 60%)", filter: "blur(60px)", animation: "blobDrift 9s ease-in-out infinite 3s" }} />
        <div style={{ position: "absolute", top: "20%", right: "20%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 60%)", filter: "blur(60px)" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        {/* Radial vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,transparent 30%,rgba(10,8,30,0.6) 100%)" }} />
      </div>

      {/* Badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#a78bfa", letterSpacing: "0.06em", animation: "fadeSlideUp 0.7s ease both" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8b5cf6", display: "inline-block", boxShadow: "0 0 8px #8b5cf6", animation: "pulseDot 2s infinite" }} />
        Welcome back, {userName} — Your Knowledge OS is ready
      </div>

      {/* Headline */}
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(44px,9vw,96px)", fontWeight: 900, lineHeight: 0.92, color: "#f8f8ff", marginBottom: 24, maxWidth: 1000, letterSpacing: "-0.03em", animation: "fadeSlideUp 0.7s ease 0.1s both" }}>
        Everything you<br />
        <span style={{ background: "linear-gradient(135deg,#8b5cf6 0%,#a78bfa 25%,#06b6d4 55%,#10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 30px rgba(139,92,246,0.4))" }}>
          know, create
        </span>
        <br />and simulate.
      </h1>

      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(15px,2vw,19px)", color: "#94a3b8", maxWidth: 560, lineHeight: 1.75, marginBottom: 44, animation: "fadeSlideUp 0.7s ease 0.2s both" }}>
        Your personal hub for notes, lab practicals, simulations, teaching materials,
        mock tests, quizzes, animations and future projects — connected from GitHub, Drive, and anywhere.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 72, animation: "fadeSlideUp 0.7s ease 0.3s both" }}>
        <button onClick={() => onNavigate("simulations")}
          style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, padding: "15px 32px", borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.01em", boxShadow: "0 8px 32px rgba(139,92,246,0.4)", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(139,92,246,0.55)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(139,92,246,0.4)"; }}>
          Open Simulations →
        </button>
        <button onClick={() => document.getElementById("collections-section")?.scrollIntoView({ behavior: "smooth" })}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", fontSize: 14, fontWeight: 500, padding: "15px 32px", borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
          Browse Collections
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: "1px solid rgba(139,92,246,0.15)", borderRadius: 16, background: "rgba(139,92,246,0.05)", backdropFilter: "blur(20px)", overflow: "hidden", maxWidth: 680, width: "100%", animation: "fadeSlideUp 0.7s ease 0.4s both" }}>
        {[{ v: totalItems, l: "Total items" }, { v: COLLECTIONS.length, l: "Collections" }, { v: SIMULATIONS.length, l: "Simulations" }, { v: 3, l: "Repositories" }].map((s, i, arr) => (
          <div key={i} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(139,92,246,0.12)" : "none" }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#f8f8ff", lineHeight: 1 }}>
              <Counter target={s.v} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569", marginTop: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#334155", letterSpacing: "0.15em" }}>SCROLL</div>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom,#4b5563,transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── Featured Simulations Strip ───────────────────────────────────────────────
function SimStrip({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const featured = SIMULATIONS.slice(0, 6);
  return (
    <section style={{ padding: "0 24px 80px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>⌬ Simulations · GitHub</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#f8f8ff", margin: 0 }}>Interactive Labs</h2>
        </div>
        <button onClick={() => onNavigate("simulations")}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#10b981", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "9px 18px", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.15)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.08)"; }}>
          View all {SIMULATIONS.length} →
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
        {featured.map((sim) => (
          <a key={sim.id} href={`${GITHUB_SIMULATIONS_BASE}/${sim.file}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "rgba(255,255,255,0.03)", border: `1px solid ${sim.accent}20`, borderRadius: 12, padding: "18px", textDecoration: "none", transition: "all 0.25s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${sim.accent}0d`; el.style.borderColor = `${sim.accent}50`; el.style.transform = "translateY(-4px)"; el.style.boxShadow = `0 12px 40px ${sim.accent}20`; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = `${sim.accent}20`; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: sim.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{sim.category}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{sim.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569" }}>Open ↗</div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Collections Grid ─────────────────────────────────────────────────────────
function CollectionsGrid({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section id="collections-section" style={{ padding: "0 24px 100px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Collections</div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: "#f8f8ff", margin: "0 0 14px", lineHeight: 1.05 }}>Your knowledge, organised.</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#64748b", maxWidth: 420, margin: "0 auto" }}>Ten categories, one place. Click any card to explore or add materials.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
        {COLLECTIONS.map((card, idx) => (
          <button key={card.id} onClick={() => onNavigate(`collection:${card.id}`)}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === card.id
                ? `linear-gradient(135deg, ${card.accent}10, ${card.accent}06)`
                : "rgba(255,255,255,0.03)",
              border: hovered === card.id ? `1px solid ${card.accent}50` : "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "22px 22px 18px", textAlign: "left", cursor: "pointer",
              transition: "all 0.25s ease",
              transform: hovered === card.id ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hovered === card.id ? `0 16px 48px ${card.accent}18` : "none",
              animation: `cardEntrance 0.5s ease ${idx * 0.04}s both`,
            }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${card.accent}18`, border: `1px solid ${card.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: card.accent, boxShadow: hovered === card.id ? `0 0 20px ${card.accent}30` : "none", transition: "box-shadow 0.25s" }}>
                {card.icon}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: card.accent, background: `${card.accent}12`, border: `1px solid ${card.accent}20`, borderRadius: 100, padding: "3px 10px", letterSpacing: "0.05em" }}>
                {card.tag}
              </span>
            </div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 7, lineHeight: 1.2 }}>{card.label}</div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#475569", lineHeight: 1.65, margin: "0 0 14px" }}>{card.description}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#334155" }}>{card.count} items</span>
              <span style={{ color: card.accent, fontSize: 14, opacity: hovered === card.id ? 1 : 0, transform: hovered === card.id ? "translateX(0)" : "translateX(-6px)", transition: "all 0.2s" }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Recent + overview ────────────────────────────────────────────────────────
const RECENT = [
  { title: "Electromagnetic Induction — Chapter Notes", type: "Notes", time: "2h ago", accent: "#60a5fa" },
  { title: "Organic Chemistry Lab — Ester Synthesis", type: "Lab Work", time: "Yesterday", accent: "#34d399" },
  { title: "Thermodynamics Mock Paper III", type: "Mock Tests", time: "2 days ago", accent: "#facc15" },
  { title: "Newton's Laws — Interactive Simulation", type: "Simulations", time: "3 days ago", accent: "#4ade80" },
  { title: "Calculus Basics — Auto Graded Quiz", type: "Auto Assessment", time: "4 days ago", accent: "#a78bfa" },
];

function RecentSection() {
  return (
    <section style={{ padding: "0 24px 100px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }} className="responsive-grid">
        {/* Recent */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Recent</div>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: "#f8f8ff", marginBottom: 24, lineHeight: 1.1 }}>Latest additions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {RECENT.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: "1px solid transparent", cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(139,92,246,0.06)"; el.style.borderColor = "rgba(139,92,246,0.15)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "transparent"; }}>
                <div style={{ width: 3, height: 38, borderRadius: 2, background: item.accent, flexShrink: 0, boxShadow: `0 0 8px ${item.accent}50` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#e2e8f0", fontWeight: 500, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569", letterSpacing: "0.04em" }}>{item.type}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#334155", flexShrink: 0 }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview */}
        <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.08),rgba(6,182,212,0.05))", border: "1px solid rgba(139,92,246,0.18)", borderRadius: 18, padding: "28px 28px 24px" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Overview</div>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 800, color: "#f8f8ff", marginBottom: 26, lineHeight: 1.1 }}>At a glance</h3>
          {[
            { label: "Notes", value: 142, max: 200, color: "#60a5fa" },
            { label: "Teaching Materials", value: 89, max: 200, color: "#fb923c" },
            { label: "Quizzes", value: 111, max: 200, color: "#22d3ee" },
            { label: "Mock Tests", value: 63, max: 200, color: "#facc15" },
            { label: "Practicals", value: 57, max: 200, color: "#a78bfa" },
            { label: "Animations", value: 47, max: 200, color: "#f87171" },
          ].map((bar) => (
            <div key={bar.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>{bar.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: bar.color }}>{bar.value}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${(bar.value / bar.max) * 100}%`, background: `linear-gradient(90deg,${bar.color}88,${bar.color})`, boxShadow: `0 0 8px ${bar.color}50`, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Total across collections</span>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#8b5cf6" }}>621</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sources Preview ──────────────────────────────────────────────────────────
function SourcesPreview({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const cards = [
    { label: "GitHub · Simulations", desc: "Chemistry & Physics labs", accent: "#10b981", count: "18 files", icon: "⌥" },
    { label: "GitHub · UI Designs", desc: "Interface experiments", accent: "#8b5cf6", count: "1 project", icon: "◉" },
    { label: "Local Upload", desc: "Upload from your device", accent: "#60a5fa", count: "Add files", icon: "◼" },
    { label: "Google Drive", desc: "Connect Drive — coming soon", accent: "#facc15", count: "Soon", icon: "▷" },
  ];
  return (
    <section style={{ padding: "0 24px 100px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#06b6d4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Connected Sources</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, color: "#f8f8ff", margin: 0, lineHeight: 1.1 }}>All your materials,<br />from anywhere.</h2>
        </div>
        <button onClick={() => onNavigate("sources")}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#06b6d4", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.22)", borderRadius: 8, padding: "9px 18px", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(6,182,212,0.15)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(6,182,212,0.08)"; }}>
          Manage sources →
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {cards.map((s) => (
          <button key={s.label} onClick={() => onNavigate("sources")}
            style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${s.accent}18`, borderRadius: 14, padding: "20px 20px 16px", textAlign: "left", cursor: "pointer", transition: "all 0.22s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${s.accent}0a`; el.style.borderColor = `${s.accent}40`; el.style.transform = "translateY(-4px)"; el.style.boxShadow = `0 12px 40px ${s.accent}15`; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.025)"; el.style.borderColor = `${s.accent}18`; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
            <div style={{ fontSize: 22, color: s.accent, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#475569", marginBottom: 10 }}>{s.desc}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: s.accent }}>{s.count}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage({ userName, onNavigate, currentPage, onLogout }: Props) {
  return (
    <>
      <NavBar userName={userName} onNavigate={onNavigate} currentPage={currentPage} onLogout={onLogout} />
      <ParticleField />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero userName={userName} onNavigate={onNavigate} />
        <SimStrip onNavigate={onNavigate} />
        <CollectionsGrid onNavigate={onNavigate} />
        <RecentSection />
        <SourcesPreview onNavigate={onNavigate} />
      </main>
    </>
  );
}
