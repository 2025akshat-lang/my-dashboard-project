// PlaygroundStore — persisted templates for Code, Chemistry, and LaTeX snippets
// Drive D config. Do not import into Drive C files.

export type PlaygroundType = "html" | "chemistry" | "latex";

export interface PlaygroundTemplate {
  id: string;
  name: string;
  type: PlaygroundType;
  content: string;
  createdAt: string;
}

const KEY = "knowledgeos_playground_templates";

const SEED: PlaygroundTemplate[] = [
  {
    id: "html-bounce",
    name: "Bouncing Ball Animation",
    type: "html",
    content: `<!DOCTYPE html>
<html>
<head><style>
  body { margin: 0; background: #0f172a; overflow: hidden; }
  canvas { display: block; }
</style></head>
<body>
<canvas id="c"></canvas>
<script>
  const c = document.getElementById('c');
  const ctx = c.getContext('2d');
  c.width = window.innerWidth; c.height = window.innerHeight;
  let x = 100, y = 100, vx = 4, vy = 3, r = 20;
  function loop() {
    ctx.fillStyle = 'rgba(15,23,42,0.25)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    x += vx; y += vy;
    if (x + r > c.width || x - r < 0) vx = -vx;
    if (y + r > c.height || y - r < 0) vy = -vy;
    requestAnimationFrame(loop);
  }
  loop();
</script>
</body>
</html>`,
    createdAt: "2025-09-01",
  },
  {
    id: "html-wave",
    name: "Sine Wave Visualizer",
    type: "html",
    content: `<!DOCTYPE html>
<html>
<head><style>
  body { margin: 0; background: #0f172a; display: flex; align-items: center; justify-content: center; height: 100vh; }
  canvas { display: block; }
</style></head>
<body>
<canvas id="c" width="600" height="300"></canvas>
<script>
  const c = document.getElementById('c'), ctx = c.getContext('2d');
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, 600, 300);
    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < 600; x++) {
      const y = 150 + 80 * Math.sin((x + t) * 0.04);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    t += 2;
    requestAnimationFrame(draw);
  }
  draw();
</script>
</body>
</html>`,
    createdAt: "2025-09-01",
  },
  {
    id: "chem-combustion",
    name: "Methane Combustion",
    type: "chemistry",
    content: "CH4 + O2 -> CO2 + H2O",
    createdAt: "2025-09-01",
  },
  {
    id: "chem-rust",
    name: "Iron Rusting",
    type: "chemistry",
    content: "Fe + O2 -> Fe2O3",
    createdAt: "2025-09-01",
  },
  {
    id: "latex-quadratic",
    name: "Quadratic Formula",
    type: "latex",
    content: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    createdAt: "2025-09-01",
  },
  {
    id: "latex-integral",
    name: "Integration by Parts",
    type: "latex",
    content: "\\int u \\, dv = uv - \\int v \\, du",
    createdAt: "2025-09-01",
  },
];

function load(): PlaygroundTemplate[] {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (Array.isArray(s) && s.length) return s;
  } catch { /* empty */ }
  return [...SEED];
}

function save(data: PlaygroundTemplate[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getTemplates(): PlaygroundTemplate[] { return load(); }

export function saveTemplate(t: Omit<PlaygroundTemplate, "id" | "createdAt">): PlaygroundTemplate[] {
  const data = load();
  data.unshift({ ...t, id: Date.now().toString(), createdAt: new Date().toISOString().slice(0, 10) });
  save(data);
  return data;
}

export function deleteTemplate(id: string): PlaygroundTemplate[] {
  const data = load().filter(t => t.id !== id);
  save(data);
  return data;
}
