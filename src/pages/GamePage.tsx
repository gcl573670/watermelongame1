import WatermelonGame from "../components/WatermelonGame";
import { FRUIT_TYPES } from "../game/physics";

function AdZone({ width, height, label }: { width?: number | string; height: number | string; label?: string }) {
  return (
    <div
      className="ad-zone"
      style={{
        width: width ?? "100%",
        height,
        minHeight: typeof height === "number" ? height : undefined,
        flexShrink: 0,
      }}
    >
      {label && (
        <span
          style={{
            marginTop: 18,
            fontSize: 11,
            color: "#4b5563",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0f172a",
        color: "#f1f5f9",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Top Leaderboard Ad ── */}
      <div style={{ width: "100%", padding: "8px 12px 0" }}>
        <AdZone height={90} />
      </div>

      {/* ── Page Title ── */}
      <div style={{ textAlign: "center", padding: "10px 0 8px" }}>
        <h1
          style={{
            fontSize: "clamp(1.3rem, 4vw, 2rem)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #34d399 0%, #22c55e 50%, #86efac 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          🍉 Watermelon Game
        </h1>
        <p style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>
          Merge fruits to grow bigger — reach the Watermelon!
        </p>
      </div>

      {/* ── Main 3-column layout ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 12,
          padding: "0 12px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Left Sticky Skyscraper — hidden below 1024px */}
        <div
          style={{
            position: "sticky",
            top: 12,
            flexShrink: 0,
            display: "none",
          }}
          className="xl-skyscraper"
        >
          <AdZone width={160} height={600} />
        </div>

        {/* Center game column */}
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {/* Game */}
          <WatermelonGame />

          {/* Bottom Banner Ad */}
          <div style={{ width: "100%", maxWidth: 400 }}>
            <AdZone height={90} />
          </div>

          {/* Evolution Guide */}
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              background: "#1e293b",
              borderRadius: 8,
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3
              style={{
                fontSize: 11,
                color: "#64748b",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Evolution Tier
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 0",
                alignItems: "center",
              }}
            >
              {FRUIT_TYPES.map((ft, i) => (
                <div key={ft.name} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ textAlign: "center", padding: "0 6px" }}>
                    <div style={{ fontSize: ft.radius * 0.4 + 10 }}>{ft.emoji}</div>
                    <div style={{ fontSize: 9, color: "#475569", marginTop: 1 }}>{ft.name}</div>
                  </div>
                  {i < FRUIT_TYPES.length - 1 && (
                    <span style={{ color: "#334155", fontSize: 12, margin: "0 1px" }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Skyscraper — hidden below 1024px */}
        <div
          style={{
            position: "sticky",
            top: 12,
            flexShrink: 0,
            display: "none",
          }}
          className="xl-skyscraper"
        >
          <AdZone width={160} height={600} />
        </div>
      </div>

      {/* ── SEO Content Section ── */}
      <div
        style={{
          maxWidth: 720,
          margin: "32px auto 0",
          padding: "0 20px 60px",
          color: "#94a3b8",
          fontSize: 14,
          lineHeight: 1.75,
        }}
      >
        <section>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#e2e8f0",
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            How to Play Watermelon Game
          </h2>
          <p>
            Watermelon Game (also known as Suika Game) is a physics-based puzzle game where you drop
            fruits into a container. Move your cursor or finger to aim, then click or tap to release
            the current fruit. When two identical fruits collide, they merge and evolve into the next
            tier fruit, earning you points.
          </p>
          <p style={{ marginTop: 10 }}>
            The goal is to keep the stack from rising above the red dashed line. If fruits pile up
            past the threshold for more than 3 seconds, the game ends. Plan your drops carefully —
            larger fruits take up more space, but merging them scores big points.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#e2e8f0",
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Tips &amp; Strategies
          </h2>
          <h3 style={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.95rem", marginBottom: 6 }}>
            Keep it organized
          </h3>
          <p>
            Try to drop fruits in similar columns so that identical ones land near each other. Chains
            of merges can clear large sections of the board and earn huge bonus points quickly.
          </p>
          <h3 style={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.95rem", margin: "14px 0 6px" }}>
            Prioritize merges over filling
          </h3>
          <p>
            Resist the urge to fill empty space randomly. Drop new fruits on top of existing same-type
            fruits to trigger an immediate merge, keeping the stack low and earning more points.
          </p>
          <h3 style={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.95rem", margin: "14px 0 6px" }}>
            Watch the preview
          </h3>
          <p>
            Always check the "Next" fruit preview before dropping. If the upcoming fruit is small,
            you can place the current one in a tighter gap, saving space for the larger one that follows.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#e2e8f0",
              marginBottom: 12,
              paddingBottom: 6,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Fruit Evolution List
          </h2>
          <p style={{ marginBottom: 12 }}>
            There are 11 fruit tiers. Each merge earns progressively more points:
          </p>
          <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            {FRUIT_TYPES.map((ft, i) => (
              <li key={ft.name}>
                <strong style={{ color: "#e2e8f0" }}>
                  {ft.emoji} {ft.name}
                </strong>{" "}
                — {ft.points} point{ft.points !== 1 ? "s" : ""} per merge
                {i === FRUIT_TYPES.length - 1 && (
                  <span style={{ color: "#34d399", marginLeft: 6 }}>🏆 Final Tier</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#e2e8f0",
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Scoring System
          </h2>
          <p>
            Points are awarded every time two fruits merge into a higher tier. The deeper into the
            evolution chain you progress, the more points each merge is worth. Creating a Watermelon —
            the rarest and largest fruit — earns the highest single-merge score of 66 points. Chain
            multiple merges in one drop for maximum efficiency.
          </p>
        </section>
      </div>

      {/* Sticky skyscraper CSS — shown only on wide screens */}
      <style>{`
        @media (min-width: 1024px) {
          .xl-skyscraper {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
