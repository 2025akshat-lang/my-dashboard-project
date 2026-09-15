import { useState, useEffect, useRef } from "react";
import { PERSONAL_CREDENTIALS } from "./config";
import { findUser } from "./config/users";

interface Props {
  onLogin: (name: string, role?: "admin" | "viewer") => void;
}

// ─── Matrix Canvas ────────────────────────────────────────────────────────────
function MatrixCanvas({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!visible) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const fontSize = 14;
    let drops: number[] = [];
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.floor(canvas.width / fontSize) }, () =>
        Math.floor(Math.random() * canvas.height / fontSize)
      );
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((d, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, d * fontSize);
        if (d * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [visible]);

  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none", opacity: visible ? 0.18 : 0, transition: "opacity 0.5s",
    }} />
  );
}

// ─── Skull SVG ────────────────────────────────────────────────────────────────
function SkullSVG({ denied }: { denied: boolean }) {
  const eyeFill = denied ? "#ff2222" : "#baff00";
  const eyeFilter = denied
    ? "drop-shadow(0 0 6px #ff0000) drop-shadow(0 0 14px #ff0000)"
    : "drop-shadow(0 0 4px #baff00) drop-shadow(0 0 10px #baff00)";
  const glow1 = denied ? "#ff0000" : "#9aff2a";
  return (
    <svg className="skull" viewBox="0 0 330 380" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 240, height: 270, overflow: "visible" }}>
      <defs>
        <path id="textPath" d="M 28 50 Q 165 -6 302 50" fill="none" />
        <radialGradient id="skullGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={glow1} stopOpacity=".28" />
          <stop offset="55%" stopColor={glow1} stopOpacity=".08" />
          <stop offset="100%" stopColor={glow1} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="165" cy="150" rx="160" ry="160" fill="url(#skullGlow)" />
      <text fill="#ffffff" fontSize="42" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="13">
        <textPath href="#textPath" startOffset="55%" textAnchor="middle">BRAIN</textPath>
      </text>
      {/* Skull outline */}
      <path className="bone" strokeWidth="7" stroke="#f3f3f3" strokeLinecap="round" strokeLinejoin="round" fill="none"
        d="M45 145 L40 100 Q42 38 165 28 Q288 38 290 100 L285 145" />
      <path stroke="#cfcfcf" strokeWidth="1.8" strokeLinecap="round" fill="none"
        d="M55 104 Q75 53 165 47 Q255 53 275 104" />
      <path stroke="#cfcfcf" strokeWidth="1.8" strokeLinecap="round" fill="none"
        d="M70 82 Q110 45 165 43 Q220 45 260 82" />
      <path stroke="#f3f3f3" strokeWidth="6" strokeLinecap="round" fill="none"
        d="M43 91 Q26 98 28 120 L33 176 Q34 200 58 205 L78 193 L71 103 Z" />
      <path stroke="#cfcfcf" strokeWidth="1.8" strokeLinecap="round" fill="none"
        d="M47 108 L52 181 L67 188" />
      <path stroke="#f3f3f3" strokeWidth="6" strokeLinecap="round" fill="none"
        d="M287 91 Q304 98 302 120 L297 176 Q296 200 272 205 L252 193 L259 103 Z" />
      <path stroke="#cfcfcf" strokeWidth="1.8" strokeLinecap="round" fill="none"
        d="M283 108 L278 181 L263 188" />
      <path stroke="#cfcfcf" strokeWidth="1.8" strokeLinecap="round" fill="none"
        d="M42 127 L59 113 M44 142 L62 127 M288 127 L271 113 M286 142 L268 127" />
      {/* Cranium */}
      <path fill="#050607" stroke="#f2f2f2" strokeWidth="4"
        d="M78 105 Q73 74 96 57 Q120 39 175 40 Q210 39 234 57 Q267 74 252 105 L247 178 Q242 198 225 216 Q200 248 165 239 Q130 238 105 216 Q98 198 83 168 Z" />
      <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M90 91 Q128 61 137 55" />
      <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M240 91 Q222 61 193 55" />
      <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M101 76 Q125 55 165 53 Q205 55 229 76" />
      <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M91 106 Q110 82 132 80" />
      <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M239 106 Q220 82 198 80" />
      {/* Eyes */}
      <path id="eyes" fill={eyeFill} stroke="#efff9a" strokeWidth="2"
        style={{ filter: eyeFilter, transition: "fill .35s, filter .35s" }}
        d="M79 102 Q100 86 130 88 Q155 91 165 100 Q175 91 200 88 Q230 86 251 102 Q258 118 242 133 Q220 140 200 128 Q182 117 165 109 Q148 117 130 128 Q110 140 88 133 Q72 118 79 102 Z" />
      <path d="M90 100 Q112 90 132 96" stroke="#202500" strokeWidth="1.5" fill="none" />
      <path d="M240 100 Q218 90 198 96" stroke="#202500" strokeWidth="2.5" fill="none" />
      <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M142 102 L148 139 M188 122 L182 139" />
      <path d="M164.3 121 L165.7 121 L165.7 131 C162.7 131 160.5 133.3 160.5 136.3 L159 140.8 C156.8 143 153 144.5 152.2 147.5 C151.5 149 153.8 149.8 165 149.8 C176.2 149.8 178.5 149 177.8 147.5 C177 144.5 173.2 143 171 140.8 L169.5 136.3 C169.5 133.3 167.3 131 164.3 131 Z"
        fill="#f5f5f5" stroke="#fff" strokeWidth="2" />
      {/* Upper jaw */}
      <g>
        <path fill="#050607" stroke="#f2f2f2" strokeWidth="3.5"
          d="M83 168 Q90 195 105 216 L135 220 Q165 226 195 220 L225 216 Q240 195 247 168 Q205 180 165 180 Q125 180 83 168 Z" />
        {["M102 168 L111 171 L111 187 L103 185 Z","M113 171 L123 174 L123 189 L114 187 Z","M125 174 L135 176 L135 191 L126 189 Z","M137 176 L148 178 L148 193 L138 192 Z","M150 178 L160 179 L160 194 L151 194 Z","M170 179 L180 178 L180 194 L171 194 Z","M182 178 L193 176 L193 193 L183 192 Z","M195 176 L205 174 L205 191 L196 189 Z","M207 174 L217 171 L217 189 L208 187 Z","M219 171 L228 168 L227 185 L220 185 Z"]
          .map((d, i) => <path key={i} fill="#eeeeee" stroke="#111" strokeWidth="1.7" d={d} />)}
      </g>
      {/* Lower jaw — animated */}
      <g style={{ animation: "jawChatter 3.2s infinite linear", transformBox: "fill-box", transformOrigin: "center top" }}>
        <path fill="#050607" stroke="#f2f2f2" strokeWidth="3.5"
          d="M95 188 Q100 222 130 236 Q165 247 200 236 Q230 222 235 188 Q200 204 165 204 Q130 204 95 188 Z" />
        {["M104 188 L113 190 L113 204 L105 202 Z","M115 191 L124 193 L124 207 L116 205 Z","M126 193 L136 195 L136 209 L127 208 Z","M138 195 L148 196 L148 210 L139 209 Z","M150 196 L160 197 L160 211 L151 211 Z","M170 197 L180 196 L180 211 L171 211 Z","M182 196 L192 195 L192 210 L183 209 Z","M194 195 L204 193 L204 209 L195 208 Z","M206 193 L215 191 L215 207 L207 205 Z","M217 190 L226 188 L225 204 L218 202 Z"]
          .map((d, i) => <path key={i} fill="#eeeeee" stroke="#111" strokeWidth="1.7" d={d} />)}
        <path stroke="#cfcfcf" strokeWidth="1.8" fill="none" d="M102 208 Q165 232 228 208" />
      </g>
    </svg>
  );
}

