"use client";

import { useState } from "react";

const tabs = [
  {
    id: "ai",
    icon: "🤖",
    label: "AI Shopping Assistant",
    desc: "Personalized recommendations powered by machine learning to boost conversion rates and average order value.",
    features: ["Smart product recommendations", "Behavioral analysis & segmentation", "Real-time personalization engine"],
  },
  {
    id: "analytics",
    icon: "📊",
    label: "Advanced Analytics",
    desc: "Deep insights into customer behavior, sales trends, and operational efficiency to drive data decisions.",
    features: ["Revenue & sales forecasting", "Customer lifetime value analysis", "Multi-channel attribution"],
  },
  {
    id: "campaigns",
    icon: "📢",
    label: "Campaign Manager",
    desc: "AI-driven marketing campaigns that reach the right customers at exactly the right moment.",
    features: ["Auto-optimized ad spend", "A/B testing at scale", "Email & push automation"],
  },
  {
    id: "inventory",
    icon: "📦",
    label: "Smart Inventory",
    desc: "Predictive inventory management to minimize stockouts while reducing overstock costs.",
    features: ["Demand forecasting AI", "Automated reorder triggers", "Supplier integration hub"],
  },
];

export default function ServicesSection() {
  const [active, setActive] = useState("ai");
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <section
      id="services"
      style={{ background: "var(--bg-alt)", paddingBlock: "6rem" }}
    >
      <div className="container">
        {/* heading */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="pill-label" style={{ marginBottom: "1rem", display: "inline-flex" }}>
            Our Services
          </span>
          <h2 className="section-heading" style={{ marginTop: ".75rem" }}>
            Everything You Need to Scale
          </h2>
          <p style={{ marginTop: ".75rem", color: "var(--text-muted)", fontSize: ".95rem", maxWidth: 440, marginInline: "auto" }}>
            Powerful AI tools designed specifically for modern e-commerce businesses.
          </p>
        </div>

        {/* tab pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".6rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              onClick={() => setActive(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".55rem 1.25rem",
                borderRadius: 999,
                fontSize: ".85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .2s",
                background: active === t.id ? "var(--mauve)" : "var(--surface)",
                color: active === t.id ? "#FAE5D8" : "var(--text-sub)",
                border: active === t.id ? "1px solid transparent" : "1px solid var(--border)",
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* content card */}
        <div
          className="glass-card"
          style={{ padding: "2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}
        >
          {/* left */}
          <div>
            <div
              style={{
                width: 64, height: 64,
                borderRadius: "1rem",
                background: "var(--mauve)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
                marginBottom: "1.5rem",
                boxShadow: "0 8px 24px rgba(130,77,105,.35)",
              }}
            >
              {tab.icon}
            </div>
            <h3
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: ".85rem",
                lineHeight: 1.2,
              }}
            >
              {tab.label}
            </h3>
            <p style={{ fontSize: ".9rem", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: "1.75rem" }}>
              {tab.desc}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginBottom: "2rem" }}>
              {tab.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                  <span
                    style={{
                      width: 20, height: 20,
                      borderRadius: "50%",
                      background: "var(--mauve)",
                      color: "#FAE5D8",
                      fontSize: ".6rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: ".875rem", color: "var(--text-sub)" }}>{f}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary">Learn More →</button>
          </div>

          {/* right – visual block */}
          <div
            className="grid-bg"
            style={{
              background: "var(--bg-alt)",
              borderRadius: "1rem",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "5rem" }}>{tab.icon}</span>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>{tab.label}</div>
              <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: ".3rem" }}>
                Powered by e<span className="premium-x">X</span>site AI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
