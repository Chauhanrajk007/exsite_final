"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

const services = [
  { icon: "🤖", label: "AI Shopping Assistant" },
  { icon: "📊", label: "Advanced Analytics" },
  { icon: "📢", label: "Campaign Manager" },
  { icon: "📦", label: "Smart Inventory" },
];

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? "var(--nav-blur)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          transition: "background .3s, border-color .3s",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            height: 72,
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".55rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 36, height: 36,
                background: "var(--mauve)",
                borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >
              🛒
            </span>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: ".02em", color: "var(--text)", textTransform: "none" }}>
              e<span className="premium-x">X</span>site
            </span>
          </Link>

          {/* Center nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flex: 1,
              justifyContent: "center",
            }}
            className="nav-links"
          >
            {([
              { label: "Search", href: "/search" },
              { label: "Individual Search", href: "/individual-search" },
              { label: "Bundles", href: "/bundle" },
              { label: "Cart", href: "/cart" },
              { label: "Blog", href: "#blog" },
              { label: "Resources", href: "#resources" },
              { label: "Contact Us", href: "#contact-us" }
            ]).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: ".9rem",
                  fontWeight: 500,
                  color: "var(--text-sub)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-sub)")}
              >
                {item.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div ref={dropRef} style={{ position: "relative" }}>
              <button
                id="services-btn"
                onClick={() => setDropOpen((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".35rem",
                  fontSize: ".9rem",
                  fontWeight: 500,
                  color: "var(--text-sub)",
                  background: "transparent",
                  whiteSpace: "nowrap",
                  transition: "color .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-sub)")}
              >
                Services
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: dropOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropOpen && (
                <div
                  id="services-dropdown"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    minWidth: 220,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    boxShadow: "0 16px 48px rgba(0,0,0,.35)",
                  }}
                >
                  {services.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setDropOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".75rem",
                        width: "100%",
                        padding: ".7rem 1.25rem",
                        background: "transparent",
                        color: "var(--text)",
                        fontSize: ".85rem",
                        fontWeight: 500,
                        textAlign: "left",
                        borderBottom: "1px solid var(--border)",
                        transition: "background .15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-alt)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side: theme + auth */}
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem", flexShrink: 0 }}>
            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
              style={{
                width: 36, height: 36,
                borderRadius: "50%",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
                transition: "background .2s, transform .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              id="signup-btn"
              className="btn-primary"
              style={{ padding: ".55rem 1.25rem", fontSize: ".85rem" }}
            >
              Sign Up
            </button>
            <button
              id="login-btn"
              className="btn-outline"
              style={{ padding: ".5rem 1.25rem", fontSize: ".85rem" }}
            >
              Login
            </button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((p) => !p)}
              className="mobile-only"
              style={{
                width: 36, height: 36,
                borderRadius: 8,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
                fontSize: "1.1rem",
              }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          style={{
            position: "fixed",
            top: 72, left: 0, right: 0,
            zIndex: 99,
            background: "var(--nav-blur)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: ".75rem",
          }}
        >
          {[
            { label: "Search", href: "/search" },
            { label: "Services", href: "#services" },
            { label: "Blog", href: "#blog" },
            { label: "Resources", href: "#resources" },
            { label: "Contact Us", href: "#contact-us" }
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: ".9rem",
                fontWeight: 500,
                color: "var(--text-sub)",
                textDecoration: "none",
                paddingBlock: ".5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: ".75rem", paddingTop: ".5rem" }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>Sign Up</button>
            <button className="btn-outline" style={{ flex: 1, justifyContent: "center" }}>Login</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          #signup-btn, #login-btn { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
