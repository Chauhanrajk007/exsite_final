"use client";

import { useState } from "react";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: ".75rem 1rem",
    borderRadius: ".75rem",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: ".875rem",
    transition: "border-color .2s",
  };

  return (
    <section id="contact" style={{ background: "var(--bg)", paddingBlock: "6rem" }}>
      <div className="container">
        {/* heading */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="pill-label" style={{ marginBottom: "1rem", display: "inline-flex" }}>Contact Us</span>
          <h2 className="section-heading" style={{ marginTop: ".75rem" }}>Get In Touch</h2>
          <p style={{ marginTop: ".75rem", color: "var(--text-muted)", fontSize: ".95rem", maxWidth: 380, marginInline: "auto" }}>
            Have questions? Our team is ready to help you 24/7.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "2rem", alignItems: "start" }}>
          {/* info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "📧", label: "Email Us", val: "hello@exsite.ai" },
              { icon: "📞", label: "Call Us", val: "+1 (888) EXSITE" },
              { icon: "📍", label: "Location", val: "San Francisco, CA 94105" },
            ].map((c) => (
              <div
                key={c.label}
                className="glass-card"
                style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.1rem 1.25rem" }}
              >
                <div
                  style={{
                    width: 44, height: 44,
                    borderRadius: ".75rem",
                    background: "var(--mauve)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: ".72rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: ".2rem" }}>{c.label}</div>
                  <div style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--text)" }}>{c.val}</div>
                </div>
              </div>
            ))}

            {/* social */}
            <div style={{ display: "flex", gap: ".6rem", paddingTop: ".5rem" }}>
              {["𝕏", "in", "🐙", "📘"].map((s, i) => (
                <button
                  key={i}
                  style={{
                    width: 38, height: 38,
                    borderRadius: "50%",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: ".85rem",
                    fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    transition: "background .2s, transform .2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--mauve)";
                    e.currentTarget.style.color = "#FAE5D8";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "var(--surface)";
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* form */}
          <div className="glass-card" style={{ padding: "2rem" }}>
            {sent ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBlock: "3rem",
                  gap: "1rem",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "3.5rem" }}>✅</span>
                <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text)" }}>Message Sent!</div>
                <div style={{ fontSize: ".875rem", color: "var(--text-muted)" }}>We'll get back to you within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: ".4rem" }}>
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: ".4rem" }}>
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: ".4rem" }}>
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: ".4rem" }}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>
                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="btn-primary"
                  style={{
                    justifyContent: "center",
                    padding: ".85rem",
                    fontSize: ".9rem",
                  }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
