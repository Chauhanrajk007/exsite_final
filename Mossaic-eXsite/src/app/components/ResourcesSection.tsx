"use client";

import { useState } from "react";

const items = [
  {
    id: "docs",
    icon: "📚",
    label: "Documentation",
    desc: "Comprehensive guides to get started and master eXsite.",
    links: ["Quick Start Guide", "API Reference", "Integration Guides", "Best Practices"],
  },
  {
    id: "videos",
    icon: "🎥",
    label: "Video Tutorials",
    desc: "Step-by-step video courses for every skill level.",
    links: ["Getting Started Series", "Advanced Features", "Case Studies", "Webinars"],
  },
  {
    id: "community",
    icon: "👥",
    label: "Community",
    desc: "Join 24K+ merchants and AI enthusiasts worldwide.",
    links: ["Discord Server", "Forum", "Showcase Gallery", "Partner Program"],
  },
  {
    id: "tools",
    icon: "🛠️",
    label: "Dev Tools",
    desc: "SDKs, APIs and tools to build custom integrations.",
    links: ["JavaScript SDK", "Python SDK", "REST API", "Webhooks"],
  },
];

export default function ResourcesSection() {
  const [active, setActive] = useState("docs");
  const item = items.find((i) => i.id === active)!;

  return (
    <section id="resources" style={{ background: "var(--bg-alt)", paddingBlock: "6rem" }}>
      <div className="container">
        {/* heading */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="pill-label" style={{ marginBottom: "1rem", display: "inline-flex" }}>Resources</span>
          <h2 className="section-heading" style={{ marginTop: ".75rem" }}>Learn & Grow with eXsite</h2>
          <p style={{ marginTop: ".75rem", color: "var(--text-muted)", fontSize: ".95rem", maxWidth: 400, marginInline: "auto" }}>
            Everything you need to succeed with AI-powered e-commerce.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {items.map((it) => (
              <button
                key={it.id}
                id={`resource-tab-${it.id}`}
                onClick={() => setActive(it.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                  padding: ".75rem 1rem",
                  borderRadius: ".85rem",
                  fontSize: ".875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all .2s",
                  background: active === it.id ? "var(--mauve)" : "var(--surface)",
                  color: active === it.id ? "#FAE5D8" : "var(--text-sub)",
                  border: active === it.id ? "1px solid transparent" : "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{it.icon}</span>
                {it.label}
              </button>
            ))}
          </div>

          {/* content */}
          <div
            className="glass-card"
            style={{ padding: "2rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
              <div
                style={{
                  width: 56, height: 56,
                  borderRadius: "1rem",
                  background: "var(--mauve)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.75rem",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text)" }}>{item.label}</h3>
                <p style={{ fontSize: ".85rem", color: "var(--text-muted)", marginTop: ".2rem" }}>{item.desc}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".65rem", marginBottom: "1.75rem" }}>
              {item.links.map((l) => (
                <button
                  key={l}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: ".85rem 1.1rem",
                    borderRadius: ".85rem",
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: ".875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-alt)")}
                >
                  {l}
                  <span style={{ color: "var(--mauve)" }}>→</span>
                </button>
              ))}
            </div>

            {/* CTA banner */}
            <div
              style={{
                background: "var(--mauve)",
                borderRadius: "1rem",
                padding: "1.35rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#FAE5D8" }}>Need help getting started?</div>
                <div style={{ fontSize: ".8rem", color: "rgba(250,229,216,.75)", marginTop: ".2rem" }}>Talk to our team — we're here 24/7.</div>
              </div>
              <button
                id="contact-support-btn"
                style={{
                  padding: ".65rem 1.4rem",
                  borderRadius: 999,
                  background: "#FAE5D8",
                  color: "#180018",
                  fontSize: ".85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "opacity .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = ".88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
