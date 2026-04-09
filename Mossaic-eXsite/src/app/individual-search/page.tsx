"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { searchProducts, mapProductResults, type MappedProduct, type SearchResponse } from "../lib/api";

// ── PREMIUM SVG ICONS ───────────────────────────────────────────────
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconOrder = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconTracker = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;

function IndividualSearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchValue, setSearchValue] = useState(initialQuery);
  const [results, setResults] = useState<MappedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intentInfo, setIntentInfo] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [activeTab, setActiveTab] = useState("Search");
  const router = useRouter();

  useEffect(() => {
    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Fetch results when query param changes
  useEffect(() => {
    if (initialQuery) {
      setSearchValue(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data: SearchResponse = await searchProducts(query);

      if ("error" in data) {
        setError(data.error);
        setResults([]);
        return;
      }

      // If backend returned a goal/bundle, redirect to bundle page
      if (data.type === "goal") {
        router.push(`/bundle?q=${encodeURIComponent(query)}`);
        return;
      }

      // Map backend products to frontend ProductCard format
      const mapped = mapProductResults(data.results);
      setResults(mapped);

      // Show intent info
      const intent = data.intent;
      const parts: string[] = [];
      if (intent.category) parts.push(`Category: ${intent.category}`);
      if (intent.max_price) parts.push(`Max: ₹${intent.max_price.toLocaleString("en-IN")}`);
      setIntentInfo(parts.length > 0 ? parts.join(" · ") : null);

    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to connect to search backend. Make sure the AI server is running on port 8000.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    // Update URL and trigger search
    router.push(`/individual-search?q=${encodeURIComponent(query)}`);
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

        <div style={{ position: "relative", zIndex: 10, padding: "2rem 3rem", width: "100%" }}>
          {/* Top Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <form onSubmit={handleSearch} style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            <div style={{ 
              background: "var(--surface)", 
              borderRadius: "999px", 
              padding: "0.4rem 0.4rem 0.4rem 1.5rem",
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
            }}>
              <span 
                style={{ marginRight: "0.8rem", fontSize: "1.2rem", animation: "pulse 2s infinite", cursor: "default" }}
                title="AI-Powered Search"
              >✨</span>
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for products..."
                style={{ flex: 1, background: "transparent", color: "var(--text)", fontSize: "0.95rem", border: "none", outline: "none", marginLeft: "0.75rem" }}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="btn-primary" 
                style={{ padding: "0.6rem 1.5rem", borderRadius: "999px", opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "..." : "Search"}
              </button>
            </div>
          </form>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
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
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "4rem 0",
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
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
              AI is analyzing your query...
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Searching across multiple marketplaces
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
            marginBottom: "2rem",
            zIndex: 10
          }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#DC2626", marginBottom: "0.3rem" }}>Search Error</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{error}</div>
          </div>
        )}

        {/* Results Content */}
        {hasSearched && !isLoading && !error && results.length > 0 && (
          <div style={{ zIndex: 10 }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)" }}>Search Results</h1>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "1rem", color: "var(--text-muted)", marginTop: "0.5rem", alignItems: "center" }}>
                <span style={{ color: "var(--mauve)", fontWeight: 700 }}>{results.length} products found</span>
                <span>for &quot;{searchValue}&quot;</span>
                {intentInfo && (
                  <span style={{ 
                    background: "rgba(0,200,83,0.1)", 
                    color: "#00C853", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "99px", 
                    fontSize: "0.7rem", 
                    fontWeight: 700,
                    marginLeft: "0.5rem"
                  }}>
                    🎯 AI Intent → {intentInfo}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !isLoading && !error && results.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "4rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)" }}>No products found</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Try a different search term or category</p>
          </div>
        )}

        {/* Not yet searched */}
        {!hasSearched && !isLoading && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)" }}>Search for something to see results</h2>
          </div>
        )}
        </div>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
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

export default function IndividualSearchPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Loading...</div>
      </div>
    }>
      <IndividualSearchContent />
    </Suspense>
  );
}
