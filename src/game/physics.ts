export interface Fruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: number;
  merged: boolean;
  settling: boolean;
  age: number;
}

export const FRUIT_TYPES = [
  { name: "Cherry",     radius: 16,  color: "#e8334a", darkColor: "#c01f33", emoji: "🍒", points: 1   },
  { name: "Strawberry", radius: 22,  color: "#f4564e", darkColor: "#d13a32", emoji: "🍓", points: 3   },
  { name: "Grape",      radius: 29,  color: "#9b59d4", darkColor: "#7a3db0", emoji: "🍇", points: 6   },
  { name: "Orange",     radius: 36,  color: "#f4913a", darkColor: "#d97020", emoji: "🍊", points: 10  },
  { name: "Tangerine",  radius: 43,  color: "#ff7b1a", darkColor: "#e05e00", emoji: "🍑", points: 15  },
  { name: "Apple",      radius: 51,  color: "#e03030", darkColor: "#b81a1a", emoji: "🍎", points: 21  },
  { name: "Pear",       radius: 59,  color: "#a8cc3c", darkColor: "#7da020", emoji: "🍐", points: 28  },
  { name: "Peach",      radius: 68,  color: "#ffb347", darkColor: "#e09030", emoji: "🍑", points: 36  },
  { name: "Pineapple",  radius: 78,  color: "#f4d03f", darkColor: "#c9a800", emoji: "🍍", points: 45  },
  { name: "Melon",      radius: 89,  color: "#58d68d", darkColor: "#27ae60", emoji: "🍈", points: 55  },
  { name: "Watermelon", radius: 101, color: "#2ecc71", darkColor: "#178a46", emoji: "🍉", points: 66  },
];

export const CANVAS_WIDTH  = 400;
export const CANVAS_HEIGHT = 520;
export const WALL_THICKNESS = 8;
export const DROP_LINE_Y   = 64;
export const GRAVITY       = 0.35;
export const DAMPING       = 0.98;
export const BOUNCE        = 0.25;
export const MAX_SPEED     = 18;

let nextId = 1;
export function createFruit(x: number, y: number, type: number): Fruit {
  return {
    id: nextId++,
    x, y,
    vx: 0, vy: 0,
    radius: FRUIT_TYPES[type].radius,
    type,
    merged: false,
    settling: false,
    age: 0,
  };
}

export function updatePhysics(fruits: Fruit[]): { updated: Fruit[]; merges: Array<{ x: number; y: number; type: number }> } {
  const floor   = CANVAS_HEIGHT - WALL_THICKNESS;
  const leftWall  = WALL_THICKNESS;
  const rightWall = CANVAS_WIDTH - WALL_THICKNESS;

  const merges: Array<{ x: number; y: number; type: number }> = [];

  // Apply gravity + integrate positions
  for (const f of fruits) {
    if (f.merged) continue;
    f.age++;
    f.vy += GRAVITY;
    f.vx *= DAMPING;
    f.vy *= DAMPING;

    // Clamp speed
    const speed = Math.hypot(f.vx, f.vy);
    if (speed > MAX_SPEED) {
      f.vx = (f.vx / speed) * MAX_SPEED;
      f.vy = (f.vy / speed) * MAX_SPEED;
    }

    f.x += f.vx;
    f.y += f.vy;

    // Floor
    if (f.y + f.radius > floor) {
      f.y = floor - f.radius;
      f.vy *= -BOUNCE;
      f.vx *= 0.85;
      if (Math.abs(f.vy) < 0.5) f.vy = 0;
    }

    // Left wall
    if (f.x - f.radius < leftWall) {
      f.x = leftWall + f.radius;
      f.vx *= -BOUNCE;
    }

    // Right wall
    if (f.x + f.radius > rightWall) {
      f.x = rightWall - f.radius;
      f.vx *= -BOUNCE;
    }
  }

  // Circle-circle collisions + merge detection
  const active = fruits.filter(f => !f.merged);
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = a.radius + b.radius;

      if (dist < minDist && dist > 0.01) {
        // Merge check — both same type, neither merged yet, and not brand-new
        if (a.type === b.type && !a.merged && !b.merged && a.type < FRUIT_TYPES.length - 1 && a.age > 8 && b.age > 8) {
          a.merged = true;
          b.merged = true;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          merges.push({ x: mx, y: my, type: a.type + 1 });
          continue;
        }

        // Push apart
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        const push = overlap * 0.5;
        a.x -= nx * push;
        a.y -= ny * push;
        b.x += nx * push;
        b.y += ny * push;

        // Velocity response
        const relVx = b.vx - a.vx;
        const relVy = b.vy - a.vy;
        const dot = relVx * nx + relVy * ny;

        if (dot < 0) {
          const impulse = dot * 0.55;
          a.vx += impulse * nx;
          a.vy += impulse * ny;
          b.vx -= impulse * nx;
          b.vy -= impulse * ny;
        }
      }
    }
  }

  return { updated: fruits, merges };
}

export function isAboveDropLine(fruits: Fruit[]): boolean {
  return fruits.some(f => !f.merged && f.age > 30 && (f.y - f.radius) < DROP_LINE_Y + 10);
}
