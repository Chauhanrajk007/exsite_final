"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BundleCard from "../components/BundleCard";
import { searchProducts, mapBundleResults, type MappedBundle, type SearchResponse } from "../lib/api";

// ── PREMIUM SVG ICONS ───────────────────────────────────────────────
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconOrder = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconTracker = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;

function BundleContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [activeTab, setActiveTab] = useState("Search");
  const [bundles, setBundles] = useState<MappedBundle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goalDescription, setGoalDescription] = useState<string>("");
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Fetch bundles when query param present
  useEffect(() => {
    if (initialQuery) {
      performBundleSearch(initialQuery);
    }
  }, [initialQuery]);

  const performBundleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data: SearchResponse = await searchProducts(query);

      if ("error" in data) {
        setError(data.error);
        setBundles([]);
        return;
      }

      // If backend returned a product search, redirect
      if (data.type === "product") {
        router.push(`/individual-search?q=${encodeURIComponent(query)}`);
        return;
      }

      // Map bundle data
      const mapped = mapBundleResults(data.bundle);
      setBundles(mapped);
      setGoalDescription(data.intent?.goal || query);
      setTotalBudget(data.total_price || 0);

    } catch (err) {
      console.error("Bundle search error:", err);
      setError("Failed to connect to search backend. Make sure the AI server is running on port 8000.");
      setBundles([]);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      background: "var(--bg)", 
      color: "var(--text)", 
      overflow: "hidden"
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
        zIndex: 50
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
      <main style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        position: "relative",
        background: "var(--bg)",
        overflowY: "auto",
        transition: "all 0.4s ease"
      }}>
        {/* Persistent Background Layer */}
        <div className="animated-bg" style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 0,
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 10, padding: "0.5rem 3rem", width: "100%" }}>
          {/* Top Header */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
            <button
              onClick={toggleTheme}
              style={{
                width: 38, height: 38,
                borderRadius: "50%",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem"
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: "8rem 0",
              zIndex: 10 
            }}>
              <div style={{ 
                width: 56, height: 56, 
                border: "3px solid var(--border)", 
                borderTopColor: "var(--mauve)", 
                borderRadius: "50%", 
                animation: "spin 0.8s linear infinite",
                marginBottom: "1.5rem"
              }} />
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)" }}>
                AI is building your perfect bundle...
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Analyzing components across marketplaces
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div style={{ 
              background: "rgba(220,38,38,0.08)", 
              border: "1px solid rgba(220,38,38,0.2)", 
              borderRadius: "1rem", 
              padding: "1.5rem 2rem",
              marginBottom: "2rem"
            }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#DC2626", marginBottom: "0.3rem" }}>Bundle Error</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{error}</div>
            </div>
          )}

          {/* No query */}
          {!initialQuery && !isLoading && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: "8rem 0" 
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>AI-Curated Bundles</h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "500px", textAlign: "center", lineHeight: 1.5 }}>
                Search for a goal like &quot;home setup under 200000&quot; or &quot;gaming station under 100000&quot; from the search page to see AI-curated combo bundles.
              </p>
              <button 
                onClick={() => router.push('/search')}
                className="btn-primary"
                style={{ 
                  marginTop: "2rem", 
                  padding: "0.85rem 2rem", 
                  borderRadius: "999px", 
                  background: "linear-gradient(135deg, var(--mauve) 0%, var(--navy) 100%)",
                  color: "#FAE5D8",
                  fontWeight: 800,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                ← Back to Search
              </button>
            </div>
          )}

          {/* Bundle Results */}
          {!isLoading && !error && bundles.length > 0 && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-.02em" }}>AI-Curated Combo Bundles</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem", maxWidth: "600px" }}>
                      NEXACART Intelligence: {goalDescription ? `Best picks for "${goalDescription}"` : "High-precision peripheral matching for elite efficiency."}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {totalBudget > 0 && (
                      <div style={{ 
                        background: "rgba(0,200,83,0.1)", 
                        padding: "0.6rem 1.25rem", 
                        borderRadius: "99px", 
                        fontSize: "0.75rem", 
                        fontWeight: 800, 
                        color: "#00C853",
                        border: "1px solid rgba(0,200,83,0.2)"
                      }}>
                        TOTAL: ₹{totalBudget.toLocaleString("en-IN")}
                      </div>
                    )}
                    <div style={{ 
                      background: "var(--pill-bg)", 
                      padding: "0.6rem 1.25rem", 
                      borderRadius: "99px", 
                      fontSize: "0.75rem", 
                      fontWeight: 800, 
                      color: "var(--mauve)",
                      border: "1px solid var(--border)"
                    }}>
                      {bundles.length} BEST MATCHES FOUND
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
                gap: "2.5rem",
                maxWidth: "1200px" 
              }}>
                {bundles.map((bundle, index) => (
                  <BundleCard key={index} {...bundle} />
                ))}
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </div>
  );
}

export default function BundlePage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Loading bundles...</div>
      </div>
    }>
      <BundleContent />
    </Suspense>
  );
}
