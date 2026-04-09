"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchProducts, getCategories, type SearchResponse } from "../lib/api";

// ── PREMIUM SVG ICONS ───────────────────────────────────────────────
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconOrder = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconTracker = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("Search");
  const [searchValue, setSearchValue] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Force light mode on initial load
    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Fetch dynamic categories from backend on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        // Fallback categories if backend is unreachable
        setCategories(["laptop", "mobile", "tv", "washing machine", "refrigerator", "smart watch"]);
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;

    setIsSearching(true);
    try {
      // Call the backend to determine intent type
      const data: SearchResponse = await searchProducts(query);

      if ("error" in data) {
        // If intent parsing failed, still try product search page
        router.push(`/individual-search?q=${encodeURIComponent(query)}`);
        return;
      }

      if (data.type === "goal") {
        // AI detected a goal/bundle query → route to bundle page
        router.push(`/bundle?q=${encodeURIComponent(query)}`);
      } else {
        // Product search → route to individual results page
        router.push(`/individual-search?q=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      console.error("Search failed:", err);
      // Fallback: route to individual search and let that page retry
      router.push(`/individual-search?q=${encodeURIComponent(query)}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    // Trigger search with the suggestion
    setIsSearching(true);
    searchProducts(suggestion)
      .then((data) => {
        if ("error" in data) {
          router.push(`/individual-search?q=${encodeURIComponent(suggestion)}`);
        } else if (data.type === "goal") {
          router.push(`/bundle?q=${encodeURIComponent(suggestion)}`);
        } else {
          router.push(`/individual-search?q=${encodeURIComponent(suggestion)}`);
        }
      })
      .catch(() => {
        router.push(`/individual-search?q=${encodeURIComponent(suggestion)}`);
      })
      .finally(() => setIsSearching(false));
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const sidebarLinks = [
    { label: "Dashboard", Icon: IconDashboard },
    { label: "Search", Icon: IconSearch },
    { label: "Cart", Icon: IconCart },
    { label: "Order", Icon: IconOrder },
    { label: "Tracker", Icon: IconTracker },
  ];

  const suggestions = [
    "Gaming monitor under 25k OLED",
    "best laptop under 50000",
    "home setup under 200000"
  ];

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      background: "var(--bg)", 
      color: "var(--text)", 
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
      transition: "all 0.4s ease"
    }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 250,
        background: theme === "dark" 
          ? "linear-gradient(180deg, #3D1C5C 0%, #180018 100%)" 
          : "linear-gradient(180deg, #FAE5D8 0%, #f2d8cc 100%)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "2.5rem 1.25rem",
        flexShrink: 0,
        zIndex: 50,
        transition: "all 0.4s ease"
      }}>
        <div style={{ marginBottom: "3.5rem", paddingLeft: "0.75rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-.04em", color: "var(--text)" }}>
              e<span className="premium-x">X</span>site
            </div>
            <div style={{ fontSize: "0.55rem", opacity: 0.5, fontWeight: 700, letterSpacing: "0.12em", marginTop: "4px", textTransform: "uppercase", color: "var(--text-muted)" }}>
              AI Search Engine
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {sidebarLinks.map(({ label, Icon }) => (
              <li key={label}>
                <button
                  onClick={() => {
                    setActiveTab(label);
                    if (label === "Search") router.push('/search');
                    if (label === "Dashboard") router.push('/');
                    if (label === "Cart") router.push('/cart');
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "0.85rem",
                    background: activeTab === label ? "var(--mauve)" : "transparent",
                    color: activeTab === label ? "#FAE5D8" : "var(--text-muted)",
                    fontWeight: activeTab === label ? 700 : 500,
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  <Icon />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ 
            background: "var(--surface)", 
            padding: "1.25rem", 
            borderRadius: "1.25rem", 
            border: "1px solid var(--border)", 
            textAlign: "center" 
          }}>
            <div style={{ fontWeight: 800, fontSize: "0.75rem", marginBottom: "0.6rem", color: "var(--text)" }}>Upgrade to Pro</div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: "65%", height: "100%", background: "linear-gradient(90deg, var(--mauve), var(--blush))" }}></div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "1rem 0.5rem", borderTop: "1px solid var(--border)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "10px", background: "var(--mauve)", color: "#FAE5D8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800 }}>A</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text)" }}>Alex Rivera</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700 }}>PRO</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="animated-bg" style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2vh 3.5rem",
        position: "relative",
        background: "var(--bg)",
        transition: "all 0.4s ease"
      }}>
        {/* WAVE PATTERN BEHIND CARDS */}
        <div style={{ 
          position: "absolute", 
          bottom: "5vh",
          left: "0", 
          width: "200%", 
          height: "180px", 
          pointerEvents: "none", 
          opacity: theme === "dark" ? 0.1 : 0.4, 
          zIndex: 0,
          animation: "waveRotate 30s linear infinite"
        }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="var(--mauve)" />
            <path d="M0,60 C150,110 350,10 500,60 C650,110 850,10 1000,60 L1000,100 L0,100 Z" fill="var(--blush)" opacity="0.6" />
          </svg>
        </div>

        {/* Top Header Icons */}
        <div style={{ position: "absolute", top: "1.5rem", right: "3rem", display: "flex", gap: "1rem", alignItems: "center", zIndex: 60 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 38, height: 38,
              borderRadius: "50%",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: "1.3rem", opacity: 0.6, cursor: "pointer" }}>🔔</button>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>👤</div>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: "center", zIndex: 10, marginTop: "2vh" }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--mauve)", marginBottom: "0.5rem" }}>Good Morning, Abhi.</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4.2vw, 3.6rem)", fontWeight: 900, lineHeight: 1, marginBottom: "0.75rem", letterSpacing: "-.04em", color: "var(--text)" }}>
            What can I find for<br />you today?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: 460, margin: "0 auto 1.5rem", lineHeight: 1.4, opacity: 0.8 }}>
              Search through millions of products and market data with AI precision.
          </p>

          {/* UNIQUE GLOWING SEARCH BAR */}
          <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
            <div style={{ 
              position: "absolute", inset: "-3px", 
              background: theme === "dark" 
                ? "linear-gradient(45deg, var(--mauve), var(--blush), var(--mauve))"
                : "linear-gradient(45deg, var(--blush), var(--mauve), var(--blush))",
              borderRadius: "999px", opacity: isSearching ? 0.6 : 0.3, filter: "blur(14px)", zIndex: -1,
              transition: "opacity 0.3s ease"
            }}></div>
            
            <div style={{ 
              background: "var(--surface)", 
              borderRadius: "999px", 
              padding: "0.45rem 0.45rem 0.45rem 2.25rem",
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border)",
              position: "relative",
              zIndex: 1,
              boxShadow: theme === "dark" ? "0 15px 35px rgba(0,0,0,0.3)" : "0 8px 30px rgba(130,77,105,0.1)"
            }}>
              <span 
                style={{ marginRight: "0.8rem", fontSize: "1.4rem", animation: "pulse 2s infinite", cursor: "default" }}
                title="AI-Powered Search"
              >✨</span>
              <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <input 
                  type="text" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Describe the perfect product or ask for insights..."
                  disabled={isSearching}
                  style={{ flex: 1, background: "transparent", color: "var(--text)", fontSize: "1.05rem", border: "none", outline: "none", fontWeight: 500, opacity: isSearching ? 0.5 : 1 }}
                />
                <span style={{ margin: "0 1.25rem", fontSize: "1.2rem", opacity: 0.4, cursor: "pointer" }}>🎙️</span>
                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="btn-primary" 
                  style={{ 
                    padding: "0.85rem 2.25rem", borderRadius: "999px", fontWeight: 800, fontSize: "1rem", border: "none",
                    background: isSearching 
                      ? "linear-gradient(135deg, var(--mauve) 0%, var(--mauve) 100%)"
                      : "linear-gradient(135deg, var(--mauve) 0%, var(--navy) 100%)",
                    color: "#FAE5D8",
                    cursor: isSearching ? "wait" : "pointer",
                    opacity: isSearching ? 0.7 : 1,
                    transition: "all 0.3s ease"
                  }}
                >
                  {isSearching ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Searching...
                    </span>
                  ) : (
                    "Search →"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Suggestion Chips — uses backend categories + curated queries */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", marginTop: "1.5rem", maxWidth: "800px", marginInline: "auto" }}>
            {suggestions.map((s) => (
              <button 
                key={s} 
                onClick={() => handleSuggestionClick(s)}
                disabled={isSearching}
                style={{ 
                  background: "var(--pill-bg)", border: "1px solid var(--border)", 
                  padding: "0.45rem 1rem", borderRadius: "99px", fontSize: "0.8rem", 
                  color: "var(--text-sub)", cursor: isSearching ? "wait" : "pointer", 
                  transition: "all 0.2s",
                  opacity: isSearching ? 0.5 : 1
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1.85fr 1fr", gap: "2rem", width: "100%", maxWidth: 1100, marginInline: "auto", height: "38vh", marginBottom: "1vh", zIndex: 10 }}>
          <div className="glass-card" style={{ display: "flex", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
            <div style={{ flex: 1.3, padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="pill-label" style={{ background: "var(--mauve)", padding: "0.4rem 0.85rem", borderRadius: "99px", fontSize: "0.6rem", fontWeight: 800, color: "#FAE5D8", width: "fit-content", marginBottom: "0.85rem" }}>CURATED FOR YOU</span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 900, marginBottom: "0.6rem", lineHeight: 1.1, color: "var(--text)" }}>Next-Gen Workspace Must-haves</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.45, marginBottom: "1.25rem" }}>From haptic keyboards to biomechanical desk chairs.</p>
              <button style={{ background: "transparent", border: "none", color: "var(--text)", fontWeight: 800, fontSize: "0.9rem", textAlign: "left", cursor: "pointer" }}>View Collection →</button>
            </div>
            <div style={{ flex: 1, background: "linear-gradient(to right, var(--surface) 0%, transparent 100%), url('https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=500&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
          </div>
          <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", boxShadow: "var(--card-shadow)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "10px", background: "var(--mauve)", color: "#FAE5D8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>⚡</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.4rem", color: "var(--text)" }}>Flash Insight</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.45 }}>Sustainable electronics trending up 14% this week.</p>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ display: "flex" }}>{[1,2,3].map(i => <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--mauve)", border: "2px solid var(--surface)", marginLeft: i > 1 ? -10 : 0, zIndex: i, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800 }}>👤</div>)}</div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>+24K</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          @keyframes waveRotate {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </div>
  );
}
