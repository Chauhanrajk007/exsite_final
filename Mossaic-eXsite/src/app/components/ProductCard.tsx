"use client";

import Image from "next/image";

interface Retailer {
  name: string;
  price: number;
  lowest?: boolean;
  delivery?: string;
  logo?: string;
}

interface ProductCardProps {
  name: string;
  image: string;
  rating: number;
  features: string[];
  price: number;
  msrp?: number;
  retailers: Retailer[];
  badge?: string;
  summary?: string;
  compact?: boolean;
}

export default function ProductCard({
  name,
  image,
  rating,
  features,
  price,
  msrp,
  retailers,
  badge,
  summary,
  compact
}: ProductCardProps) {
  return (
    <div className="glass-card anim-fadeup" style={{ 
      padding: compact ? "1rem" : "1.5rem", 
      marginBottom: compact ? "1rem" : "1.5rem",
      position: "relative",
      display: "flex",
      gap: compact ? "1.25rem" : "2rem",
      alignItems: "stretch",
      width: "100%"
    }}>
      {badge && (
        <div style={{
          position: "absolute",
          top: "-12px",
          left: "24px",
          background: "var(--navy)",
          color: "#fff",
          padding: "4px 12px",
          borderRadius: "6px",
          fontSize: "0.65rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 10
        }}>
          <span>👑</span> {badge.toUpperCase()}
        </div>
      )}

      {/* Product Image */}
      <div style={{ 
        width: compact ? "160px" : "240px", 
        height: compact ? "160px" : "240px", 
        background: "rgba(255,255,255,0.03)", 
        borderRadius: "1rem",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0
      }}>
        <img 
          src={image} 
          alt={name} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: compact ? "1.1rem" : "1.5rem", fontWeight: 800, color: "var(--text)" }}>{name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span style={{ color: "#FFB800", display: "flex", alignItems: "center", gap: "4px" }}>
                ★ {rating}
              </span>
              <span>•</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {features.map((feat, i) => (
                  <span key={i}>
                    {feat}
                    {i < features.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: compact ? "1.25rem" : "1.85rem", fontWeight: 900, color: "var(--text)" }}>₹{price.toLocaleString()}</div>
            {msrp && (
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                MSRP ₹{msrp.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Retailers */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: compact ? "1rem" : "1.5rem" }}>
          {retailers.map((retailer, index) => (
            <div 
              key={index} 
              style={{ 
                flex: 1, 
                background: "var(--surface-alt)", 
                padding: compact ? "0.6rem" : "1rem", 
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                position: "relative"
              }}
            >
              {!compact && (
                <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    background: "rgba(255,255,255,0.05)", 
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.5rem",
                    fontWeight: 900,
                    color: "var(--text-muted)",
                    flexShrink: 0
                }}>
                    {retailer.name.substring(0, 3).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: compact ? "0.7rem" : "0.8rem", fontWeight: 700, color: "var(--text)" }}>{retailer.name}</div>
                {!compact && <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{retailer.delivery || "Standard Delivery"}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: compact ? "0.9rem" : "1.1rem", fontWeight: 800, color: "var(--text)" }}>₹{retailer.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: compact ? "0.75rem" : "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
              {summary?.includes("Savings") ? "TOTAL SAVINGS" : "BEST VALUE SUMMARY"}
            </div>
            <div style={{ fontSize: compact ? "0.75rem" : "0.85rem", color: "var(--text)", fontWeight: 500 }}>
              {summary || `Save ₹${(msrp ? msrp - price : 0).toLocaleString()} compared to market average.`}
            </div>
          </div>
          <button className="btn-primary" style={{ 
            padding: compact ? "0.5rem 1rem" : "0.75rem 1.5rem", 
            background: "var(--navy)", 
            color: "#fff",
            fontWeight: 800,
            border: "none",
            borderRadius: "8px",
            fontSize: compact ? "0.75rem" : "0.85rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}>
            {compact ? "Order Now" : "Buy with AI Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}
