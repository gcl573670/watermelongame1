import { useEffect, useRef, useCallback, useState } from "react";
import {
  Fruit, FRUIT_TYPES, CANVAS_WIDTH, CANVAS_HEIGHT, WALL_THICKNESS,
  DROP_LINE_Y, createFruit, updatePhysics, isAboveDropLine,
} from "../game/physics";
import {
  renderGame, createMergeParticles, updateParticles, Particle,
} from "../game/renderer";

const NEXT_POOL = [0, 0, 0, 1, 1, 2, 2, 3];

function randNextType() {
  return NEXT_POOL[Math.floor(Math.random() * NEXT_POOL.length)];
}

function clampX(x: number, radius: number) {
  return Math.max(WALL_THICKNESS + radius + 1, Math.min(CANVAS_WIDTH - WALL_THICKNESS - radius - 1, x));
}

type GameState = "playing" | "gameover";

export default function WatermelonGame() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const fruitsRef    = useRef<Fruit[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dropperXRef  = useRef(CANVAS_WIDTH / 2);
  const currentTypeRef = useRef<number>(randNextType());
  const nextTypeRef    = useRef<number>(randNextType());
  const canDropRef   = useRef(true);
  const rafRef       = useRef<number>(0);
  const gameStateRef = useRef<GameState>("playing");
  const overTimerRef = useRef<number | null>(null);
  const scoreRef     = useRef(0);

  const [score, setScore]       = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("wm_highscore") || 0));
  const [nextType, setNextType]  = useState(nextTypeRef.current);
  const [gameState, setGameState] = useState<GameState>("playing");

  const addScore = useCallback((pts: number) => {
    scoreRef.current += pts;
    setScore(scoreRef.current);
    setHighScore(prev => {
      const next = Math.max(prev, scoreRef.current);
      localStorage.setItem("wm_highscore", String(next));
      return next;
    });
  }, []);

  const resetGame = useCallback(() => {
    fruitsRef.current    = [];
    particlesRef.current = [];
    scoreRef.current     = 0;
    setScore(0);
    currentTypeRef.current = randNextType();
    nextTypeRef.current    = randNextType();
    setNextType(nextTypeRef.current);
    canDropRef.current     = true;
    gameStateRef.current   = "playing";
    setGameState("playing");
    if (overTimerRef.current) { clearTimeout(overTimerRef.current); overTimerRef.current = null; }
  }, []);

  const drop = useCallback(() => {
    if (!canDropRef.current) return;
    if (gameStateRef.current !== "playing") return;
    const x = dropperXRef.current;
    const type = currentTypeRef.current;
    const fruit = createFruit(x, DROP_LINE_Y, type);
    fruitsRef.current.push(fruit);
    currentTypeRef.current = nextTypeRef.current;
    nextTypeRef.current    = randNextType();
    setNextType(nextTypeRef.current);
    canDropRef.current = false;
    setTimeout(() => { canDropRef.current = true; }, 480);
  }, []);

  // Mouse / touch handlers
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const rawX = (e.clientX - rect.left) * scaleX;
    const r = FRUIT_TYPES[currentTypeRef.current].radius;
    dropperXRef.current = clampX(rawX, r);
  }, []);

  const handleClick = useCallback(() => {
    drop();
  }, [drop]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const rawX = (e.touches[0].clientX - rect.left) * scaleX;
    const r = FRUIT_TYPES[currentTypeRef.current].radius;
    dropperXRef.current = clampX(rawX, r);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drop();
  }, [drop]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let overStart: number | null = null;

    function loop() {
      if (gameStateRef.current === "playing") {
        const { merges } = updatePhysics(fruitsRef.current);

        // Remove merged fruits, spawn new ones
        fruitsRef.current = fruitsRef.current.filter(f => !f.merged);
        for (const m of merges) {
          if (m.type < FRUIT_TYPES.length) {
            const newFruit = createFruit(m.x, m.y, m.type);
            newFruit.vy = -2;
            fruitsRef.current.push(newFruit);
            const pts = FRUIT_TYPES[m.type].points;
            addScore(pts);
            // Particles
            particlesRef.current.push(
              ...createMergeParticles(m.x, m.y, FRUIT_TYPES[m.type - 1].color)
            );
          }
        }

        // Check game over condition
        if (isAboveDropLine(fruitsRef.current)) {
          if (overStart === null) overStart = performance.now();
          else if (performance.now() - overStart > 3000) {
            gameStateRef.current = "gameover";
            setGameState("gameover");
          }
        } else {
          overStart = null;
        }
      }

      // Update particles
      particlesRef.current = updateParticles(particlesRef.current);

      renderGame(
        ctx,
        fruitsRef.current,
        dropperXRef.current,
        nextTypeRef.current,
        currentTypeRef.current,
        canDropRef.current,
        particlesRef.current,
      );

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [addScore]);

  const nextFt = FRUIT_TYPES[nextType];

  return (
    <div className="flex flex-col items-center gap-0 w-full">
      {/* Score bar */}
      <div
        style={{
          width: CANVAS_WIDTH,
          maxWidth: "100%",
          background: "#1e293b",
          borderRadius: "8px 8px 0 0",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Score</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.1 }}>{score.toLocaleString()}</div>
        </div>

        {/* Next fruit */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Next</div>
          <div style={{ fontSize: 26 }}>{nextFt.emoji}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>{nextFt.name}</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Best</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#34d399", lineHeight: 1.1 }}>{highScore.toLocaleString()}</div>
        </div>
      </div>

      {/* Canvas wrapper */}
      <div style={{ position: "relative", width: CANVAS_WIDTH, maxWidth: "100%" }}>
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            borderLeft: "2px solid #1e293b",
            borderRight: "2px solid #1e293b",
          }}
          onPointerMove={handlePointerMove}
          onClick={handleClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Game Over Overlay */}
        {gameState === "gameover" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(2,6,23,0.88)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              backdropFilter: "blur(4px)",
            }}
          >
            <div style={{ fontSize: 42 }}>🍉</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Game Over</h2>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>
              Score: <strong style={{ color: "#f1f5f9" }}>{score.toLocaleString()}</strong>
            </p>
            {score >= highScore && score > 0 && (
              <p style={{ color: "#34d399", fontSize: 13, fontWeight: 600 }}>🎉 New High Score!</p>
            )}
            <button
              onClick={resetGame}
              style={{
                marginTop: 8,
                padding: "12px 32px",
                background: "#22c55e",
                color: "#052e16",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Restart bar */}
      <div
        style={{
          width: CANVAS_WIDTH,
          maxWidth: "100%",
          background: "#1e293b",
          borderRadius: "0 0 8px 8px",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={resetGame}
          style={{
            padding: "6px 20px",
            background: "rgba(255,255,255,0.07)",
            color: "#94a3b8",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          ↺ RESTART
        </button>
      </div>
    </div>
  );
}
