const BASE = "https://2025akshat-lang.github.io/Akshat";

export default function ArtCraftSection({ onBack, isAdmin: _isAdmin = false }: { onBack: () => void; isAdmin?: boolean }) {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 58, display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 24px", width: "100%" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#f472b6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Section 4 · Art & Craft</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.05 }}>Art &amp; Craft Studio</h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>Interactive creative module — art forms, craft techniques and visual projects.</p>
        </div>
      </div>

      {/* Full-height iframe wrapper */}
      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px 40px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: "72vh", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(244,114,182,0.22)", background: "#0d1117", boxShadow: "0 0 60px rgba(244,114,182,0.08)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(244,114,182,0.07)", borderBottom: "1px solid rgba(244,114,182,0.15)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f472b6", boxShadow: "0 0 6px #f472b6" }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Art and Craft</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569" }}>· Interactive Module</span>
            </div>
            <a href={`${BASE}/Art%20and%20craft.html`} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 12px", textDecoration: "none" }}>
              Open full screen ↗
            </a>
          </div>
          <iframe
            src={`${BASE}/Art%20and%20craft.html`}
            title="Art and Craft"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={{ flex: 1, border: "none", width: "100%", height: "100%", minHeight: "65vh" }}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