// ─── Boot Sequence ────────────────────────────────────────────────────────────
const BOOT_LINES = [
  "[BRAIN_OS] Initializing neural mainframe...",
  "[CHECK] Hardware interface .............. OK",
  "[CHECK] Memory integrity ................ OK",
  "[CHECK] Network topology ................ ONLINE",
  "[CHECK] Encryption layer ................ ACTIVE",
  "[CHECK] Global relay nodes .............. CONNECTED",
  "[CHECK] Knowledge collections ........... LOADED",
  "",
  ">> OPERATOR AUTHENTICATED",
  ">> SESSION ESTABLISHED",
  ">> WELCOME TO KNOWLEDGEOS",
];

function BootScreen({ onDone }: { onDone: () => void }) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
      for (const line of BOOT_LINES) {
        if (cancelled) return;
        for (const ch of line) {
          if (cancelled) return;
          setOutput((p) => p + ch);
          await wait(line.includes("WELCOME") ? 18 : 5);
        }
        setOutput((p) => p + "\n");
        await wait(40);
      }
      await wait(500);
      if (!cancelled) setDone(true);
    };
    run();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { if (done) onDone(); }, [done, onDone]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(850px,100%)", fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,2vw,15px)", lineHeight: 1.7, color: "#00ff88" }}>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{output}</pre>
        <span style={{ display: "inline-block", width: 9, height: 16, background: "#00ff88", animation: "cursorBlink .7s infinite", verticalAlign: "text-bottom" }} />
      </div>
    </div>
  );
}

// ─── Denied Terminal ──────────────────────────────────────────────────────────
const DENIED_LOGS = [
  "AUTHENTICATING CREDENTIALS...",
  "CHECKING DATABASE...",
  "ERROR: INVALID USERNAME OR PASSWORD!",
  "UNAUTHORIZED ACCESS DETECTED!",
  "TRACING SESSION...",
  "SYSTEM LOCKED DOWN!",
];

