import { useState, useRef } from "react";
import {
  getLessonPlans,
  saveLessonPlan,
  deleteLessonPlan,
  getRubrics,
  saveRubric,
  deleteRubric,
  generateId,
  LessonPlan,
  Rubric,
  LessonActivity,
} from "../config/stemStore";

interface Props {
  onBack: () => void;
  isAdmin?: boolean;
}

// ── Colour helpers ─────────────────────────────────────────────────────────

const ORANGE = "#f97316";

const PHASE_COLORS: Record<LessonActivity["phase"], { bg: string; text: string }> = {
  Opening: { bg: "#dbeafe", text: "#1d4ed8" },
  "Direct Instruction": { bg: "#ede9fe", text: "#7c3aed" },
  "Guided Practice": { bg: "#dcfce7", text: "#16a34a" },
  "Independent Practice": { bg: "#ffedd5", text: "#ea580c" },
  Closure: { bg: "#f1f5f9", text: "#475569" },
};

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Excellent: { bg: "#dcfce7", text: "#15803d" },
  Proficient: { bg: "#dbeafe", text: "#1d4ed8" },
  Developing: { bg: "#fef9c3", text: "#a16207" },
  Beginning: { bg: "#fee2e2", text: "#b91c1c" },
};

// ── Shared UI atoms ────────────────────────────────────────────────────────

function Badge({ label, bg, text }: { label: string; bg: string; text: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: text,
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: 4,
      }}
    >
      {label}
    </span>
  );
}

function Btn({
  onClick,
  children,
  variant = "primary",
  small = false,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger" | "outline";
  small?: boolean;
  disabled?: boolean;
}) {
  const base: React.CSSProperties = {
    border: "none",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Outfit',sans-serif",
    fontWeight: 600,
    fontSize: small ? 12 : 13,
    padding: small ? "5px 12px" : "9px 18px",
    transition: "opacity 0.15s",
    opacity: disabled ? 0.5 : 1,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: ORANGE, color: "#fff" },
    ghost: { background: "transparent", color: "#64748b", border: "1px solid #e2e8f0" },
    danger: { background: "#fee2e2", color: "#b91c1c" },
    outline: { background: "transparent", color: ORANGE, border: `1px solid ${ORANGE}` },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: 12,
        fontWeight: 600,
        color: "#475569",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "8px 12px",
        fontFamily: "'Outfit',sans-serif",
        fontSize: 14,
        color: "#0f172a",
        outline: "none",
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "8px 12px",
        fontFamily: "'Outfit',sans-serif",
        fontSize: 13,
        color: "#0f172a",
        resize: "vertical",
        outline: "none",
      }}
    />
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ── Tab switcher ───────────────────────────────────────────────────────────

