import { useState } from "react";

const BASE = "https://2025akshat-lang.github.io/Akshat";

const SIMS = [
  {
    id: "watercycle",
    title: "Water Cycle Model",
    file: "Water_cycle.html",
    category: "Physics / Geography",
    thumb: <WaterCycleThumb />,
  },
  {
    id: "evaporation",
    title: "Evaporation vs Boiling",
    file: "Evaporation_Vs_boiling.html",
    category: "Chemistry",
    thumb: <EvaporationThumb />,
  },
  {
    id: "distillation",
    title: "Distillation Setup",
    file: "Distillation_setup.html",
    category: "Chemistry",
    thumb: <DistillationThumb />,
  },
  {
    id: "crystallization",
    title: "Crystallization Process",
    file: "crystallization.html",
    category: "Chemistry",
    thumb: <CrystalThumb />,
  },
  {
    id: "vacuum",
    title: "Vacuum Evaporation",
    file: "vaccum_evaporation.html",
    category: "Physics",
    thumb: <VacuumThumb />,
  },
  {
    id: "mixture",
    title: "Mixture Analysis",
    file: "Mixture.html",
    category: "Chemistry",
    thumb: <MixtureThumb />,
  },
  {
    id: "chromatography",
    title: "Paper Chromatography",
    file: "Chromatography.html",
    category: "Chemistry",
    thumb: <ChromaThumb />,
  },
  {
    id: "sublimation",
    title: "Sublimation",
    file: "Sublimation.html",
    category: "Chemistry",
    thumb: <SublimationThumb />,
  },
  {
    id: "mindmap",
    title: "Mind Map: Solutions",
    file: "Mindmapsolution.html",
    category: "Visual / Chemistry",
    thumb: <MindmapThumb />,
  },
  // Lab_visit.html and Chemistry.html are now in Practicals (section 3)
];

// ─── Thumbnail SVGs ────────────────────────────────────────────────────────────

function WaterCycleThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#dbeafe" />
      <ellipse cx="80" cy="55" rx="50" ry="30" fill="#94a3b8" opacity=".8" />
      <circle cx="190" cy="40" r="28" fill="#fde68a" />
      <rect x="0" y="140" width="280" height="50" fill="#3b82f6" opacity=".5" />
      {[60, 75, 90].map((x, i) => (
        <line key={i} x1={x} y1="80" x2={x - 4} y2="105" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 3" />
      ))}
      <path d="M 60 130 Q 140 80 220 130" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeDasharray="6 4" />
      <text x="140" y="175" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="700">Water Cycle</text>
    </svg>
  );
}

function EvaporationThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#ecfdf5" />
      <rect x="30" y="80" width="80" height="70" rx="4" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
      <text x="70" y="68" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700">Surface Only</text>
      <rect x="170" y="60" width="80" height="90" rx="4" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
      <text x="210" y="48" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700">Bulk Process</text>
      {[45, 60, 75].map((x, i) => <line key={i} x1={x} y1="78" x2={x} y2="55" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 2" />)}
      {[180, 195, 210, 225].map((x, i) => <circle key={i} cx={x} cy={90 + i * 15} r="5" fill="#60a5fa" opacity=".7" />)}
      <text x="70" y="168" textAnchor="middle" fill="#047857" fontSize="10">Evaporation</text>
      <text x="210" y="168" textAnchor="middle" fill="#dc2626" fontSize="10">Boiling</text>
      <text x="140" y="110" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="800">VS</text>
    </svg>
  );
}

function DistillationThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#f0f9ff" />
      <ellipse cx="70" cy="150" rx="45" ry="25" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
      <rect x="62" y="100" width="16" height="52" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M 90 110 L 180 70 L 220 90" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="175" y="82" width="50" height="16" rx="8" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      <ellipse cx="230" cy="150" rx="30" ry="18" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
      <text x="70" y="186" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700">Flask</text>
      <text x="200" y="76" textAnchor="middle" fill="#374151" fontSize="9">Liebig Condenser</text>
      <text x="140" y="185" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">Distillation Setup</text>
    </svg>
  );
}

function CrystalThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#1e1b4b" />
      <polygon points="140,30 200,80 180,150 100,150 80,80" fill="none" stroke="#818cf8" strokeWidth="3" />
      <polygon points="140,50 185,90 168,140 112,140 95,90" fill="#312e81" opacity=".8" stroke="#a5b4fc" strokeWidth="1.5" />
      <line x1="140" y1="30" x2="140" y2="50" stroke="#c7d2fe" strokeWidth="1.5" />
      <line x1="200" y1="80" x2="185" y2="90" stroke="#c7d2fe" strokeWidth="1.5" />
      <line x1="180" y1="150" x2="168" y2="140" stroke="#c7d2fe" strokeWidth="1.5" />
      <line x1="100" y1="150" x2="112" y2="140" stroke="#c7d2fe" strokeWidth="1.5" />
      <line x1="80" y1="80" x2="95" y2="90" stroke="#c7d2fe" strokeWidth="1.5" />
      <text x="140" y="174" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="700">Crystal Lattice Grid</text>
    </svg>
  );
}

function VacuumThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#0f172a" />
      <rect x="60" y="50" width="160" height="100" rx="12" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
      <path d="M 100 50 Q 100 20 140 20 Q 180 20 180 50" fill="none" stroke="#06b6d4" strokeWidth="2" />
      <text x="140" y="108" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="700">Low Pressure</text>
      <text x="140" y="125" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="700">Chamber</text>
      {[80, 110, 170, 200].map((x, i) => (
        <circle key={i} cx={x} cy={i % 2 === 0 ? 75 : 90} r="4" fill="#38bdf8" opacity=".6" />
      ))}
      <text x="140" y="175" textAnchor="middle" fill="#0ea5e9" fontSize="11" fontWeight="700">Vacuum Evaporation</text>
    </svg>
  );
}

function MixtureThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#ecfdf5" />
      <ellipse cx="90" cy="140" rx="55" ry="30" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
      <rect x="60" y="80" width="60" height="62" rx="4" fill="#86efac" stroke="#16a34a" strokeWidth="2" />
      <ellipse cx="190" cy="140" rx="55" ry="30" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      <rect x="160" y="80" width="60" height="62" rx="4" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
      <text x="90" y="65" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700">Salt</text>
      <text x="190" y="65" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="700">Sand</text>
      <path d="M 130 110 Q 140 100 150 110" stroke="#374151" strokeWidth="2" fill="none" />
      <text x="140" y="178" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="700">Mixture Analysis</text>
    </svg>
  );
}

function ChromaThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#f8fafc" />
      <rect x="110" y="20" width="60" height="140" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="115" y="130" width="50" height="6" rx="2" fill="#1d4ed8" />
      <text x="200" y="136" fill="#64748b" fontSize="9">Baseline</text>
      <rect x="115" y="100" width="50" height="5" rx="2" fill="#9333ea" />
      <rect x="115" y="80" width="35" height="5" rx="2" fill="#0ea5e9" />
      <rect x="115" y="60" width="20" height="5" rx="2" fill="#f59e0b" />
      <text x="200" y="104" fill="#64748b" fontSize="9">Solvent Front</text>
      <line x1="110" y1="155" x2="170" y2="155" stroke="#374151" strokeWidth="1.5" />
      <text x="140" y="180" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="700">Paper Chromatography</text>
    </svg>
  );
}

function SublimationThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#faf5ff" />
      <rect x="90" y="120" width="100" height="40" rx="6" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
      <text x="140" y="146" textAnchor="middle" fill="#4c1d95" fontSize="11" fontWeight="700">Solid → Gas</text>
      {[100, 125, 140, 155, 180].map((x, i) => (
        <path key={i} d={`M ${x} 118 Q ${x + 5} 90 ${x} 60`} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7" />
      ))}
      {[95, 130, 160, 185].map((x, i) => (
        <circle key={i} cx={x} cy={50 + i * 8} r="3" fill="#8b5cf6" opacity=".5" />
      ))}
      <text x="140" y="178" textAnchor="middle" fill="#6d28d9" fontSize="11" fontWeight="700">Sublimation Process</text>
    </svg>
  );
}

function MindmapThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#0f172a" />
      <circle cx="140" cy="95" r="28" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
      <text x="140" y="99" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Solution</text>
      {[
        [50, 40, "Solute"], [230, 40, "Solvent"], [50, 150, "Concentration"], [230, 150, "Types"],
      ].map(([x, y, label], i) => (
        <g key={i}>
          <line x1="140" y1="95" x2={x as number} y2={y as number} stroke="#3b82f6" strokeWidth="1.5" opacity=".6" />
          <ellipse cx={x as number} cy={y as number} rx="36" ry="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
          <text x={x as number} y={(y as number) + 4} textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="600">{label as string}</text>
        </g>
      ))}
      <text x="140" y="182" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="700">Mind Map: Solutions</text>
    </svg>
  );
}

function LabThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#f0fdf4" />
      <rect x="50" y="100" width="50" height="60" rx="6" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
      <ellipse cx="75" cy="100" rx="25" ry="8" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
      <rect x="160" y="110" width="30" height="55" rx="3" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
      <ellipse cx="175" cy="110" rx="15" ry="5" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="210" y="120" width="20" height="45" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <line x1="40" y1="165" x2="240" y2="165" stroke="#374151" strokeWidth="2" />
      <text x="140" y="182" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700">Virtual Lab Visit</text>
    </svg>
  );
}

function ChemThumb() {
  return (
    <svg viewBox="0 0 280 190" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="190" fill="#1a0533" />
      <circle cx="140" cy="85" r="30" fill="none" stroke="#a855f7" strokeWidth="2" />
      <circle cx="140" cy="85" r="10" fill="#7c3aed" />
      <ellipse cx="140" cy="85" rx="55" ry="20" fill="none" stroke="#818cf8" strokeWidth="1.5" transform="rotate(30,140,85)" />
      <ellipse cx="140" cy="85" rx="55" ry="20" fill="none" stroke="#818cf8" strokeWidth="1.5" transform="rotate(-30,140,85)" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = 55; const rad = (deg * Math.PI) / 180;
        const x = 140 + r * Math.cos(rad); const y = 85 + 20 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="4" fill="#c084fc" />;
      })}
      <text x="140" y="160" textAnchor="middle" fill="#d8b4fe" fontSize="14" fontWeight="700">H₂O | NaCl | CO₂</text>
      <text x="140" y="180" textAnchor="middle" fill="#a855f7" fontSize="11">Chemistry Overview</text>
    </svg>
  );
}

// ─── Iframe Modal ─────────────────────────────────────────────────────────────
function IframeModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", background: "rgba(6,182,212,0.08)", borderBottom: "1px solid rgba(6,182,212,0.2)", backdropFilter: "blur(20px)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 8px #06b6d4" }} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{title}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569" }}>· Interactive Simulation</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>Open in new tab ↗</a>
          <button onClick={onClose} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>✕ Close</button>
        </div>
      </div>
      <iframe src={url} title={title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style={{ flex: 1, border: "none", width: "100%", height: "100%" }} allow="fullscreen" />
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function SimulationsSection({ onBack, isAdmin: _isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  const [active, setActive] = useState<{ url: string; title: string } | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(SIMS.map((s) => s.category.split(" /")[0].trim())))];
  const filtered = SIMS.filter((s) => {
    const matchCat = filter === "All" || s.category.includes(filter);
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", paddingTop: 58 }}>
      {active && <IframeModal url={active.url} title={active.title} onClose={() => setActive(null)} />}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Back + header */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#06b6d4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Section 1 · Simulations & Animations
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#f8f8ff", margin: "0 0 10px", lineHeight: 1.05 }}>
            Interactive Science Models
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#64748b", margin: 0 }}>
            Class 9 Science — open animated practicals. Click to run inside the page or open in a new tab.
          </p>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search simulations..."
            style={{ flex: "1 1 220px", maxWidth: 320, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#f9fafb", fontSize: 13, fontFamily: "'Outfit',sans-serif", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: filter === cat ? "#06b6d4" : "rgba(255,255,255,0.05)", color: filter === cat ? "#000" : "#64748b", transition: "all 0.15s" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid — dark card style matching e-portfolio */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 22 }}>
          {filtered.map((sim, idx) => (
            <div key={sim.id}
              style={{ background: "#0d1117", borderRadius: 18, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", transition: "transform 0.3s ease, box-shadow 0.3s ease", animation: `cardEntrance 0.4s ease ${idx * 0.05}s both` }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = "translateY(-6px)"; el.style.boxShadow = "0 16px 40px rgba(0,229,255,0.2)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)"; }}
              onClick={() => setActive({ url: `${BASE}/${sim.file}`, title: sim.title })}
            >
              {/* Thumbnail */}
              <div style={{ width: "100%", height: 190, position: "relative", overflow: "hidden", background: "#eef7ff" }}>
                {sim.thumb}
              </div>
              {/* Card content */}
              <div style={{ padding: 16, background: "#0d1117" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3, fontFamily: "'Outfit',sans-serif" }}>
                  {sim.title}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>Class 9th Science Model</span>
                  <span style={{ background: "#0284c7", color: "#fff", padding: "5px 12px", borderRadius: 8, fontWeight: 600, fontSize: 11, letterSpacing: "0.3px", fontFamily: "'Outfit',sans-serif" }}>
                    3D Simulation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
