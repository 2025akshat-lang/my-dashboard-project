import { useState, useRef } from "react";
import { ELEMENTS, ELEMENT_MAP, parseMolarMass, SOLUBILITY } from "../config/chemStore";
import type { ChemElement, ElementCategory } from "../config/chemStore";

// ── Inline colour map (CAT_STYLES uses Tailwind class names; we need raw values) ──

const CAT_COLORS: Record<ElementCategory, { bg: string; border: string; text: string }> = {
  alkali:           { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
  alkaline:         { bg: "#ffedd5", border: "#fdba74", text: "#9a3412" },
  transition:       { bg: "#fef9c3", border: "#fde047", text: "#713f12" },
  "post-transition":{ bg: "#ecfccb", border: "#a3e635", text: "#3f6212" },
  metalloid:        { bg: "#ccfbf1", border: "#5eead4", text: "#134e4a" },
  nonmetal:         { bg: "#e0f2fe", border: "#7dd3fc", text: "#075985" },
  halogen:          { bg: "#dbeafe", border: "#93c5fd", text: "#1e3a8a" },
  noble:            { bg: "#ede9fe", border: "#c4b5fd", text: "#4c1d95" },
  lanthanide:       { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  actinide:         { bg: "#fdf4ff", border: "#e879f9", text: "#701a75" },
};

const CAT_LABELS: Record<ElementCategory, string> = {
  alkali:           "Alkali Metal",
  alkaline:         "Alkaline Earth",
  transition:       "Transition Metal",
  "post-transition":"Post-Transition Metal",
  metalloid:        "Metalloid",
  nonmetal:         "Nonmetal",
  halogen:          "Halogen",
  noble:            "Noble Gas",
  lanthanide:       "Lanthanide",
  actinide:         "Actinide",
};

// ── Props ────────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  isAdmin?: boolean;
}

// ── Hover popup ──────────────────────────────────────────────────────────────────

interface PopupState {
  el: ChemElement;
  x: number;
  y: number;
}

// ── Tab 1: Periodic Table ────────────────────────────────────────────────────────

function PeriodicTableTab() {
  const [hoveredEl, setHoveredEl] = useState<PopupState | null>(null);
  const [selectedEl, setSelectedEl] = useState<ChemElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (el: ChemElement, e: React.MouseEvent) => {
    setHoveredEl({ el, x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Grid */}
      <div style={{ overflowX: "auto" }}>
        <div
          ref={containerRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(18, 52px)",
            gridTemplateRows: "repeat(10, 52px)",
            gap: 2,
            minWidth: 18 * 54,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* f-block separator row label – row 8 */}
          <div
            style={{
              gridColumn: "1 / 3",
              gridRow: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 4,
            }}
          />
          {/* Lanthanides label */}
          <div
            style={{
              gridColumn: 1,
              gridRow: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontFamily: "'Outfit',sans-serif",
              color: "#6b7280",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Lantha-nides
          </div>
          {/* Actinides label */}
          <div
            style={{
              gridColumn: 1,
              gridRow: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontFamily: "'Outfit',sans-serif",
              color: "#6b7280",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Acti-nides
          </div>

          {/* ★ placeholder for Lanthanide series in main table (period 6, col 3) */}
          <div
            style={{
              gridColumn: 3,
              gridRow: 6,
              background: "#fce7f3",
              border: "1px solid #f9a8d4",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#9d174d",
            }}
          >
            ★
          </div>
          {/* ★ placeholder for Actinide series in main table (period 7, col 3) */}
          <div
            style={{
              gridColumn: 3,
              gridRow: 7,
              background: "#fdf4ff",
              border: "1px solid #e879f9",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#701a75",
            }}
          >
            ★
          </div>

          {/* Elements */}
          {ELEMENTS.map((el) => {
            const colors = CAT_COLORS[el.cat];
            return (
              <div
                key={el.n}
                style={{
                  gridColumn: el.col,
                  gridRow: el.row,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2px 1px",
                  transition: "transform 0.1s",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => handleMouseMove(el, e)}
                onMouseMove={(e) => handleMouseMove(el, e)}
                onMouseLeave={() => setHoveredEl(null)}
                onClick={() => setSelectedEl(el)}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.15)";
                  (e.currentTarget as HTMLDivElement).style.zIndex = "10";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLDivElement).style.zIndex = "1";
                }}
              >
                {/* atomic number */}
                <span
                  style={{
                    position: "absolute",
                    top: 1,
                    left: 2,
                    fontSize: 7,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: colors.text,
                    lineHeight: 1,
                  }}
                >
                  {el.n}
                </span>
                {/* symbol */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Outfit',sans-serif",
                    color: colors.text,
                    lineHeight: 1,
                  }}
                >
                  {el.sym}
                </span>
                {/* name */}
                <span
                  style={{
                    fontSize: 6,
                    fontFamily: "'Outfit',sans-serif",
                    color: colors.text,
                    opacity: 0.8,
                    lineHeight: 1,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {el.name}
                </span>
                {/* mass */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 1,
                    right: 2,
                    fontSize: 6,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: colors.text,
                    opacity: 0.7,
                    lineHeight: 1,
                  }}
                >
                  {el.mass}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 20,
          padding: "0 24px",
        }}
      >
        {(Object.keys(CAT_COLORS) as ElementCategory[]).map((cat) => {
          const c = CAT_COLORS[cat];
          return (
            <div
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "'Outfit',sans-serif",
                  color: c.text,
                  fontWeight: 600,
                }}
              >
                {CAT_LABELS[cat]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover popup (fixed) */}
      {hoveredEl && (
        <div
          style={{
            position: "fixed",
            left: Math.min(hoveredEl.x + 16, window.innerWidth - 200),
            top: Math.max(hoveredEl.y - 120, 8),
            background: "#fff",
            border: `2px solid ${CAT_COLORS[hoveredEl.el.cat].border}`,
            borderRadius: 10,
            padding: "12px 16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 9999,
            pointerEvents: "none",
            minWidth: 160,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              fontFamily: "'Fraunces',serif",
              color: CAT_COLORS[hoveredEl.el.cat].text,
              lineHeight: 1,
            }}
          >
            {hoveredEl.el.sym}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit',sans-serif",
              color: "#111827",
              marginTop: 4,
            }}
          >
            {hoveredEl.el.name}
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono',monospace",
              color: "#6b7280",
              marginTop: 2,
            }}
          >
            Z = {hoveredEl.el.n} &nbsp;|&nbsp; {hoveredEl.el.mass} g/mol
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 10,
              fontFamily: "'Outfit',sans-serif",
              background: CAT_COLORS[hoveredEl.el.cat].bg,
              color: CAT_COLORS[hoveredEl.el.cat].text,
              borderRadius: 12,
              padding: "2px 8px",
              display: "inline-block",
            }}
          >
            {CAT_LABELS[hoveredEl.el.cat]}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedEl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => setSelectedEl(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 40px",
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              border: `3px solid ${CAT_COLORS[selectedEl.cat].border}`,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEl(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              ×
            </button>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                fontFamily: "'Fraunces',serif",
                color: CAT_COLORS[selectedEl.cat].text,
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              {selectedEl.sym}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'Outfit',sans-serif",
                color: "#111827",
                marginTop: 8,
              }}
            >
              {selectedEl.name}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 24px",
                marginTop: 20,
              }}
            >
              {[
                ["Atomic Number", selectedEl.n],
                ["Atomic Mass", `${selectedEl.mass} g/mol`],
                ["Group", selectedEl.group],
                ["Period", selectedEl.period],
                ["Category", CAT_LABELS[selectedEl.cat]],
              ].map(([label, val]) => (
                <div key={String(label)}>
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono',monospace",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      fontFamily: "'Outfit',sans-serif",
                      color: "#111827",
                      marginTop: 2,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 20,
                padding: "8px 16px",
                background: CAT_COLORS[selectedEl.cat].bg,
                borderRadius: 8,
                textAlign: "center",
                fontSize: 13,
                fontFamily: "'Outfit',sans-serif",
                color: CAT_COLORS[selectedEl.cat].text,
                fontWeight: 600,
              }}
            >
              {CAT_LABELS[selectedEl.cat]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab 2: Molar Mass Calculator ─────────────────────────────────────────────────

const EXAMPLE_FORMULAS = ["H2O", "NaCl", "Ca(OH)2", "H2SO4", "C6H12O6", "CaCO3"];

function MolarMassTab() {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<ReturnType<typeof parseMolarMass> | null>(null);

  const calculate = () => {
    if (!formula.trim()) return;
    setResult(parseMolarMass(formula.trim()));
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 40 }}>
      {/* Example chips */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono',monospace",
            color: "#9ca3af",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Examples
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLE_FORMULAS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFormula(f);
                setResult(parseMolarMass(f));
              }}
              style={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                borderRadius: 20,
                padding: "5px 14px",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 13,
                color: "#374151",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && calculate()}
          placeholder="e.g. Ca(OH)2 or Fe2(SO4)3"
          style={{
            flex: 1,
            border: "1.5px solid #d1d5db",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 15,
            color: "#111827",
            outline: "none",
            background: "#fff",
          }}
        />
        <button
          onClick={calculate}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Calculate
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {"error" in result ? (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 10,
                padding: "16px 20px",
                color: "#991b1b",
                fontFamily: "'Outfit',sans-serif",
                fontSize: 14,
              }}
            >
              {result.error}
            </div>
          ) : (
            <div>
              {/* Total */}
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: 12,
                  padding: "20px 24px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  Molar Mass of {formula}
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    fontFamily: "'Fraunces',serif",
                    color: "#14532d",
                    lineHeight: 1,
                  }}
                >
                  {result.mass.toFixed(3)}
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      fontFamily: "'Outfit',sans-serif",
                      color: "#16a34a",
                      marginLeft: 8,
                    }}
                  >
                    g/mol
                  </span>
                </div>
              </div>

              {/* Breakdown table */}
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      {["Element", "Count", "Atomic Mass (g/mol)", "Subtotal (g/mol)", "% Composition"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
                            textAlign: "left",
                            fontSize: 11,
                            fontFamily: "'JetBrains Mono',monospace",
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.breakdown).map(([sym, count], i) => {
                      const el = ELEMENT_MAP[sym.toUpperCase()];
                      const subtotal = el ? el.mass * count : 0;
                      return (
                        <tr
                          key={sym}
                          style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}
                        >
                          <td
                            style={{
                              padding: "10px 16px",
                              fontFamily: "'Outfit',sans-serif",
                              fontSize: 14,
                              color: "#111827",
                              fontWeight: 600,
                            }}
                          >
                            {el ? el.name : sym}
                            <span
                              style={{
                                marginLeft: 6,
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: 12,
                                color: "#6b7280",
                              }}
                            >
                              ({sym})
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 14,
                              color: "#374151",
                            }}
                          >
                            {count}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 14,
                              color: "#374151",
                            }}
                          >
                            {el ? el.mass.toFixed(3) : "—"}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 14,
                              color: "#111827",
                              fontWeight: 600,
                            }}
                          >
                            {subtotal.toFixed(3)}
                          </td>
                          {/* % Composition column */}
                          <td style={{ padding: "10px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#374151" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", background: "#6366f1", borderRadius: 3, width: `${((subtotal / result.mass) * 100).toFixed(1)}%` }} />
                              </div>
                              <span style={{ minWidth: 42, textAlign: "right", fontSize: 12 }}>
                                {((subtotal / result.mass) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Stoichiometry Composition Summary */}
              <div style={{ marginTop: 20, background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                  % Composition by Mass
                </div>
                {Object.entries(result.breakdown).map(([sym, count]) => {
                  const el = ELEMENT_MAP[sym.toUpperCase()];
                  const subtotal = el ? el.mass * count : 0;
                  const pct = result.mass > 0 ? (subtotal / result.mass) * 100 : 0;
                  return (
                    <div key={sym} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
                          {el?.name || sym} ({sym})
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#7c3aed", fontWeight: 700 }}>
                          {pct.toFixed(3)}%
                        </span>
                      </div>
                      <div style={{ height: 10, background: "#e9d5ff", borderRadius: 5, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
                          borderRadius: 5,
                          width: `${pct}%`,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #e9d5ff", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af" }}>
                  Empirical Formula: {formula} · Molar Mass: {result.mass.toFixed(4)} g/mol
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Tab 3: Molecular Viewer ───────────────────────────────────────────────────────

const MOLECULE_CHIPS = ["water", "methane", "ethanol", "benzene", "glucose", "aspirin", "caffeine"];

function MolecularViewerTab() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const handleView = () => {
    if (query.trim()) setActiveQuery(query.trim());
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", paddingBottom: 40 }}>
      {/* Quick picks */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono',monospace",
            color: "#9ca3af",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Quick pick
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {MOLECULE_CHIPS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setQuery(m);
                setActiveQuery(m);
              }}
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 20,
                padding: "5px 14px",
                fontFamily: "'Outfit',sans-serif",
                fontSize: 13,
                color: "#1d4ed8",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleView()}
          placeholder="e.g. water, methane, aspirin, C6H12O6"
          style={{
            flex: 1,
            border: "1.5px solid #d1d5db",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 15,
            color: "#111827",
            outline: "none",
            background: "#fff",
          }}
        />
        <button
          onClick={handleView}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View 3D Structure
        </button>
      </div>

      {/* iframe */}
      {activeQuery ? (
        <div
          style={{
            border: "1.5px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
            background: "#f9fafb",
          }}
        >
          <iframe
            key={activeQuery}
            src={`https://molview.org/?q=${encodeURIComponent(activeQuery)}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={{ width: "100%", height: 500, border: "none", display: "block" }}
            title={`3D structure of ${activeQuery}`}
          />
        </div>
      ) : (
        <div
          style={{
            border: "1.5px dashed #d1d5db",
            borderRadius: 12,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 14,
          }}
        >
          Enter a molecule name or formula above to view its 3D structure
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          fontFamily: "'Outfit',sans-serif",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        3D viewer powered by MolView — requires internet connection
      </div>
    </div>
  );
}

// ── Tab 4: Solubility Matrix ──────────────────────────────────────────────────────

const SOL_STYLES: Record<"S" | "SS" | "I", { bg: string; text: string; label: string }> = {
  S:  { bg: "#dcfce7", text: "#14532d", label: "Soluble" },
  SS: { bg: "#fef9c3", text: "#713f12", label: "Slightly Soluble" },
  I:  { bg: "#fee2e2", text: "#991b1b", label: "Insoluble" },
};

function SolubilityTab() {
  const { cations, anions, data } = SOLUBILITY;

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: 600,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          <thead>
            <tr>
              {/* top-left corner */}
              <th
                style={{
                  padding: "10px 16px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: 11,
                  color: "#6b7280",
                  textAlign: "center",
                  minWidth: 90,
                }}
              >
                Cation \ Anion
              </th>
              {anions.map((an) => (
                <th
                  key={an}
                  style={{
                    padding: "10px 12px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                    color: "#374151",
                    fontWeight: 700,
                    textAlign: "center",
                    minWidth: 72,
                  }}
                >
                  {an}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cations.map((cat, ri) => (
              <tr key={cat} style={{ background: ri % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #e5e7eb",
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {cat}
                </td>
                {anions.map((an) => {
                  const sol = data[cat]?.[an] ?? "S";
                  const st = SOL_STYLES[sol];
                  return (
                    <td
                      key={an}
                      style={{
                        padding: "10px 12px",
                        border: "1px solid #e5e7eb",
                        background: st.bg,
                        color: st.text,
                        textAlign: "center",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {sol}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        {(["S", "SS", "I"] as const).map((key) => {
          const st = SOL_STYLES[key];
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                background: st.bg,
                border: `1px solid ${st.text}30`,
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontWeight: 700,
                  color: st.text,
                }}
              >
                {key}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "'Outfit',sans-serif",
                  color: st.text,
                }}
              >
                — {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Molecule 3D Tab ───────────────────────────────────────────────────────────────

function Molecule3DTab() {
  const [molKey, setMolKey] = useState("H2O");
  const [renderStyle, setRenderStyle] = useState("ballstick");

  const SRCDOC = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#0f172a;display:flex;flex-direction:column;height:100vh;overflow:hidden;font-family:monospace;color:#e2e8f0;}
#bar{background:#1e293b;padding:8px 14px;display:flex;gap:10px;align-items:center;flex-shrink:0;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,0.07);}
#bar select,#bar button{background:#334155;color:#e2e8f0;border:1px solid #475569;border-radius:6px;padding:4px 10px;font-size:12px;cursor:pointer;font-family:monospace;}
#bar button{background:#6366f1;}
#bar label{color:#94a3b8;font-size:12px;}
#info{color:#64748b;font-size:11px;margin-left:auto;}
canvas{display:block;width:100%;flex:1;cursor:grab;background:#0f172a;}
canvas.dragging{cursor:grabbing;}
</style>
</head>
<body>
<div id="bar">
  <label>Molecule:</label>
  <select id="mol">
    <option value="H2O">Water (H2O)</option>
    <option value="CO2">Carbon Dioxide (CO2)</option>
    <option value="CH4">Methane (CH4)</option>
    <option value="NH3">Ammonia (NH3)</option>
    <option value="C2H6">Ethane (C2H6)</option>
    <option value="C2H4">Ethylene (C2H4)</option>
    <option value="C2H2">Acetylene (C2H2)</option>
    <option value="C6H6">Benzene (C6H6)</option>
    <option value="NaCl">Sodium Chloride (NaCl)</option>
    <option value="HCl">Hydrogen Chloride (HCl)</option>
  </select>
  <label>Style:</label>
  <select id="sty">
    <option value="ballstick">Ball and Stick</option>
    <option value="spacefill">Space Fill</option>
    <option value="stick">Stick Only</option>
  </select>
  <button id="resetBtn">Reset</button>
  <button id="autoBtn">Auto Rotate</button>
  <span id="info">Drag to rotate · Scroll to zoom</span>
</div>
<canvas id="c"></canvas>
<script>
var EL={H:{color:"#e2e8f0",r:0.31},C:{color:"#374151",r:0.77},N:{color:"#3b82f6",r:0.75},O:{color:"#ef4444",r:0.73},S:{color:"#eab308",r:1.02},Cl:{color:"#22c55e",r:0.99},Na:{color:"#a855f7",r:1.86},F:{color:"#06b6d4",r:0.64}};
var MOLS={
  H2O:{name:"Water",atoms:[{el:"O",x:0,y:0,z:0},{el:"H",x:0.757,y:0.586,z:0},{el:"H",x:-0.757,y:0.586,z:0}],bonds:[[0,1],[0,2]]},
  CO2:{name:"Carbon Dioxide",atoms:[{el:"C",x:0,y:0,z:0},{el:"O",x:1.16,y:0,z:0},{el:"O",x:-1.16,y:0,z:0}],bonds:[[0,1],[0,2]]},
  CH4:{name:"Methane",atoms:[{el:"C",x:0,y:0,z:0},{el:"H",x:0.63,y:0.63,z:0.63},{el:"H",x:-0.63,y:-0.63,z:0.63},{el:"H",x:-0.63,y:0.63,z:-0.63},{el:"H",x:0.63,y:-0.63,z:-0.63}],bonds:[[0,1],[0,2],[0,3],[0,4]]},
  NH3:{name:"Ammonia",atoms:[{el:"N",x:0,y:0,z:0},{el:"H",x:0.94,y:0,z:-0.33},{el:"H",x:-0.47,y:0.81,z:-0.33},{el:"H",x:-0.47,y:-0.81,z:-0.33}],bonds:[[0,1],[0,2],[0,3]]},
  C2H6:{name:"Ethane",atoms:[{el:"C",x:0,y:0,z:0.77},{el:"C",x:0,y:0,z:-0.77},{el:"H",x:1.02,y:0,z:1.16},{el:"H",x:-0.51,y:0.88,z:1.16},{el:"H",x:-0.51,y:-0.88,z:1.16},{el:"H",x:1.02,y:0,z:-1.16},{el:"H",x:-0.51,y:0.88,z:-1.16},{el:"H",x:-0.51,y:-0.88,z:-1.16}],bonds:[[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[1,7]]},
  C2H4:{name:"Ethylene",atoms:[{el:"C",x:0,y:0,z:0.67},{el:"C",x:0,y:0,z:-0.67},{el:"H",x:0.92,y:0,z:1.24},{el:"H",x:-0.92,y:0,z:1.24},{el:"H",x:0.92,y:0,z:-1.24},{el:"H",x:-0.92,y:0,z:-1.24}],bonds:[[0,1],[0,2],[0,3],[1,4],[1,5]]},
  C2H2:{name:"Acetylene",atoms:[{el:"C",x:0,y:0,z:0.61},{el:"C",x:0,y:0,z:-0.61},{el:"H",x:0,y:0,z:1.67},{el:"H",x:0,y:0,z:-1.67}],bonds:[[0,1],[0,2],[1,3]]},
  C6H6:{name:"Benzene",atoms:[{el:"C",x:1.4,y:0,z:0},{el:"C",x:0.7,y:1.212,z:0},{el:"C",x:-0.7,y:1.212,z:0},{el:"C",x:-1.4,y:0,z:0},{el:"C",x:-0.7,y:-1.212,z:0},{el:"C",x:0.7,y:-1.212,z:0},{el:"H",x:2.48,y:0,z:0},{el:"H",x:1.24,y:2.15,z:0},{el:"H",x:-1.24,y:2.15,z:0},{el:"H",x:-2.48,y:0,z:0},{el:"H",x:-1.24,y:-2.15,z:0},{el:"H",x:1.24,y:-2.15,z:0}],bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]]},
  NaCl:{name:"Sodium Chloride",atoms:[{el:"Na",x:0,y:0,z:0},{el:"Cl",x:2.36,y:0,z:0}],bonds:[[0,1]]},
  HCl:{name:"HCl",atoms:[{el:"H",x:0,y:0,z:0},{el:"Cl",x:1.27,y:0,z:0}],bonds:[[0,1]]}
};
var cv=document.getElementById("c"),ctx=cv.getContext("2d");
var W,H,rotX=0.3,rotY=0.5,sc=120,drag=false,lx=0,ly=0,auto=false,cur="H2O",sty="ballstick";
function resize(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;draw();}
function rot(x,y,z){
  var x1=x*Math.cos(rotY)+z*Math.sin(rotY),z1=-x*Math.sin(rotY)+z*Math.cos(rotY);
  var y2=y*Math.cos(rotX)-z1*Math.sin(rotX),z2=y*Math.sin(rotX)+z1*Math.cos(rotX);
  return [x1,y2,z2];
}
function proj(v){var fov=8,z=v[2]+fov;return [W/2+(v[0]*sc*fov)/z,H/2-(v[1]*sc*fov)/z,v[2]];}
function grad(px,py,r,col){
  var g=ctx.createRadialGradient(px-r*0.3,py-r*0.3,r*0.1,px,py,r);
  g.addColorStop(0,"rgba(255,255,255,0.5)");g.addColorStop(0.5,col);g.addColorStop(1,col+"60");
  ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=col;ctx.lineWidth=1;ctx.stroke();
}
function draw(){
  ctx.clearRect(0,0,W,H);
  var bg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)/1.5);
  bg.addColorStop(0,"#1e293b");bg.addColorStop(1,"#0f172a");
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  var mol=MOLS[cur];if(!mol)return;
  var proj_atoms=mol.atoms.map(function(a){var rv=rot(a.x,a.y,a.z),pv=proj(rv);return {el:a.el,px:pv[0],py:pv[1],pz:pv[2]};});
  var sorted=proj_atoms.slice().sort(function(a,b){return a.pz-b.pz;});
  if(sty!=="spacefill"){
    mol.bonds.forEach(function(b){
      var a=proj_atoms[b[0]],bb=proj_atoms[b[1]];
      ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(bb.px,bb.py);
      ctx.strokeStyle="#94a3b8";ctx.lineWidth=sty==="stick"?4:3;ctx.lineCap="round";ctx.stroke();
    });
  }
  if(sty!=="stick"){
    sorted.forEach(function(a){
      var ed=EL[a.el]||{color:"#e2e8f0",r:0.5};
      var fov=8,baseR=sty==="spacefill"?ed.r*50:ed.r*24+8;
      var psc=(fov/(a.pz+fov))*sc,r=Math.max(4,(baseR/sc)*psc);
      grad(a.px,a.py,r,ed.color);
      if(r>12){
        ctx.fillStyle="#0f172a";
        ctx.font="bold "+Math.min(Math.floor(r),16)+"px monospace";
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(a.el,a.px,a.py);
      }
    });
  }
}
cv.addEventListener("mousedown",function(e){drag=true;lx=e.clientX;ly=e.clientY;cv.classList.add("dragging");});
cv.addEventListener("mouseup",function(){drag=false;cv.classList.remove("dragging");});
cv.addEventListener("mousemove",function(e){if(!drag)return;rotY+=(e.clientX-lx)*0.01;rotX+=(e.clientY-ly)*0.01;lx=e.clientX;ly=e.clientY;draw();});
cv.addEventListener("wheel",function(e){sc=Math.max(40,Math.min(400,sc-e.deltaY*0.5));draw();});
document.getElementById("mol").addEventListener("change",function(e){cur=e.target.value;rotX=0.3;rotY=0.5;draw();});
document.getElementById("sty").addEventListener("change",function(e){sty=e.target.value;draw();});
document.getElementById("resetBtn").addEventListener("click",function(){rotX=0.3;rotY=0.5;sc=120;draw();});
document.getElementById("autoBtn").addEventListener("click",function(){auto=!auto;});
function loop(){if(auto){rotY+=0.012;draw();}requestAnimationFrame(loop);}
window.addEventListener("resize",resize);
resize();loop();
</script>
</body>
</html>`;

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 12, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b" }}>
        Interactive 3D ball-and-stick molecule viewer. Drag to rotate, scroll to zoom. Select molecule and render style above.
      </div>
      <iframe
        srcDoc={SRCDOC}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{ width: "100%", height: 520, border: "1px solid #e5e7eb", borderRadius: 12 }}
        title="3D Molecule Viewer"
      />
    </div>
  );
}

// ── Reactions Tab ─────────────────────────────────────────────────────────────────

interface OrgReaction { type: string; eq: string; reactants: string[]; product: string; conditions: string; notes: string; }
const REACTION_DB: OrgReaction[] = [
  { type:"Combustion", eq:"CH₄ + 2O₂ → CO₂ + 2H₂O", reactants:["CH4","O2"], product:"CO₂ + H₂O", conditions:"Heat/ignition", notes:"Complete combustion of methane releases 890 kJ/mol." },
  { type:"Combustion", eq:"C₂H₆ + 7/2 O₂ → 2CO₂ + 3H₂O", reactants:["C2H6","O2"], product:"CO₂ + H₂O", conditions:"Heat", notes:"Combustion of ethane." },
  { type:"Hydrogenation", eq:"C₂H₄ + H₂ → C₂H₆", reactants:["C2H4","H2"], product:"C₂H₆ (Ethane)", conditions:"Ni catalyst, 150°C", notes:"Addition of H₂ across double bond. Exothermic: ΔH = −137 kJ/mol." },
  { type:"Hydrogenation", eq:"C₂H₂ + 2H₂ → C₂H₆", reactants:["C2H2","H2"], product:"C₂H₆ (Ethane)", conditions:"Pt/Pd catalyst", notes:"Full hydrogenation of acetylene." },
  { type:"Halogenation", eq:"CH₄ + Cl₂ → CH₃Cl + HCl", reactants:["CH4","Cl2"], product:"CH₃Cl + HCl", conditions:"UV light", notes:"Free radical substitution. Further chlorination possible." },
  { type:"Halogenation", eq:"C₂H₄ + Br₂ → CH₂BrCH₂Br", reactants:["C2H4","Br2"], product:"1,2-dibromoethane", conditions:"Room temperature", notes:"Electrophilic addition. Bromine water is decolourized — test for alkenes." },
  { type:"Hydration", eq:"C₂H₄ + H₂O → C₂H₅OH", reactants:["C2H4","H2O"], product:"Ethanol (C₂H₅OH)", conditions:"H₃PO₄ catalyst, 300°C, 60 atm", notes:"Industrial production of ethanol. Markovnikov's rule applies." },
  { type:"Oxidation", eq:"C₂H₅OH + [O] → CH₃CHO", reactants:["C2H5OH","O2"], product:"Acetaldehyde (CH₃CHO)", conditions:"K₂Cr₂O₇ / H₂SO₄", notes:"Partial oxidation of primary alcohol gives aldehyde." },
  { type:"Oxidation", eq:"CH₃CHO + [O] → CH₃COOH", reactants:["CH3CHO","O2"], product:"Acetic Acid (CH₃COOH)", conditions:"K₂Cr₂O₇ / H₂SO₄", notes:"Oxidation of aldehyde to carboxylic acid." },
  { type:"Esterification", eq:"CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O", reactants:["CH3COOH","C2H5OH"], product:"Ethyl acetate", conditions:"H₂SO₄ catalyst, heat, reversible", notes:"Fischer esterification. Equilibrium reaction, yield increased by removing water." },
  { type:"Saponification", eq:"CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH", reactants:["CH3COOC2H5","NaOH"], product:"Sodium acetate + Ethanol", conditions:"NaOH, water, heat", notes:"Base hydrolysis of ester. Irreversible unlike acid hydrolysis." },
  { type:"Dehydration", eq:"C₂H₅OH → C₂H₄ + H₂O", reactants:["C2H5OH","H2SO4"], product:"Ethylene (C₂H₄)", conditions:"conc. H₂SO₄, 170°C", notes:"Intramolecular dehydration. At 140°C gives diethyl ether instead." },
  { type:"Polymerization", eq:"n C₂H₄ → [−CH₂−CH₂−]ₙ", reactants:["C2H4","catalyst"], product:"Polyethylene", conditions:"Ziegler-Natta catalyst or high pressure", notes:"Addition polymerization. LDPE vs HDPE depends on conditions." },
  { type:"Substitution (SN2)", eq:"CH₃Br + OH⁻ → CH₃OH + Br⁻", reactants:["CH3Br","NaOH"], product:"Methanol + NaBr", conditions:"Aqueous NaOH, heat", notes:"Bimolecular nucleophilic substitution. Inversion of configuration." },
];

function ReactionsTab() {
  const [r1, setR1] = useState("");
  const [r2, setR2] = useState("");
  const [results, setResults] = useState<OrgReaction[]>([]);
  const [searched, setSearched] = useState(false);

  const predict = () => {
    if (!r1) return;
    const found = REACTION_DB.filter(rx => {
      const rSet = rx.reactants.map(x => x.toLowerCase());
      const r1ok = rSet.some(x => x.includes(r1.toLowerCase()) || r1.toLowerCase().includes(x));
      const r2ok = !r2 || rSet.some(x => x.includes(r2.toLowerCase()) || r2.toLowerCase().includes(x));
      return r1ok && r2ok;
    });
    setResults(found);
    setSearched(true);
  };

  const TYPE_COLORS: Record<string, string> = {
    Combustion: "#ef4444", Hydrogenation: "#3b82f6", Halogenation: "#f59e0b",
    Hydration: "#06b6d4", Oxidation: "#f97316", Esterification: "#8b5cf6",
    Saponification: "#ec4899", Dehydration: "#10b981", Polymerization: "#6366f1",
    "Substitution (SN2)": "#84cc16",
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Select Reactants to Predict Reaction
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Reactant 1 *</div>
            <input value={r1} onChange={e => setR1(e.target.value)} placeholder="e.g. CH4, C2H4, C2H5OH"
              style={{ width: "100%", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#111827", outline: "none", background: "#fff" }} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Reactant 2 (optional)</div>
            <input value={r2} onChange={e => setR2(e.target.value)} placeholder="e.g. O2, H2, Cl2, NaOH"
              style={{ width: "100%", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#111827", outline: "none", background: "#fff" }} />
          </div>
          <button onClick={predict}
            style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Predict →
          </button>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["CH4","C2H4","C2H6","C2H5OH","CH3COOH","C6H6","CH3Br"].map(r => (
            <button key={r} onClick={() => setR1(r)}
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#374151", cursor: "pointer" }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {searched && results.length === 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "16px 20px", fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#991b1b" }}>
          No reactions found for the given reactants. Try common reactants like CH4+O2, C2H4+H2, C2H5OH+H2SO4.
        </div>
      )}

      {results.map((rx, i) => {
        const tc = TYPE_COLORS[rx.type] || "#6b7280";
        return (
          <div key={i} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "20px 24px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: tc, background: tc + "18", border: "1px solid " + tc + "40", borderRadius: 8, padding: "4px 12px" }}>
                {rx.type}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af" }}>{rx.conditions}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#111827", background: "#f8fafc", borderRadius: 8, padding: "12px 16px", marginBottom: 14, letterSpacing: "0.03em" }}>
              {rx.eq}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>Product</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#111827", fontWeight: 600 }}>{rx.product}</div>
              </div>
            </div>
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 14px", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#0369a1" }}>
              💡 {rx.notes}
            </div>
          </div>
        );
      })}

      {!searched && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>All Reaction Types in Database</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(TYPE_COLORS).map(([t, c]) => (
              <span key={t} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, padding: "4px 12px", borderRadius: 20, background: c + "18", color: c, border: "1px solid " + c + "40", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "periodic", label: "Periodic Table" },
  { id: "molar",    label: "Molar Mass Calculator" },
  { id: "viewer",   label: "Molecular Viewer" },
  { id: "solubility",  label: "Solubility Matrix" },
  { id: "molecule3d", label: "🧬 3D Viewer" },
  { id: "reactions",  label: "⚗ Reactions" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ChemToolkitSection({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("periodic");

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 58,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 24px",
          width: "100%",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#475569",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            cursor: "pointer",
            marginBottom: 28,
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono',monospace",
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Chemistry
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Fraunces',serif",
            color: "#111827",
            margin: 0,
            marginBottom: 10,
          }}
        >
          Chem Toolkit
        </h1>
        <p
          style={{
            fontSize: 15,
            fontFamily: "'Outfit',sans-serif",
            color: "#6b7280",
            margin: 0,
            maxWidth: 620,
          }}
        >
          Interactive reference tools — periodic table, molar mass calculator, 3D molecular viewer,
          and solubility matrix.
        </p>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginTop: 28,
            borderBottom: "2px solid #f3f4f6",
            flexWrap: "wrap",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                padding: "10px 18px",
                fontFamily: "'Outfit',sans-serif",
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#111827" : "#6b7280",
                cursor: "pointer",
                borderBottom: activeTab === tab.id ? "2px solid #111827" : "2px solid transparent",
                marginBottom: -2,
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 24px 0",
          width: "100%",
          flex: 1,
        }}
      >
        {activeTab === "periodic"   && <PeriodicTableTab />}
        {activeTab === "molar"      && <MolarMassTab />}
        {activeTab === "viewer"     && <MolecularViewerTab />}
        {activeTab === "solubility" && <SolubilityTab />}
        {activeTab === "molecule3d" && <Molecule3DTab />}
        {activeTab === "reactions"  && <ReactionsTab />}
      </div>
    </div>
  );
}
