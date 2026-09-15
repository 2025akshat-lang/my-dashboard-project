import { useState } from "react";
import { getUsers, addUser, removeUser, updateUser, AppUser } from "../config/users";

const pill = (color: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 100,
  fontSize: 11,
  fontWeight: 700,
  fontFamily: "'JetBrains Mono',monospace",
  background: color === "admin" ? "#fef3c7" : "#dcfce7",
  color: color === "admin" ? "#92400e" : "#166534",
});

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<AppUser[]>(getUsers);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "viewer" as const, note: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPwd, setEditPwd] = useState("");

  function refresh() { setUsers(getUsers()); }

  function handleAdd() {
    setError(""); setSuccess("");
    if (!form.email.trim() || !form.password.trim() || !form.name.trim()) {
      setError("Email, password, and name are required."); return;
    }
    if (form.password.length < 4) { setError("Password must be at least 4 characters."); return; }
    try {
      addUser({ email: form.email.trim(), password: form.password, name: form.name.trim(), role: "viewer", note: form.note.trim() });
      setForm({ email: "", password: "", name: "", role: "viewer", note: "" });
      setAdding(false);
      setSuccess("User added successfully.");
      refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error adding user.");
    }
  }

  function handleRemove(id: string, name: string) {
    if (!confirm(`Remove access for ${name}? They will no longer be able to log in.`)) return;
    removeUser(id); refresh();
    setSuccess(`${name} removed.`);
  }

  function handlePwdUpdate(id: string) {
    if (editPwd.length < 4) { setError("New password must be at least 4 characters."); return; }
    updateUser(id, { password: editPwd });
    setEditId(null); setEditPwd(""); setSuccess("Password updated."); refresh();
  }

  const inp: React.CSSProperties = {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px",
    fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 58 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Admin Only</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>User Access Management</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>
              Add viewer accounts so friends can browse the dashboard. Viewers cannot edit content — only you (admin) can.
            </p>
          </div>
          <button onClick={() => { setAdding(v => !v); setError(""); setSuccess(""); }}
            style={{ background: adding ? "#f1f5f9" : "#8b5cf6", color: adding ? "#64748b" : "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {adding ? "✕ Cancel" : "+ Add Viewer"}
          </button>
        </div>

        {/* Feedback */}
        {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#991b1b", fontFamily: "'Outfit',sans-serif", fontSize: 13, marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "10px 14px", color: "#166534", fontFamily: "'Outfit',sans-serif", fontSize: 13, marginBottom: 16 }}>{success}</div>}

        {/* Add form */}
        {adding && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>New Viewer Account</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>FULL NAME *</label>
                <input style={inp} placeholder="e.g. Rahul Verma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>NOTE / LABEL</label>
                <input style={inp} placeholder="e.g. College friend, Study group" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>EMAIL *</label>
                <input style={inp} type="email" placeholder="friend@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>PASSWORD *</label>
                <input style={inp} type="password" placeholder="Min 4 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#64748b" }}>
              Role: <strong>Viewer</strong> — Can browse all sections but cannot add, delete, or edit any content. Only you (admin) can do that.
            </div>
            <button onClick={handleAdd}
              style={{ background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 9, padding: "10px 24px", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Create Account →
            </button>
          </div>
        )}

        {/* Role legend */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b" }}>ROLES:</div>
          <span style={pill("admin")}>Admin — full editor access</span>
          <span style={pill("viewer")}>Viewer — read-only access</span>
        </div>

        {/* Hardcoded admin row */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 12, padding: "14px 18px", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", fontFamily: "'Outfit',sans-serif" }}>Akshat (You)</div>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>akshat@knowledgeos.dev</div>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'Outfit',sans-serif" }}>Owner · Admin</div>
            <span style={pill("admin")}>Admin</span>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>built-in</div>
          </div>
        </div>

        {/* User list */}
        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 12, border: "1px dashed #e2e8f0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, color: "#64748b", marginBottom: 6 }}>No viewer accounts yet</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>Click "+ Add Viewer" above to give a friend access.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.map(u => (
              <div key={u.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, padding: "14px 18px", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", fontFamily: "'Outfit',sans-serif" }}>
                      {u.name}
                      {u.note && <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8, fontWeight: 400 }}>({u.note})</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>{u.email}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>Added {u.addedAt}</div>
                  </div>
                  <span style={pill(u.role)}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditId(editId === u.id ? null : u.id); setEditPwd(""); setError(""); }}
                      style={{ background: "#f1f5f9", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontFamily: "'Outfit',sans-serif", cursor: "pointer", color: "#334155" }}>
                      {editId === u.id ? "Cancel" : "Edit pwd"}
                    </button>
                    <button onClick={() => handleRemove(u.id, u.name)}
                      style={{ background: "#fee2e2", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontFamily: "'Outfit',sans-serif", cursor: "pointer", color: "#dc2626" }}>
                      Remove
                    </button>
                  </div>
                </div>
                {editId === u.id && (
                  <div style={{ borderTop: "1px solid #f1f5f9", padding: "12px 18px", display: "flex", gap: 8, alignItems: "center", background: "#f8fafc" }}>
                    <input type="password" placeholder="New password (min 4 chars)" value={editPwd} onChange={e => setEditPwd(e.target.value)}
                      style={{ ...inp, width: "auto", flex: 1, fontSize: 13 }} />
                    <button onClick={() => handlePwdUpdate(u.id)}
                      style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 12, fontFamily: "'Outfit',sans-serif", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Update
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions box */}
        <div style={{ marginTop: 32, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 800, color: "#0369a1", marginBottom: 10 }}>How viewer access works</div>
          <ul style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#0369a1", lineHeight: 2, margin: 0, paddingLeft: 20 }}>
            <li>Viewers log in with their own email + password at the login screen</li>
            <li>They can open any section and view content</li>
            <li>Study Materials: viewers can browse but notes upload is yours only</li>
            <li>Future Projects: viewers see ideas but cannot add or delete</li>
            <li>Admin Panel is completely hidden from viewers</li>
            <li>To remove access, click "Remove" — they will be blocked on next login</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
