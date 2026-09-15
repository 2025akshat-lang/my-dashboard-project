import { useState } from "react";
import { SIMULATIONS, GITHUB_SIMULATIONS_BASE } from "./config";

const CATEGORIES = ["All", ...Array.from(new Set(SIMULATIONS.map((s) => s.category)))];

export default function SimulationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSimUrl, setActiveSimUrl] = useState<string | null>(null);
  const [activeSimLabel, setActiveSimLabel] = useState("");
  const [search, setSearch] = useState("");

  const filtered = SIMULATIONS.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.label.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh", paddingTop: 56 }}>
      {/* Iframe modal */}
      {activeSimUrl && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.95)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(5,7,20,0.9)", backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>{activeSimLabel}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151" }}>· Interactive Simulation</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={activeSimUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "7px 14px", textDecoration: "none" }}>
                Open in new tab ↗
              </a>
              <button onClick={() => setActiveSimUrl(null)}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>
                ✕ Close
              </button>
            </div>
          </div>
          <iframe src={activeSimUrl} title={activeSimLabel} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style={{ flex: 1, border: "none", width: "100%", height: "100%" }} allow="fullscreen" />
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4ade80", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>⌬ Simulations · 2025akshat-lang/Akshat</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,60px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.05 }}>
            Interactive Labs &<br />Simulations.
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#4b5563", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
            {SIMULATIONS.length} open animated practicals — Chemistry, Biology, Physics and more. Click any card to run it right here, or open in a new tab.
          </p>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 360 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#374151", fontSize: 14 }}>⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search simulations..."
              style={{ width: "100%", paddingLeft: 34, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px 10px 34px", color: "#f9fafb", fontSize: 13, fontFamily: "'Outfit',sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s", background: activeCategory === cat ? "#4ade80" : "rgba(255,255,255,0.04)", color: activeCategory === cat ? "#000" : "#6b7280" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151", marginBottom: 20, letterSpacing: "0.06em" }}>
          {filtered.length} SIMULATION{filtered.length !== 1 ? "S" : ""}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
          {filtered.map((sim) => (
            <div key={sim.id}
              style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${sim.accent}20`, borderRadius: 14, padding: "20px 20px 16px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${sim.accent}0d`; el.style.borderColor = `${sim.accent}40`; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 12px 40px ${sim.accent}15`; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.025)"; el.style.borderColor = `${sim.accent}20`; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
              {/* Category badge */}
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: sim.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{sim.category}</div>

              {/* Title */}
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#f9fafb", marginBottom: 16, lineHeight: 1.25 }}>{sim.label}</div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setActiveSimUrl(`${GITHUB_SIMULATIONS_BASE}/${sim.file}`); setActiveSimLabel(sim.label); }}
                  style={{ flex: 1, background: `${sim.accent}15`, border: `1px solid ${sim.accent}30`, borderRadius: 8, padding: "9px 0", color: sim.accent, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer", transition: "all 0.15s" }}>
                  Run here
                </button>
                <a href={`${GITHUB_SIMULATIONS_BASE}/${sim.file}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, textDecoration: "none", color: "#6b7280", fontSize: 12 }}>
                  ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#374151", fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>
            No simulations match your search.
          </div>
        )}
      </div>
    </div>
  );
}