function DeniedTerminal({ onRetry }: { onRetry: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < DENIED_LOGS.length) {
        setLines((p) => [...p, "> " + DENIED_LOGS[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowStatus(true), 200);
      }
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,5,2,.96)", zIndex: 20, display: "flex", flexDirection: "column", padding: 20, fontFamily: "'Courier New',monospace", fontSize: 12, overflowY: "auto", borderRadius: 18 }}>
      {lines.map((l, i) => (
        <p key={i} style={{ marginBottom: 6, lineHeight: 1.4, color: "#ff3333", textShadow: "0 0 4px #ff3333" }}>{l}</p>
      ))}
      {showStatus && (
        <>
          <div style={{ color: "#ff2222", fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 20, border: "2px solid #ff2222", padding: 10, boxShadow: "0 0 20px #ff2222", animation: "blink .5s infinite alternate" }}>
            ACCESS DENIED / SYSTEM LOCKED
          </div>
          <button onClick={onRetry} style={{ marginTop: "auto", background: "#ff2222", color: "#fff", border: "none", padding: 10, fontFamily: "inherit", fontWeight: "bold", cursor: "pointer", borderRadius: 4, boxShadow: "0 0 10px #ff2222" }}>
            TRY AGAIN
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [denied, setDenied] = useState(false);
  const [showDenied, setShowDenied] = useState(false);
  const [booting, setBooting] = useState(false);
  const [matrixVisible, setMatrixVisible] = useState(false);
  const [operatorName, setOperatorName] = useState("");
  const [pendingRole, setPendingRole] = useState<"admin" | "viewer">("admin");
  const [pendingName, setPendingName] = useState(PERSONAL_CREDENTIALS.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailMatch = username.trim().toLowerCase() === PERSONAL_CREDENTIALS.email.toLowerCase();
    const altMatch = username.trim().toLowerCase() === "akshat";
    // Check admin credentials first
    if ((emailMatch || altMatch) && password === PERSONAL_CREDENTIALS.password) {
      const name = PERSONAL_CREDENTIALS.name;
      setOperatorName(name.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 16) || "OPERATOR");
      setPendingRole("admin");
      setPendingName(name);
      setBooting(true);
      return;
    }
    // Then check viewer accounts
    const viewer = findUser(username.trim(), password);
    if (viewer) {
      setOperatorName(viewer.name.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 16) || "OPERATOR");
      setPendingRole("viewer");
      setPendingName(viewer.name);
      setBooting(true);
      return;
    }
    setDenied(true);
    setShowDenied(true);
  };

  const handleRetry = () => {
    setDenied(false);
    setShowDenied(false);
    setPassword("");
  };

  const handleBootDone = () => {
    setMatrixVisible(true);
    setTimeout(() => onLogin(pendingName, pendingRole), 400);
  };

  const topLightColor = denied ? "#ff2222" : "#baff00";
  const topLightShadow = denied
    ? "0 0 10px #ff2222, 0 0 20px rgba(255,34,34,.8)"
    : "0 0 10px #baff00, 0 0 20px rgba(186,255,0,.8)";

  return (
    <>
      <style>{`
        @keyframes jawChatter {
          0%   { transform: translateY(0); }
          3%   { transform: translateY(6px); }
          6%   { transform: translateY(0); }
          9%   { transform: translateY(8px); }
          12%  { transform: translateY(0); }
          15%  { transform: translateY(6px); }
          18%  { transform: translateY(0); }
          21%  { transform: translateY(8px); }
          24%  { transform: translateY(0); }
          27%  { transform: translateY(6px); }
          30%, 100% { transform: translateY(0); }
        }
        @keyframes glassColor {
          0%,45% { filter: hue-rotate(0deg); opacity: .8; }
          50%    { filter: hue-rotate(45deg); opacity: 1; }
          60%,100% { filter: hue-rotate(0deg); opacity: .8; }
        }
        @keyframes cursorBlink { 50% { opacity: 0; } }
        @keyframes blink { from { opacity: 1; } to { opacity: .4; } }
        @keyframes loginFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bgPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .login-button-lock:hover { background: #baff00 !important; }
      `}</style>

      {/* Full-page dark background */}
      <div style={{ position: "fixed", inset: 0, background: "#020304", zIndex: 0 }} />

      <MatrixCanvas visible={matrixVisible} />

      {/* Boot sequence */}
      {booting && <BootScreen onDone={handleBootDone} />}

      {/* Login screen */}
      {!booting && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 5,
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: 10,
          animation: "loginFadeIn 0.6s ease",
        }}>
          {/* Login card */}
          <div style={{
            position: "relative",
            width: "100%", maxWidth: 380,
            height: "100%", maxHeight: 680,
            background: "radial-gradient(ellipse at 50% 20%, #15181c 0%, #0d0f12 32%, #07090c 72%, #030405 100%)",
            border: "1px solid #30343a",
            borderRadius: 18,
            boxShadow: denied
              ? "0 0 40px rgba(0,0,0,.95), 0 0 30px rgba(255,34,34,.15)"
              : "0 0 40px rgba(0,0,0,.95), 0 0 15px rgba(186,255,0,.05)",
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: 15, overflow: "hidden",
            transition: "box-shadow 0.3s",
            animation: denied ? "shake .12s 5" : undefined,
          }}>
            {/* Top light bar */}
            <div style={{
              position: "absolute", top: 0, left: "20%", width: "60%", height: 3,
              background: topLightColor,
              borderRadius: "0 0 8px 8px",
              boxShadow: topLightShadow,
              transition: "background .3s, box-shadow .3s",
            }} />

            {/* Glass scan overlay */}
            {!denied && (
              <div style={{
                position: "absolute", top: 42, left: "50%", transform: "translateX(-50%)",
                width: 235, height: 210, borderRadius: "50%", pointerEvents: "none",
                background: "radial-gradient(ellipse at center, rgba(186,255,0,.12) 0%, rgba(186,255,0,.05) 38%, transparent 70%)",
                mixBlendMode: "screen",
                animation: "glassColor 7s infinite linear",
              }} />
            )}
            {denied && (
              <div style={{
                position: "absolute", top: 42, left: "50%", transform: "translateX(-50%)",
                width: 235, height: 210, borderRadius: "50%", pointerEvents: "none",
                background: "radial-gradient(ellipse at center, rgba(255,34,34,.25) 0%, rgba(255,34,34,.08) 40%, transparent 70%)",
              }} />
            )}

            {/* Skull area */}
            <div style={{ width: "100%", height: 280, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 5 }}>
              <SkullSVG denied={denied} />
            </div>

            {/* HACKERS NETWORK label */}
            <div style={{
              color: "#e6e6e6", fontSize: 12, fontWeight: 700,
              letterSpacing: 4, textAlign: "center", margin: "5px 0 15px",
              fontFamily: "'Courier New',monospace",
              textShadow: "0 0 6px rgba(255,255,255,.25)",
            }}>
              HACKERS NETWORK
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "90%", display: "flex", flexDirection: "column", gap: 12, fontFamily: "'Courier New',monospace" }}>
              {/* Username */}
              <div style={{ width: "100%", height: 48, background: "linear-gradient(180deg,#f3f3f3,#dcdcdc)", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,.4)", overflow: "hidden" }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="USERNAME..."
                  autoComplete="username"
                  style={{ width: "100%", height: "100%", border: "none", outline: "none", background: "transparent", color: "#111", padding: "0 15px", fontSize: 15, fontWeight: 600, fontFamily: "inherit" }}
                />
              </div>

              {/* Password + lock button */}
              <div style={{ display: "flex", width: "100%", height: 48 }}>
                <div style={{ flex: 1, background: "linear-gradient(180deg,#f3f3f3,#dcdcdc)", borderRadius: "6px 0 0 6px", boxShadow: "0 4px 12px rgba(0,0,0,.4)", overflow: "hidden" }}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="PASSWORD..."
                    autoComplete="current-password"
                    style={{ width: "100%", height: "100%", border: "none", outline: "none", background: "transparent", color: "#111", padding: "0 15px", fontSize: 15, fontWeight: 600, fontFamily: "inherit" }}
                  />
                </div>
                <button
                  type="submit"
                  className="login-button-lock"
                  style={{ width: 52, height: 48, border: "none", background: "linear-gradient(180deg,#eeeeee,#cfcfcf)", borderRadius: "0 6px 6px 0", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,.4)", transition: ".2s", flexShrink: 0 }}
                  aria-label="Login"
                >
                  {/* Lock icon */}
                  <div style={{ position: "relative", width: 16, height: 15, background: "#111", borderRadius: 2 }}>
                    <div style={{ content: "", position: "absolute", width: 9, height: 10, left: 3.5, top: -8, border: "2.5px solid #111", borderBottom: "none", borderRadius: "7px 7px 0 0" }} />
                  </div>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div style={{ marginTop: "auto", paddingTop: 15, color: "#555", fontSize: 9, fontWeight: 600, letterSpacing: 3, textAlign: "center", lineHeight: 1.8, fontFamily: "'Courier New',monospace" }}>
              <div>SECURE ACCESS SYSTEM</div>
              <div>Developed by Akshat</div>
            </div>

            {/* Denied overlay */}
            {showDenied && <DeniedTerminal onRetry={handleRetry} />}
          </div>
        </div>
      )}
    </>
  );
}
