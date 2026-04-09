"use client";

const posts = [
  {
    id: "1",
    cat: "AI Trends",
    date: "Mar 28, 2026",
    emoji: "🚀",
    bg: "#522959",
    title: "How AI is Transforming E-Commerce in 2026",
    excerpt: "Discover the latest breakthroughs in AI-driven commerce and what they mean for your business growth.",
  },
  {
    id: "2",
    cat: "Strategy",
    date: "Mar 22, 2026",
    emoji: "📈",
    bg: "#824D69",
    title: "5 Ways to Use eXsite to Double Your Conversions",
    excerpt: "Proven strategies from top-performing merchants using AI recommendations and dynamic pricing.",
  },
  {
    id: "3",
    cat: "Case Study",
    date: "Mar 15, 2026",
    emoji: "🏆",
    bg: "#2A114B",
    title: "How ShopMax Scaled to 100K Users with eXsite",
    excerpt: "A behind-the-scenes look at one of our fastest-growing customers and their AI journey.",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" style={{ background: "var(--bg)", paddingBlock: "6rem" }}>
      <div className="container">
        {/* header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span className="pill-label" style={{ marginBottom: ".75rem", display: "inline-flex" }}>Blog</span>
            <h2 className="section-heading" style={{ marginTop: ".75rem" }}>Latest Insights</h2>
          </div>
          <button
            id="view-all-btn"
            className="btn-outline"
            style={{ fontSize: ".85rem", padding: ".55rem 1.25rem" }}
          >
            View All →
          </button>
        </div>

        {/* grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {posts.map((p) => (
            <article
              key={p.id}
              id={`blog-post-${p.id}`}
              className="glass-card"
              style={{
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform .22s, box-shadow .22s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* thumbnail */}
              <div
                style={{
                  height: 160,
                  background: p.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                }}
              >
                {p.emoji}
              </div>

              {/* body */}
              <div style={{ padding: "1.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".8rem" }}>
                  <span
                    style={{
                      fontSize: ".72rem",
                      fontWeight: 600,
                      padding: ".25rem .7rem",
                      borderRadius: 999,
                      background: "var(--surface-alt)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {p.cat}
                  </span>
                  <span style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{p.date}</span>
                </div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.35, marginBottom: ".6rem" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: ".82rem", lineHeight: 1.6, color: "var(--text-muted)" }}>{p.excerpt}</p>
                <button
                  style={{
                    marginTop: "1rem",
                    fontSize: ".8rem",
                    fontWeight: 600,
                    color: "var(--mauve)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
