import { DASHBOARD_CONTAINERS, DashboardContainer } from "./config/content";

interface Props {
  userName: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

export default function DashboardHome({ userName, onNavigate, isAdmin }: Props) {
  const visible = DASHBOARD_CONTAINERS.filter(c => c.enabled);
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6", animation: "pulseDot 2s infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Welcome back, {userName}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.05, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Your Knowledge Hub
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#64748b", maxWidth: 500, lineHeight: 1.7, margin: 0 }}>
            Select a section to explore. Everything is organised.
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => onNavigate("admin")}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 100, padding: "7px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#8b5cf6", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            ⚙ Admin Panel — User Management
          </button>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
          {visible.map((c, idx) => <ContainerCard key={c.id} data={c} idx={idx} onNavigate={onNavigate} />)}
        </div>
        <div style={{ marginTop: 48, textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#cbd5e1", letterSpacing: "0.08em" }}>
          KNOWLEDGE OS · PERSONAL · UNDER DEVELOPMENT
        </div>
      </div>
    </div>
  );
}

function ContainerCard({ data: c, idx, onNavigate }: { data: DashboardContainer; idx: number; onNavigate: (p: string) => void }) {
  return (
    <button onClick={() => onNavigate(c.id)}
      style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "3px solid " + c.accent, borderRadius: 14, padding: "22px 20px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", animation: "cardEntrance 0.4s ease " + (idx * 0.06) + "s both", display: "flex", flexDirection: "column", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = "0 8px 30px " + c.accent + "22"; el.style.transform = "translateY(-3px)"; el.style.borderColor = c.accent; el.style.borderTopColor = c.accent; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; el.style.transform = "translateY(0)"; el.style.borderColor = "#e2e8f0"; el.style.borderTopColor = c.accent; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: c.accent + "14", border: "1px solid " + c.accent + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: c.accent }}>{c.icon}</div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: c.accent, background: c.accent + "12", border: "1px solid " + c.accent + "22", borderRadius: 100, padding: "3px 10px" }}>{c.countLabel}</span>
      </div>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 7, lineHeight: 1.25 }}>{c.label}</div>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: "0 0 14px", flex: 1 }}>{c.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {c.sub.map(s => <span key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 5, padding: "3px 7px" }}>{s}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: c.accent, fontWeight: 600 }}>Open section</span>
        <span style={{ color: c.accent, fontSize: 13 }}>→</span>
      </div>
    </button>
  );
}
