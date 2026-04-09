// ── background.js ─────────────────────────────────────────────────
// Service worker: handles Supabase storage + AI backend communication
// Merges price_tracker_extension/background.js + supabase.js logic

const SUPABASE_URL = "https://xzrutoixnjnbrcpdwhgw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cnV0b2l4bmpuYnJjcGR3aGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTAyMTYsImV4cCI6MjA5MTI4NjIxNn0.k9zmw6Rq9NMC8uul3nG_fx8Aq6AG_BEDdR2cLdRlbfo";
const API_BASE = "https://ai-ecommerce-backend-z48c.onrender.com";

// ── Store product in Supabase ────────────────────────────────────
async function storeProduct(data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/extension_price_data`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Supabase Error:", response.status, errText);
            return { error: `[Status ${response.status}] ${errText}` };
        }

        console.log("✅ Stored in Supabase:", data.product_name);
        return { error: null };
    } catch (err) {
        console.error("Fetch failed:", err);
        return { error: err.message };
    }
}

// ── Call AI backend /api/compare for cross-marketplace results ───
async function compareProduct(productName, currentMarketplace, currentPrice) {
    try {
        const response = await fetch(`${API_BASE}/api/compare`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_name: productName,
                current_marketplace: currentMarketplace,
                current_price: currentPrice
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            return { error: errText, competitors: [], best_deal: null, savings: 0 };
        }

        return await response.json();
    } catch (err) {
        console.error("Compare API failed:", err);
        return { error: err.message, competitors: [], best_deal: null, savings: 0 };
    }
}

// ── Message handler ──────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "STORE_PRODUCT") {
        storeProduct(message.payload).then((res) => {
            sendResponse({ status: "done", error: res?.error });
        });
        return true; // Keep channel alive for async
    }

    if (message.type === "COMPARE_PRODUCT") {
        compareProduct(
            message.payload.product_name,
            message.payload.marketplace,
            message.payload.price
        ).then((res) => {
            sendResponse(res);
        });
        return true;
    }
});const API_BASE = "https://ai-ecommerce-backend-z48c.onrender.com";
