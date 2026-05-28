import { Fruit, FRUIT_TYPES, CANVAS_WIDTH, CANVAS_HEIGHT, WALL_THICKNESS, DROP_LINE_Y } from "./physics";

export function renderGame(
  ctx: CanvasRenderingContext2D,
  fruits: Fruit[],
  dropperX: number,
  nextType: number,
  currentType: number,
  canDrop: boolean,
  particles: Particle[],
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Background
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Drop line (dashed)
  ctx.save();
  ctx.strokeStyle = "rgba(239,68,68,0.45)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(WALL_THICKNESS, DROP_LINE_Y);
  ctx.lineTo(CANVAS_WIDTH - WALL_THICKNESS, DROP_LINE_Y);
  ctx.stroke();
  ctx.restore();

  // Walls
  ctx.fillStyle = "#1e293b";
  // Left
  ctx.fillRect(0, 0, WALL_THICKNESS, CANVAS_HEIGHT);
  // Right
  ctx.fillRect(CANVAS_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, CANVAS_HEIGHT);
  // Floor
  ctx.fillRect(0, CANVAS_HEIGHT - WALL_THICKNESS, CANVAS_WIDTH, WALL_THICKNESS);

  // Wall inner highlight
  ctx.fillStyle = "rgba(100,150,255,0.07)";
  ctx.fillRect(WALL_THICKNESS, DROP_LINE_Y, CANVAS_WIDTH - WALL_THICKNESS * 2, CANVAS_HEIGHT - DROP_LINE_Y - WALL_THICKNESS);

  // Particles
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Fruits
  for (const f of fruits) {
    if (f.merged) continue;
    const ft = FRUIT_TYPES[f.type];
    drawFruit(ctx, f.x, f.y, f.radius, ft.color, ft.darkColor, ft.emoji, 1);
  }

  // Dropper guide line
  if (canDrop) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(dropperX, DROP_LINE_Y);
    ctx.lineTo(dropperX, CANVAS_HEIGHT - WALL_THICKNESS);
    ctx.stroke();
    ctx.restore();
  }

  // Current fruit at dropper
  const cft = FRUIT_TYPES[currentType];
  drawFruit(ctx, dropperX, DROP_LINE_Y - cft.radius - 4, cft.radius, cft.color, cft.darkColor, cft.emoji, canDrop ? 1 : 0.4);

  // Dropper arrow
  ctx.save();
  ctx.fillStyle = canDrop ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.moveTo(dropperX, DROP_LINE_Y - 2);
  ctx.lineTo(dropperX - 5, DROP_LINE_Y - 10);
  ctx.lineTo(dropperX + 5, DROP_LINE_Y - 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFruit(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  color: string, darkColor: string, emoji: string,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 8;

  // Main circle
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  grad.addColorStop(0, lighten(color, 0.25));
  grad.addColorStop(0.7, color);
  grad.addColorStop(1, darkColor);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Gloss highlight
  ctx.shadowBlur = 0;
  const glossGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, 0, x - r * 0.2, y - r * 0.3, r * 0.55);
  glossGrad.addColorStop(0, "rgba(255,255,255,0.35)");
  glossGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glossGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Emoji
  const fontSize = Math.max(10, Math.floor(r * 0.9));
  ctx.font = `${fontSize}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, x, y + 1);

  ctx.restore();
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + Math.floor(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.floor(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.floor(255 * amount));
  return `rgb(${r},${g},${b})`;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: string;
}

export function createMergeParticles(x: number, y: number, color: string): Particle[] {
  const count = 10;
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 1.5 + Math.random() * 2.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 3 + Math.random() * 4,
      alpha: 1,
      color,
    });
  }
  return particles;
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.12,
      alpha: p.alpha - 0.04,
    }))
    .filter(p => p.alpha > 0);
}