function Tabs({
  active,
  onChange,
  tabs,
}: {
  active: string;
  onChange: (t: string) => void;
  tabs: { id: string; label: string }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        background: "#f1f5f9",
        borderRadius: 10,
        padding: 4,
        marginBottom: 28,
        width: "fit-content",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            border: "none",
            borderRadius: 7,
            padding: "8px 20px",
            fontFamily: "'Outfit',sans-serif",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            background: active === t.id ? "#fff" : "transparent",
            color: active === t.id ? "#0f172a" : "#64748b",
            boxShadow: active === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LESSON PLANS TAB
// ═══════════════════════════════════════════════════════════════════════════

type LPMode = "list" | "view" | "edit" | "new";

function emptyPlan(): LessonPlan {
  return {
    id: "",
    title: "",
    subject: "",
    grade: "",
    objectives: [""],
    materials: [""],
    activities: [
      {
        id: generateId(),
        phase: "Opening",
        description: "",
        durationMinutes: 10,
      },
    ],
    assessment: "",
    standardsRef: "",
    createdAt: new Date().toISOString(),
  };
}

function LessonPlansTab({ isAdmin }: { isAdmin: boolean }) {
  const [plans, setPlans] = useState<LessonPlan[]>(() => getLessonPlans());
  const [selected, setSelected] = useState<LessonPlan | null>(null);
  const [mode, setMode] = useState<LPMode>("list");
  const [draft, setDraft] = useState<LessonPlan>(emptyPlan());

  function refresh() {
    setPlans(getLessonPlans());
  }

  function openNew() {
    setDraft(emptyPlan());
    setMode("new");
  }

  function openEdit(plan: LessonPlan) {
    setDraft({ ...plan, objectives: [...plan.objectives], materials: [...plan.materials], activities: plan.activities.map((a) => ({ ...a })) });
    setMode("edit");
  }

  function openView(plan: LessonPlan) {
    setSelected(plan);
    setMode("view");
  }

  function handleSave() {
    const toSave = mode === "new" ? { ...draft, id: generateId(), createdAt: new Date().toISOString() } : { ...draft };
    saveLessonPlan(toSave);
    refresh();
    setMode("list");
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this lesson plan?")) return;
    deleteLessonPlan(id);
    refresh();
    if (mode === "view") setMode("list");
  }

  // ── Draft helpers ──────────────────────────────────────────────────────

  function setDraftField<K extends keyof LessonPlan>(key: K, value: LessonPlan[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateStringList(field: "objectives" | "materials", idx: number, value: string) {
    setDraft((d) => {
      const list = [...d[field]];
      list[idx] = value;
      return { ...d, [field]: list };
    });
  }

  function addStringItem(field: "objectives" | "materials") {
    setDraft((d) => ({ ...d, [field]: [...d[field], ""] }));
  }

  function removeStringItem(field: "objectives" | "materials", idx: number) {
    setDraft((d) => ({ ...d, [field]: d[field].filter((_, i) => i !== idx) }));
  }

  function updateActivity(idx: number, key: keyof LessonActivity, value: string | number) {
    setDraft((d) => {
      const acts = d.activities.map((a, i) => (i === idx ? { ...a, [key]: value } : a));
      return { ...d, activities: acts };
    });
  }

  function addActivity() {
    setDraft((d) => ({
      ...d,
      activities: [...d.activities, { id: generateId(), phase: "Opening", description: "", durationMinutes: 10 }],
    }));
  }

  function removeActivity(idx: number) {
    setDraft((d) => ({ ...d, activities: d.activities.filter((_, i) => i !== idx) }));
  }

  // ── Render: List ──────────────────────────────────────────────────────

  if (mode === "list") {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>
            {plans.length} lesson plan{plans.length !== 1 ? "s" : ""}
          </p>
          {isAdmin && (
            <Btn onClick={openNew} variant="primary">
              + New Lesson Plan
            </Btn>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 16,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                {plan.title}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge label={plan.subject} bg="#ffedd5" text="#ea580c" />
                <Badge label={plan.grade} bg="#f1f5f9" text="#475569" />
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#94a3b8" }}>
                {plan.objectives.length} objective{plan.objectives.length !== 1 ? "s" : ""} · {plan.activities.length} activit{plan.activities.length !== 1 ? "ies" : "y"}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                <Btn onClick={() => openView(plan)} small variant="outline">
                  View
                </Btn>
                {isAdmin && (
                  <>
                    <Btn onClick={() => openEdit(plan)} small variant="ghost">
                      Edit
                    </Btn>
                    <Btn onClick={() => handleDelete(plan.id)} small variant="danger">
                      Delete
                    </Btn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Render: View ──────────────────────────────────────────────────────

  if (mode === "view" && selected) {
    return (
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <Btn onClick={() => setMode("list")} variant="ghost">
            ← Back to List
          </Btn>
          {isAdmin && (
            <Btn onClick={() => openEdit(selected)} variant="outline">
              Edit
            </Btn>
          )}
          <Btn onClick={() => window.print()} variant="outline">
            🖨 Print Layout
          </Btn>
        </div>

        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.1 }}>
          {selected.title}
        </h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <Badge label={selected.subject} bg="#ffedd5" text="#ea580c" />
          <Badge label={selected.grade} bg="#f1f5f9" text="#475569" />
        </div>

        {/* Objectives */}
        <Section title="Learning Objectives">
          <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            {selected.objectives.map((o, i) => (
              <li key={i} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                {o}
              </li>
            ))}
          </ol>
        </Section>

        {/* Materials */}
        <Section title="Materials">
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            {selected.materials.map((m, i) => (
              <li key={i} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                {m}
              </li>
            ))}
          </ul>
        </Section>

        {/* Activities table */}
        <Section title="Activities">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Phase", "Description", "Duration"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: "1px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.activities.map((act, i) => {
                  const col = PHASE_COLORS[act.phase];
                  return (
                    <tr key={act.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 14px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                        <Badge label={act.phase} bg={col.bg} text={col.text} />
                      </td>
                      <td style={{ padding: "10px 14px", color: "#334155", lineHeight: 1.55, verticalAlign: "top" }}>{act.description}</td>
                      <td style={{ padding: "10px 14px", verticalAlign: "top", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#64748b" }}>
                        {act.durationMinutes} min
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Assessment */}
        <Section title="Assessment Strategy">
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#334155", lineHeight: 1.6, margin: 0 }}>{selected.assessment}</p>
        </Section>

        {/* Standards */}
        <Section title="Standards Reference">
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#64748b", margin: 0 }}>{selected.standardsRef}</p>
        </Section>
      </div>
    );
  }

  // ── Render: New / Edit form ────────────────────────────────────────────

  const PHASES: LessonActivity["phase"][] = ["Opening", "Direct Instruction", "Guided Practice", "Independent Practice", "Closure"];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <Btn
          onClick={() => setMode("list")}
          variant="ghost"
        >
          ← Cancel
        </Btn>
      </div>

      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 24px" }}>
        {mode === "new" ? "New Lesson Plan" : "Edit Lesson Plan"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <FieldGroup label="Title">
          <Input value={draft.title} onChange={(v) => setDraftField("title", v)} placeholder="e.g. Chemical Reactions" />
        </FieldGroup>
        <FieldGroup label="Subject">
          <Input value={draft.subject} onChange={(v) => setDraftField("subject", v)} placeholder="e.g. Chemistry" />
        </FieldGroup>
        <FieldGroup label="Grade">
          <Input value={draft.grade} onChange={(v) => setDraftField("grade", v)} placeholder="e.g. Grade 9" />
        </FieldGroup>
      </div>

      {/* Objectives */}
      <FieldGroup label="Learning Objectives">
        {draft.objectives.map((obj, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <Input value={obj} onChange={(v) => updateStringList("objectives", i, v)} placeholder={`Objective ${i + 1}`} />
            {draft.objectives.length > 1 && (
              <button
                onClick={() => removeStringItem("objectives", i)}
                style={{ border: "none", background: "#fee2e2", color: "#b91c1c", borderRadius: 6, cursor: "pointer", padding: "0 10px", fontWeight: 700 }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Btn onClick={() => addStringItem("objectives")} small variant="ghost">
          + Add Objective
        </Btn>
      </FieldGroup>

      {/* Materials */}
      <FieldGroup label="Materials">
        {draft.materials.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <Input value={m} onChange={(v) => updateStringList("materials", i, v)} placeholder={`Material ${i + 1}`} />
            {draft.materials.length > 1 && (
              <button
                onClick={() => removeStringItem("materials", i)}
                style={{ border: "none", background: "#fee2e2", color: "#b91c1c", borderRadius: 6, cursor: "pointer", padding: "0 10px", fontWeight: 700 }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Btn onClick={() => addStringItem("materials")} small variant="ghost">
          + Add Material
        </Btn>
      </FieldGroup>

      {/* Activities */}
      <FieldGroup label="Activities">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {draft.activities.map((act, i) => (
            <div key={act.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#f8fafc" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <Label>Phase</Label>
                  <select
                    value={act.phase}
                    onChange={(e) => updateActivity(i, "phase", e.target.value as LessonActivity["phase"])}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "7px 10px",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 13,
                      color: "#0f172a",
                      background: "#fff",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {PHASES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: "0 0 auto" }}>
                  <Label>Duration (min)</Label>
                  <input
                    type="number"
                    value={act.durationMinutes}
                    onChange={(e) => updateActivity(i, "durationMinutes", Number(e.target.value))}
                    min={1}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "7px 10px",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 13,
                      width: 80,
                      outline: "none",
                    }}
                  />
                </div>
                {draft.activities.length > 1 && (
                  <div style={{ flex: "0 0 auto", display: "flex", alignItems: "flex-end" }}>
                    <Btn onClick={() => removeActivity(i)} small variant="danger">
                      Remove
                    </Btn>
                  </div>
                )}
              </div>
              <Label>Description</Label>
              <Textarea value={act.description} onChange={(v) => updateActivity(i, "description", v)} placeholder="Describe this activity..." rows={2} />
            </div>
          ))}
          <div>
            <Btn onClick={addActivity} small variant="ghost">
              + Add Activity
            </Btn>
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="Assessment Strategy">
        <Textarea value={draft.assessment} onChange={(v) => setDraftField("assessment", v)} placeholder="Describe formative and summative assessment..." rows={3} />
      </FieldGroup>

      <FieldGroup label="Standards Reference">
        <Input value={draft.standardsRef} onChange={(v) => setDraftField("standardsRef", v)} placeholder="e.g. NGSS HS-PS1-7" />
      </FieldGroup>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn onClick={handleSave} variant="primary">
          Save Lesson Plan
        </Btn>
        <Btn onClick={() => setMode("list")} variant="ghost">
          Cancel
        </Btn>
      </div>
    </div>
  );
}

// ── Reusable section block for view mode ───────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          color: ORANGE,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RUBRIC BUILDER TAB
// ═══════════════════════════════════════════════════════════════════════════

type RBMode = "list" | "view" | "edit" | "new";

const LEVELS = ["Excellent", "Proficient", "Developing", "Beginning"] as const;
const LEVEL_SCORES = [4, 3, 2, 1] as const;

function emptyRubric(): Rubric {
  return {
    id: "",
    title: "",
    subject: "",
    totalPoints: 100,
    createdAt: new Date().toISOString(),
    criteria: [
      {
        id: generateId(),
        criterion: "",
        weight: 100,
        levels: LEVELS.map((label, i) => ({ label, score: LEVEL_SCORES[i], descriptor: "" })),
      },
    ],
  };
}

function RubricBuilderTab({ isAdmin }: { isAdmin: boolean }) {
  const [rubrics, setRubrics] = useState<Rubric[]>(() => getRubrics());
  const [selected, setSelected] = useState<Rubric | null>(null);
  const [mode, setMode] = useState<RBMode>("list");
  const [draft, setDraft] = useState<Rubric>(emptyRubric());
  // For weighted score calculator in view mode
  const [selectedLevels, setSelectedLevels] = useState<Record<string, number>>({});

  function refresh() {
    setRubrics(getRubrics());
  }

  function openNew() {
    setDraft(emptyRubric());
    setMode("new");
  }

  function openEdit(r: Rubric) {
    setDraft({
      ...r,
      criteria: r.criteria.map((c) => ({ ...c, levels: c.levels.map((l) => ({ ...l })) })),
    });
    setMode("edit");
  }

  function openView(r: Rubric) {
    setSelected(r);
    setSelectedLevels({});
    setMode("view");
  }

  function handleSave() {
    const totalWeight = draft.criteria.reduce((s, c) => s + c.weight, 0);
    if (totalWeight !== 100) {
      alert(`Weights must sum to 100. Currently: ${totalWeight}`);
      return;
    }
    const toSave = mode === "new" ? { ...draft, id: generateId(), createdAt: new Date().toISOString() } : { ...draft };
    saveRubric(toSave);
    refresh();
    setMode("list");
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this rubric?")) return;
    deleteRubric(id);
    refresh();
    if (mode === "view") setMode("list");
  }

  function exportAsText(r: Rubric) {
    let text = `${r.title}\nSubject: ${r.subject}\nTotal Points: ${r.totalPoints}\n\n`;
    r.criteria.forEach((c) => {
      text += `Criterion: ${c.criterion} (Weight: ${c.weight}%)\n`;
      c.levels.forEach((l) => {
        text += `  ${l.label} (${l.score}): ${l.descriptor}\n`;
      });
      text += "\n";
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, "_")}_rubric.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Draft helpers
  function setCriterionField(idx: number, key: keyof (typeof draft.criteria)[0], value: string | number) {
    setDraft((d) => ({
      ...d,
      criteria: d.criteria.map((c, i) => (i === idx ? { ...c, [key]: value } : c)),
    }));
  }

  function setLevelDescriptor(cIdx: number, lIdx: number, value: string) {
    setDraft((d) => ({
      ...d,
      criteria: d.criteria.map((c, i) =>
        i === cIdx
          ? { ...c, levels: c.levels.map((l, j) => (j === lIdx ? { ...l, descriptor: value } : l)) }
          : c
      ),
    }));
  }

  function addCriterion() {
    setDraft((d) => ({
      ...d,
      criteria: [
        ...d.criteria,
        {
          id: generateId(),
          criterion: "",
          weight: 0,
          levels: LEVELS.map((label, i) => ({ label, score: LEVEL_SCORES[i], descriptor: "" })),
        },
      ],
    }));
  }

  function removeCriterion(idx: number) {
    setDraft((d) => ({ ...d, criteria: d.criteria.filter((_, i) => i !== idx) }));
  }

  // ── Weighted score for view mode ───────────────────────────────────────

  function calcWeightedScore(r: Rubric) {
    let score = 0;
    r.criteria.forEach((c) => {
      const lvl = selectedLevels[c.id];
      if (lvl !== undefined) {
        score += (lvl / 4) * c.weight;
      }
    });
    return score.toFixed(1);
  }

  // ── List ──────────────────────────────────────────────────────────────

  if (mode === "list") {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>
            {rubrics.length} rubric{rubrics.length !== 1 ? "s" : ""}
          </p>
          {isAdmin && (
            <Btn onClick={openNew} variant="primary">
              + New Rubric
            </Btn>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {rubrics.map((r) => (
            <div
              key={r.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                {r.title}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge label={r.subject} bg="#ffedd5" text="#ea580c" />
                <Badge label={`${r.totalPoints} pts`} bg="#f1f5f9" text="#475569" />
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#94a3b8" }}>
                {r.criteria.length} criterion{r.criteria.length !== 1 ? "a" : ""}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                <Btn onClick={() => openView(r)} small variant="outline">
                  View
                </Btn>
                {isAdmin && (
                  <>
                    <Btn onClick={() => openEdit(r)} small variant="ghost">
                      Edit
                    </Btn>
                    <Btn onClick={() => handleDelete(r.id)} small variant="danger">
                      Delete
                    </Btn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── View ──────────────────────────────────────────────────────────────

  if (mode === "view" && selected) {
    const allSelected = selected.criteria.every((c) => selectedLevels[c.id] !== undefined);
    return (
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <Btn onClick={() => setMode("list")} variant="ghost">
            ← Back to List
          </Btn>
          <Btn onClick={() => exportAsText(selected)} variant="outline">
            Export as Text
          </Btn>
          {isAdmin && (
            <Btn onClick={() => openEdit(selected)} variant="outline">
              Edit
            </Btn>
          )}
        </div>

        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(18px,3vw,28px)", fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
          {selected.title}
        </h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <Badge label={selected.subject} bg="#ffedd5" text="#ea580c" />
          <Badge label={`${selected.totalPoints} total points`} bg="#f1f5f9" text="#475569" />
        </div>

        {/* Rubric table */}
        <div style={{ overflowX: "auto", marginBottom: 28 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: "10px 14px", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e2e8f0", minWidth: 140 }}>
                  Criterion
                </th>
                {LEVELS.map((l, i) => {
                  const col = LEVEL_COLORS[l];
                  return (
                    <th
                      key={l}
                      style={{
                        textAlign: "center",
                        padding: "10px 14px",
                        borderBottom: "1px solid #e2e8f0",
                        minWidth: 160,
                      }}
                    >
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Badge label={l} bg={col.bg} text={col.text} />
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8" }}>
                          ({LEVEL_SCORES[i]})
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th style={{ textAlign: "center", padding: "10px 14px", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {selected.criteria.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                    <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>{c.criterion}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8" }}>
                      Weight: {c.weight}%
                    </div>
                  </td>
                  {c.levels.map((lv, li) => {
                    const col = LEVEL_COLORS[lv.label];
                    const isChosen = selectedLevels[c.id] === lv.score;
                    return (
                      <td
                        key={li}
                        onClick={() =>
                          setSelectedLevels((prev) =>
                            prev[c.id] === lv.score ? { ...prev, [c.id]: -1 } : { ...prev, [c.id]: lv.score }
                          )
                        }
                        style={{
                          padding: "12px 14px",
                          verticalAlign: "top",
                          cursor: "pointer",
                          background: isChosen ? col.bg : "transparent",
                          transition: "background 0.12s",
                          outline: isChosen ? `2px solid ${col.text}` : "none",
                          outlineOffset: -2,
                        }}
                      >
                        <div style={{ color: "#334155", lineHeight: 1.55 }}>{lv.descriptor}</div>
                      </td>
                    );
                  })}
                  <td style={{ padding: "12px 14px", textAlign: "center", verticalAlign: "top" }}>
                    {selectedLevels[c.id] !== undefined && selectedLevels[c.id] !== -1 ? (
                      <Badge
                        label={`${((selectedLevels[c.id] / 4) * c.weight).toFixed(1)}`}
                        bg="#ffedd5"
                        text="#ea580c"
                      />
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: 11 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Weighted score calculator */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              Weighted Score
            </div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
              {allSelected ? `${calcWeightedScore(selected)}%` : "—"}
            </div>
          </div>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>
            Click a descriptor in each row to select a level. The weighted score will be calculated automatically.
          </p>
        </div>
      </div>
    );
  }

  // ── New / Edit form ────────────────────────────────────────────────────

  const totalWeight = draft.criteria.reduce((s, c) => s + c.weight, 0);
  const weightOk = totalWeight === 100;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <Btn onClick={() => setMode("list")} variant="ghost">
          ← Cancel
        </Btn>
      </div>

      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 24px" }}>
        {mode === "new" ? "New Rubric" : "Edit Rubric"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <FieldGroup label="Title">
          <Input value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} placeholder="e.g. Lab Report Rubric" />
        </FieldGroup>
        <FieldGroup label="Subject">
          <Input value={draft.subject} onChange={(v) => setDraft((d) => ({ ...d, subject: v }))} placeholder="e.g. Science" />
        </FieldGroup>
      </div>

      {/* Criteria */}
      <FieldGroup label="Criteria">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {draft.criteria.map((c, ci) => (
            <div key={c.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, background: "#f8fafc" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <Label>Criterion Name</Label>
                  <Input value={c.criterion} onChange={(v) => setCriterionField(ci, "criterion", v)} placeholder="e.g. Introduction" />
                </div>
                <div style={{ flex: "0 0 auto" }}>
                  <Label>Weight (%)</Label>
                  <input
                    type="number"
                    value={c.weight}
                    onChange={(e) => setCriterionField(ci, "weight", Number(e.target.value))}
                    min={0}
                    max={100}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "7px 10px",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 13,
                      width: 80,
                      outline: "none",
                    }}
                  />
                </div>
                {draft.criteria.length > 1 && (
                  <Btn onClick={() => removeCriterion(ci)} small variant="danger">
                    Remove
                  </Btn>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
                {c.levels.map((lv, li) => {
                  const col = LEVEL_COLORS[lv.label];
                  return (
                    <div key={li}>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          color: col.text,
                          background: col.bg,
                          borderRadius: 4,
                          padding: "2px 8px",
                          display: "inline-block",
                          marginBottom: 6,
                        }}
                      >
                        {lv.label} ({lv.score})
                      </div>
                      <Textarea
                        value={lv.descriptor}
                        onChange={(v) => setLevelDescriptor(ci, li, v)}
                        placeholder={`Describe ${lv.label} performance...`}
                        rows={3}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Btn onClick={addCriterion} small variant="ghost">
              + Add Criterion
            </Btn>
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
                color: weightOk ? "#16a34a" : "#dc2626",
                fontWeight: 700,
              }}
            >
              Weights total: {totalWeight}% {weightOk ? "✓" : `(need 100%)`}
            </span>
          </div>
        </div>
      </FieldGroup>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn onClick={handleSave} variant="primary" disabled={!weightOk}>
          Save Rubric
        </Btn>
        <Btn onClick={() => setMode("list")} variant="ghost">
          Cancel
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

type DrawTool = "pen" | "eraser" | "line" | "rect";

function WhiteboardTab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawTool>("pen");
  const [color, setColor] = useState("#1e293b");
  const [lineWidth, setLineWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const snapRef = useRef<ImageData | null>(null);

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const saveHistory = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory((h) => [...h.slice(-29), data]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    saveHistory();
    const pos = getPos(e);
    startPos.current = pos;
    snapRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawing(true);
    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineWidth = tool === "eraser" ? lineWidth * 4 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if ((tool === "line" || tool === "rect") && snapRef.current && startPos.current) {
      ctx.putImageData(snapRef.current, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (tool === "line") {
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else {
        const w = pos.x - startPos.current.x;
        const h = pos.y - startPos.current.y;
        ctx.strokeRect(startPos.current.x, startPos.current.y, w, h);
      }
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    startPos.current = null;
    snapRef.current = null;
    getCtx()?.beginPath();
  };

  const undo = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current || history.length === 0) return;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory((h) => h.slice(0, -1));
  };

  const clear = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    saveHistory();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const TOOLS: { id: DrawTool; label: string }[] = [
    { id: "pen", label: "✏️ Pen" },
    { id: "eraser", label: "⬜ Eraser" },
    { id: "line", label: "╱ Line" },
    { id: "rect", label: "▭ Rect" },
  ];

  const PRESET_COLORS = ["#1e293b", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#ffffff"];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        padding: "12px 16px", background: "#f8fafc", border: "1px solid #e5e7eb",
        borderRadius: "12px 12px 0 0", borderBottom: "none",
      }}>
        {/* Tools */}
        <div style={{ display: "flex", gap: 6 }}>
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => setTool(t.id)} style={{
              padding: "6px 14px", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600,
              background: tool === t.id ? "#1e293b" : "#fff",
              color: tool === t.id ? "#fff" : "#374151",
              border: `1.5px solid ${tool === t.id ? "#1e293b" : "#e5e7eb"}`,
            }}>{t.label}</button>
          ))}
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />
        {/* Colors */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {PRESET_COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} style={{
              width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer",
              border: color === c ? "3px solid #6366f1" : "2px solid #e5e7eb",
              boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #d1d5db" : undefined,
            }} />
          ))}
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
            style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e5e7eb", cursor: "pointer", padding: 2, background: "none" }} />
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />
        {/* Stroke width */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280" }}>Size</span>
          <input type="range" min={1} max={24} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} style={{ width: 80 }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#374151", minWidth: 20 }}>{lineWidth}</span>
        </div>
        {/* Actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={undo} disabled={history.length === 0} style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", opacity: history.length === 0 ? 0.4 : 1 }}>↩ Undo</button>
          <button onClick={clear} style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, background: "#fff", color: "#ef4444", border: "1.5px solid #fca5a5" }}>✕ Clear</button>
          <button onClick={download} style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, background: "#1e293b", color: "#fff", border: "none" }}>⬇ Save PNG</button>
        </div>
      </div>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={620}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: "block", width: "100%", height: 620,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "0 0 12px 12px",
          cursor: tool === "eraser" ? "cell" : "crosshair",
          touchAction: "none",
        }}
      />
      <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
        Whiteboard canvas · 1200×620 · Undo history: {history.length}/30 steps
      </div>
    </div>
  );
}

// ── Slide Deck Builder ────────────────────────────────────────────────────────
const SLIDE_KEY = "knowledgeos_slides_v1";

interface Slide {
  id: string;
  title: string;
  body: string;
  bg: string;
  accent: string;
  layout: "title" | "content" | "split" | "blank";
}

const SEED_SLIDES: Slide[] = [
  { id: "s1", title: "Welcome to KnowledgeOS", body: "A modular educational dashboard\n\n• Chemistry Toolkit\n• Govt Exam Prep\n• Code Snippets\n• STEM Classroom", bg: "#1a1a2e", accent: "#6366f1", layout: "title" },
  { id: "s2", title: "Learning Objectives", body: "By the end of this session, students will be able to:\n\n1. Understand key concepts\n2. Apply critical thinking\n3. Solve real-world problems\n4. Collaborate effectively", bg: "#ffffff", accent: "#3b82f6", layout: "content" },
  { id: "s3", title: "Key Formula", body: "$$E = mc^2$$\n\nEinstein's mass-energy equivalence:\n- E = Energy (Joules)\n- m = Mass (kg)\n- c = Speed of light (3×10⁸ m/s)", bg: "#f0fdf4", accent: "#22c55e", layout: "content" },
];

const loadSlides = (): Slide[] => { try { const s = localStorage.getItem(SLIDE_KEY); return s ? JSON.parse(s) : SEED_SLIDES; } catch { return SEED_SLIDES; } };
const saveSlides = (slides: Slide[]) => { try { localStorage.setItem(SLIDE_KEY, JSON.stringify(slides)); } catch {} };
const genSlideId = () => "sl-" + Date.now().toString(36);

const BG_PRESETS = ["#ffffff","#0f172a","#1a1a2e","#f0f9ff","#f0fdf4","#fef9c3","#fdf4ff","#fff1f2","#1e293b","#18181b"];
const ACCENT_PRESETS = ["#6366f1","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899","#f97316","#06b6d4","#ffffff"];

function SlidePreview({ slide, scale = 1 }: { slide: Slide; scale?: number }) {
  const isDark = ["#0f172a","#1a1a2e","#1e293b","#18181b"].includes(slide.bg);
  const textColor = isDark ? "#f1f5f9" : "#1a1a2e";
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const lines = slide.body.split("\n");

  return (
    <div style={{
      width: 640 * scale, height: 360 * scale, background: slide.bg, borderRadius: 8 * scale,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
      padding: 56 * scale, boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 8 * scale, height: "100%", background: slide.accent, borderRadius: `${8 * scale}px 0 0 ${8 * scale}px` }} />
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 32 * scale, fontWeight: 800, color: textColor, margin: `0 0 ${16 * scale}px`, lineHeight: 1.2 }}>
        {slide.title}
      </h2>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15 * scale, color: subColor, lineHeight: 1.7, whiteSpace: "pre-line", maxWidth: "100%" }}>
        {lines.map((l, i) => {
          if (l.startsWith("$$") && l.endsWith("$$")) {
            return <div key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18 * scale, color: slide.accent, fontWeight: 700 }}>{l.slice(2, -2)}</div>;
          }
          if (l.startsWith("• ") || l.match(/^\d+\./)) {
            return <div key={i} style={{ paddingLeft: 8 * scale }}>{l}</div>;
          }
          return <div key={i}>{l || <br />}</div>;
        })}
      </div>
    </div>
  );
}

function SlideDeckTab() {
  const [slides, setSlides] = useState<Slide[]>(loadSlides);
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<"edit" | "present">("edit");

  const cur = slides[selected] ?? slides[0];

  const update = (patch: Partial<Slide>) => {
    setSlides(prev => {
      const next = prev.map((s, i) => i === selected ? { ...s, ...patch } : s);
      saveSlides(next);
      return next;
    });
  };

  const addSlide = () => {
    const ns: Slide = { id: genSlideId(), title: "New Slide", body: "Add your content here...", bg: "#ffffff", accent: "#6366f1", layout: "content" };
    setSlides(prev => { const n = [...prev, ns]; saveSlides(n); return n; });
    setSelected(slides.length);
  };

  const deleteSlide = (i: number) => {
    if (slides.length === 1) return;
    if (!window.confirm("Delete this slide?")) return;
    setSlides(prev => { const n = prev.filter((_, j) => j !== i); saveSlides(n); return n; });
    setSelected(Math.max(0, i - 1));
  };

  const moveSlide = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    setSlides(prev => {
      const n = [...prev];
      [n[i], n[j]] = [n[j], n[i]];
      saveSlides(n);
      return n;
    });
    setSelected(j);
  };

  const printWorksheet = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
<title>Worksheet</title>
<style>
  body { font-family: 'Georgia', serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; }
  h1 { font-size: 28px; border-bottom: 3px solid #1a1a2e; padding-bottom: 8px; }
  .slide { page-break-inside: avoid; margin-bottom: 32px; }
  .slide h2 { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
  .slide p { font-size: 14px; line-height: 1.8; margin-bottom: 8px; color: #374151; }
  .answer-line { border-bottom: 1px solid #d1d5db; height: 28px; margin: 8px 0; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<h1>Worksheet</h1>
<p style="font-size:13px;color:#6b7280;">Date: _______________ &nbsp;&nbsp; Name: _______________</p>
${slides.map((s, i) => `<div class="slide">
  <h2>Section ${i+1}: ${s.title}</h2>
  <p>${s.body.replace(/\n/g, "<br/>")}</p>
  <p><strong>Answer:</strong></p>
  <div class="answer-line"></div>
  <div class="answer-line"></div>
  <div class="answer-line"></div>
</div>`).join("")}
</body>
</html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  // Present mode (full-screen)
  if (mode === "present") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SlidePreview slide={cur} scale={1.4} />
        <div style={{ position: "fixed", bottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => setSelected(i => Math.max(0, i - 1))} disabled={selected === 0}
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 18, opacity: selected === 0 ? 0.3 : 1 }}>←</button>
          <span style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{selected + 1} / {slides.length}</span>
          <button onClick={() => setSelected(i => Math.min(slides.length - 1, i + 1))} disabled={selected === slides.length - 1}
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 18, opacity: selected === slides.length - 1 ? 0.3 : 1 }}>→</button>
          <button onClick={() => setMode("edit")}
            style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✕ Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 0, height: "78vh", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      {/* Left: Slide List */}
      <div style={{ width: 200, borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", background: "#f8fafc", flexShrink: 0 }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", display: "flex", gap: 6 }}>
          <button onClick={addSlide}
            style={{ flex: 1, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, padding: "6px 0", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            + Slide
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {slides.map((s, i) => (
            <div key={s.id} onClick={() => setSelected(i)}
              style={{ padding: "8px 10px", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.06)", background: selected === i ? "#e0e7ff" : "transparent", transition: "background 0.1s" }}>
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "#9ca3af", marginBottom: 4 }}>Slide {i + 1}</div>
              <div style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", color: "#1a1a2e", fontWeight: 600, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title || "(untitled)"}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <button onClick={e => { e.stopPropagation(); moveSlide(i, -1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12, padding: "1px 4px" }}>↑</button>
                <button onClick={e => { e.stopPropagation(); moveSlide(i, 1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12, padding: "1px 4px" }}>↓</button>
                <button onClick={e => { e.stopPropagation(); deleteSlide(i); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 12, padding: "1px 4px", marginLeft: "auto" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px", borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={() => setMode("present")}
            style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, padding: "7px 0", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ▶ Present
          </button>
          <button onClick={printWorksheet}
            style={{ background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 0", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            🖨 Worksheet
          </button>
        </div>
      </div>

      {/* Center: Preview */}
      <div style={{ flex: 1, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, flexDirection: "column", gap: 16 }}>
        <SlidePreview slide={cur} scale={0.85} />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setSelected(i => Math.max(0, i - 1))} disabled={selected === 0}
            style={{ background: "rgba(255,255,255,0.1)", color: "#94a3b8", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 16, opacity: selected === 0 ? 0.3 : 1 }}>←</button>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#64748b" }}>{selected + 1} / {slides.length}</span>
          <button onClick={() => setSelected(i => Math.min(slides.length - 1, i + 1))} disabled={selected === slides.length - 1}
            style={{ background: "rgba(255,255,255,0.1)", color: "#94a3b8", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 16, opacity: selected === slides.length - 1 ? 0.3 : 1 }}>→</button>
        </div>
      </div>

      {/* Right: Editor */}
      {cur && (
        <div style={{ width: 280, borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", background: "#fff", flexShrink: 0, overflow: "auto" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e7eb", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Edit Slide {selected + 1}
          </div>
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Title</div>
              <input value={cur.title} onChange={e => update({ title: e.target.value })}
                style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700, color: "#1a1a2e", outline: "none" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Content (use $$formula$$ for math)</div>
              <textarea value={cur.body} onChange={e => update({ body: e.target.value })} rows={8}
                style={{ width: "100%", resize: "vertical", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#374151", lineHeight: 1.6, outline: "none" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 8 }}>Background</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {BG_PRESETS.map(c => (
                  <button key={c} onClick={() => update({ bg: c })}
                    style={{ width: 26, height: 26, borderRadius: 6, background: c, cursor: "pointer", border: cur.bg === c ? "3px solid #6366f1" : "2px solid #e5e7eb", boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #d1d5db" : undefined }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b7280", marginBottom: 8 }}>Accent Color</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ACCENT_PRESETS.map(c => (
                  <button key={c} onClick={() => update({ accent: c })}
                    style={{ width: 26, height: 26, borderRadius: 6, background: c, cursor: "pointer", border: cur.accent === c ? "3px solid #374151" : "2px solid #e5e7eb", boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #d1d5db" : undefined }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StemClassroomSection({ onBack, isAdmin = false }: Props) {
  const [activeTab, setActiveTab] = useState("lessons");

  return (
    <div style={{ minHeight: "100vh", paddingTop: 58, background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px", width: "100%", boxSizing: "border-box" }}>
        {/* Back button */}
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
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: ORANGE,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Section · STEM Classroom
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: "clamp(26px,4vw,42px)",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 8px",
              lineHeight: 1.05,
            }}
          >
            STEM Classroom Studio
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>
            Design lesson plans, build assessment rubrics, and manage your STEM curriculum.
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "lessons", label: "Lesson Plans" },
            { id: "rubrics", label: "Rubric Builder" },
            { id: "whiteboard", label: "🎨 Whiteboard" },
            { id: "slides", label: "📊 Slide Deck" },
          ]}
        />

        {/* Tab content */}
        {activeTab === "lessons" && <LessonPlansTab isAdmin={isAdmin} />}
        {activeTab === "rubrics" && <RubricBuilderTab isAdmin={isAdmin} />}
        {activeTab === "whiteboard" && <WhiteboardTab />}
        {activeTab === "slides" && <SlideDeckTab />}
      </div>
    </div>
  );
}
