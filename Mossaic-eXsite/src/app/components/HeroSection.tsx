"use client";

import dynamic from "next/dynamic";

const ChartLine = dynamic(() => import("./ChartLine"), { ssr: false });
const CampaignCard = dynamic(() => import("./CampaignCard"), { ssr: false });
const ThreeDCart = dynamic(() => import("./ThreeDCart"), { ssr: false });

export default function HeroSection() {
  return (
    <section
      id="about"
      className="animated-bg"
      style={{
        minHeight: "100vh",
        paddingTop: 80, /* navbar height */
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: "4vh", /* guaranteed gap at the bottom */
      }}
    >
      {/* ── Main two-column hero ─────────────────────────────── */}
      <div
        className="container"
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "1.5rem",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
        }}
      >
        {/* ── LEFT: copy ───────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              color: "var(--text)",
              letterSpacing: "-.02em",
            }}
          >
            E-Commerce
            <br />
            Revolutionized
            <br />
            with AI{" "}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.4rem",
                height: "2.4rem",
                borderRadius: "10px",
                background: "var(--mauve)",
                fontSize: "1.3rem",
                verticalAlign: "middle",
                marginInline: ".2rem",
              }}
            >
              🤖
            </span>{" "}
            Powered
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              fontSize: ".95rem",
              lineHeight: 1.65,
              color: "var(--text-muted)",
              maxWidth: 380,
            }}
          >
            Boost sales, enhance customer experience and streamline
            operations with our cutting-edge AI technology.
          </p>

          {/* Email CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: "5px 5px 5px 20px",
                maxWidth: 420,
              }}
            >
              <input
                id="email-input"
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: ".9rem",
                  minWidth: 0,
                }}
              />
              <button
                id="get-started-btn"
                style={{
                  background: "var(--btn-bg)",
                  color: "var(--btn-text)",
                  border: "none",
                  borderRadius: 999,
                  padding: ".65rem 1.4rem",
                  fontSize: ".85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "opacity .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = ".88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: floating cards ─────────────── */}
        <div style={{ position: "relative", height: 320, transform: "scale(0.75)", transformOrigin: "center right" }}>
          {/* connecting dashed lines */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox="0 0 480 440"
            fill="none"
            preserveAspectRatio="none"
          >
            <line x1="240" y1="90" x2="200" y2="200" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="5 4" strokeOpacity=".5"/>
            <line x1="200" y1="260" x2="320" y2="320" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="5 4" strokeOpacity=".5"/>
          </svg>

          {/* Card 1 – #1 Award ─────────── */}
          <div
            className="anim-float"
            style={{
              position: "absolute",
              top: "2%",
              left: "42%",
              background: "var(--hero-card1)",
              border: "1px solid var(--border)",
              borderRadius: "1.1rem",
              padding: "1rem 1.25rem",
              minWidth: 170,
              boxShadow: "0 12px 40px rgba(0,0,0,.25)",
            }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: ".35rem" }}>🏆</div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", lineHeight: 1 }}>#1</div>
            <div style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: ".3rem", lineHeight: 1.4 }}>
              Best website using<br/>AI for E-Commerce
            </div>
          </div>

          {/* 3D Cart next to #1 card */}
          <ThreeDCart />

          {/* Card 2 – Time Increase chart ─ */}
          <div
            className="anim-float2"
            style={{
              position: "absolute",
              top: "34%",
              left: "4%",
              background: "var(--hero-card2)",
              border: "1px solid rgba(223,182,178,.12)",
              borderRadius: "1.1rem",
              padding: "1rem 1.25rem",
              width: 210,
              boxShadow: "0 16px 50px rgba(0,0,0,.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
              <span style={{ fontSize: ".85rem" }}>🔵</span>
              <span style={{ fontSize: ".78rem", fontWeight: 600, color: "#DFB6B2" }}>Time Increase</span>
            </div>
            <div style={{ height: 64, marginBottom: ".65rem" }}>
              <ChartLine />
            </div>
            <div>
              <span style={{ fontSize: "2.8rem", fontWeight: 800, color: "#FAE5D8", lineHeight: 1 }}>5</span>
              <span style={{ fontSize: ".9rem", color: "#DFB6B2", marginLeft: ".35rem" }}>second</span>
            </div>
          </div>

          {/* Card 3 – 100K+ users ───────── */}
          <div
            className="anim-float3"
            style={{
              position: "absolute",
              bottom: "8%",
              right: "2%",
              background: "var(--hero-card3)",
              borderRadius: "1.1rem",
              padding: "1.1rem 1.4rem",
              minWidth: 180,
              boxShadow: "0 16px 50px rgba(0,0,0,.35)",
            }}
          >
            {/* avatar row */}
            <div style={{ display: "flex", marginBottom: ".75rem" }}>
              {["😊", "😄", "😎"].map((e, i) => (
                <div
                  key={i}
                  style={{
                    width: 30, height: 30,
                    borderRadius: "50%",
                    border: "2px solid rgba(250,229,216,.3)",
                    background: ["#6b3a5a", "#522959", "#2A114B"][i],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: ".9rem",
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: 3 - i,
                    position: "relative",
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#FAE5D8", lineHeight: 1 }}>100K+</div>
            <div style={{ fontSize: ".72rem", letterSpacing: ".12em", color: "#DFB6B2", marginTop: ".3rem" }}>
              SATISFIED USERS
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS ROW ─────────────────────────────────── */}
      <div className="container" style={{ paddingBottom: "1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1.6fr",
            gap: "1rem",
          }}
        >
          {/* Stat 1 – 24K+ chat */}
          <div
            style={{
              background: "var(--card-dark)",
              borderRadius: "1.25rem",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: "2.8rem",
                fontWeight: 900,
                color: "#FAE5D8",
                lineHeight: 1,
              }}
            >
              24K+
            </div>
            <span
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: "1.75rem",
                fontSize: ".72rem",
                background: "var(--mauve)",
                color: "#FAE5D8",
                borderRadius: 999,
                padding: ".2rem .6rem",
                display: "inline-block",
              }}
            >
              +4%
            </span>
            <p style={{ fontSize: ".9rem", fontWeight: 600, color: "#DFB6B2", marginTop: "auto" }}>
              Start a chat with<br />Comer AI
            </p>
          </div>

          {/* Stat 2 – Campaign tags (Physics Component) */}
          <CampaignCard />

          {/* Stat 3 – eXsite AI features */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              gap: "1rem",
            }}
          >
            {/* header row */}
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <span
                style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: "var(--mauve)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                🛒
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text)" }}>
                  e<span className="premium-x">X</span>site AI
                </div>
                <div style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>AI powered shopping assistant</div>
              </div>
              <button
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: ".3rem",
                  padding: ".3rem .8rem",
                  borderRadius: 999,
                  background: "var(--mauve)",
                  color: "#FAE5D8",
                  fontSize: ".72rem",
                  fontWeight: 600,
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                🔄 Update
              </button>
            </div>

            {/* 2×2 feature chips */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: ".5rem",
              }}
            >
              {[
                { icon: "💰", label: "Cost savings" },
                { icon: "✨", label: "User experience" },
                { icon: "🕐", label: "24/7 support" },
                { icon: "✅", label: "Safety guaranteed" },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                    padding: ".55rem .75rem",
                    borderRadius: ".75rem",
                    background: "var(--feat-bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{f.icon}</span>
                  <span style={{ fontSize: ".78rem", fontWeight: 500, color: "var(--text)" }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
