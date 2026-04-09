"use client";

import Image from "next/image";

interface Product {
  name: string;
  price: number;
  retailer: string;
  image: string;
}

interface BundleCardProps {
  title: string;
  discount: string;
  products: Product[];
  totalPrice: number;
  originalTotal: number;
  isBest?: boolean;
}

export default function BundleCard({
  title,
  discount,
  products,
  totalPrice,
  originalTotal,
  isBest
}: BundleCardProps) {
  return (
    <div 
      className={`glass-card anim-fadeup ${isBest ? 'best-bundle-glow' : ''}`}
      style={{ 
        padding: "2rem", 
        display: "flex", 
        flexDirection: "column",
        gap: "1.5rem",
        position: "relative",
        height: "100%",
        border: isBest ? "2px solid #FFD700" : "1px solid var(--border)",
        background: "var(--surface)",
        boxShadow: isBest ? "0 0 30px rgba(255, 215, 0, 0.15)" : "var(--card-shadow)"
      }}
    >
      {/* Save Tag */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "rgba(0, 200, 83, 0.1)",
        color: "#00C853",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "0.7rem",
        fontWeight: 800,
        textAlign: "center"
      }}>
        SAVE<br />{discount}
      </div>

      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", maxWidth: "80%" }}>{title}</h3>

      {/* Product Miniatures */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {products.map((p, i) => (
          <div key={i} style={{ 
            width: "100px", 
            height: "100px", 
            background: "rgba(255,255,255,0.03)", 
            borderRadius: "0.75rem",
            overflow: "hidden",
            border: "1px solid var(--border)"
          }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ))}
      </div>

      {/* Product Details List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {products.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>₹{p.price.toLocaleString()}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{p.retailer}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          BUNDLE TOTAL
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text)" }}>₹{totalPrice.toLocaleString()}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "line-through", marginBottom: "5px" }}>
            ₹{originalTotal.toLocaleString()}
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ 
        width: "100%", 
        justifyContent: "center",
        padding: "1rem",
        marginTop: "1rem",
        background: "var(--navy)",
        color: "#fff",
        borderRadius: "12px",
        fontWeight: 800,
        fontSize: "1rem"
      }}>
        Buy Bundle →
      </button>

      <style jsx>{`
        .best-bundle-glow {
          animation: gold-glow 3s infinite;
        }
        @keyframes gold-glow {
          0% { border-color: #FFD700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
          50% { border-color: #FFFACD; box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
          100% { border-color: #FFD700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
        }
      `}</style>
    </div>
  );
}
