"use client";

export default function Footer() {
  const cols = [
    { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
    { title: "Support", links: ["Help Center", "Contact", "Status", "Privacy Policy"] },
  ];

  return (
    <footer
      style={{
        background: "var(--bg-alt)",
        borderTop: "1px solid var(--border)",
        paddingBlock: "4rem",
      }}
    >
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          {/* brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".55rem", marginBottom: "1rem" }}>
              <span
                style={{
                  width: 36, height: 36,
                  background: "var(--mauve)",
                  borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                }}
              >
                🛒
              </span>
              <span style={{ fontWeight: 800, letterSpacing: ".02em", color: "var(--text)", textTransform: "none" }}>
                e<span className="premium-x">X</span>site
              </span>
            </div>
            <p style={{ fontSize: ".85rem", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 280, marginBottom: "1.5rem" }}>
              Boost sales, enhance customer experience and streamline operations with cutting-edge AI technology.
            </p>

            {/* newsletter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: "4px 4px 4px 16px",
                maxWidth: 320,
              }}
            >
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: ".85rem",
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                }}
              />
              <button
                id="footer-subscribe-btn"
                style={{
                  padding: ".5rem 1rem",
                  borderRadius: 999,
                  background: "var(--mauve)",
                  color: "#FAE5D8",
                  fontSize: ".8rem",
                  fontWeight: 600,
                  flexShrink: 0,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: ".85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "1.25rem",
                  letterSpacing: ".04em",
                }}
              >
                {col.title}
              </h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: ".85rem",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        transition: "color .2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div
          style={{
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>
            © 2026 eXsite. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Terms", "Privacy", "Cookies"].map((t) => (
              <button
                key={t}
                style={{
                  fontSize: ".8rem",
                  color: "var(--text-muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "color .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
