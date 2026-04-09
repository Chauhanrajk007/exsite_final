const API = "";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const intentBadge = document.getElementById("intent-badge");
const resultsDiv = document.getElementById("results");
const categoriesDiv = document.getElementById("categories");

// Load categories
fetch(`${API}/api/categories`)
    .then(r => r.json())
    .then(data => {
        categoriesDiv.innerHTML = data.categories
            .map(c => `<span class="cat-chip" onclick="quickSearch('${c}')">${c}</span>`)
            .join("");
    });

searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSearch();
});

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    loading.classList.remove("hidden");
    intentBadge.classList.add("hidden");
    resultsDiv.innerHTML = "";

    try {
        const res = await fetch(`${API}/api/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        });

        const data = await res.json();

        loading.classList.add("hidden");

        if (data.error) {
            resultsDiv.innerHTML = `<div class="error-msg">${data.error}</div>`;
            return;
        }

        showIntent(data.intent);

        if (data.type === "goal") {
            renderBundle(data);
        } else {
            renderProducts(data.results);
        }

    } catch (err) {
        loading.classList.add("hidden");
        resultsDiv.innerHTML = `<div class="error-msg">Connection error. Is the server running?</div>`;
    }
}

function quickSearch(category) {
    searchInput.value = `best ${category}`;
    handleSearch();
}

function showIntent(intent) {
    if (!intent) return;

    const parts = [];
    if (intent.type) parts.push(`<strong>${intent.type}</strong>`);
    if (intent.category) parts.push(`Category: ${intent.category}`);
    if (intent.max_price) parts.push(`Budget: ₹${formatPrice(intent.max_price)}`);
    if (intent.brand) parts.push(`Brand: ${intent.brand}`);

    intentBadge.innerHTML = `🧠 AI Intent → ${parts.join(" · ")}`;
    intentBadge.classList.remove("hidden");
}

function renderProducts(products) {
    if (!products.length) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <div class="icon">🔍</div>
                <p>No products found. Try a different query.</p>
            </div>`;
        return;
    }

    resultsDiv.innerHTML = products.map((p, i) => productCard(p, i === 0)).join("");
}

function renderBundle(data) {
    const bundle = data.bundle;
    const total = data.total_price;

    let html = `
        <div class="bundle-section">
            <div class="bundle-header">
                <h2>🎯 ${data.intent.goal || "Goal Bundle"}</h2>
                <span class="bundle-total">Total: ₹${formatPrice(total)}</span>
            </div>`;

    for (const comp of bundle) {
        html += `
            <div class="component-group">
                <div class="component-label">
                    ${comp.category}
                    <span class="component-budget">( budget: ₹${formatPrice(comp.budget)} )</span>
                </div>`;

        if (comp.best) {
            html += productCard(comp.best, true);
            for (const alt of comp.alternatives || []) {
                html += productCard(alt, false);
            }
        } else {
            html += `<div class="no-results" style="padding:16px"><p>No match found for ${comp.category}</p></div>`;
        }

        html += `</div>`;
    }

    html += `</div>`;
    resultsDiv.innerHTML = html;
}

function productCard(p, isBest) {
    const rating = p.rating ? `⭐ ${Number(p.rating).toFixed(1)}` : "";
    return `
        <div class="product-card">
            <div class="product-info">
                ${isBest ? '<span class="best-tag">Best Pick</span>' : ""}
                <h3>${truncate(p.name, 90)}</h3>
                <div class="product-meta">
                    <span class="marketplace">${p.marketplace || "—"}</span>
                    <span>${p.category || ""}</span>
                </div>
            </div>
            <div class="product-price">
                <div class="price">₹${formatPrice(p.price)}</div>
                ${rating ? `<div class="rating">${rating}</div>` : ""}
            </div>
        </div>`;
}

function formatPrice(n) {
    return Number(n).toLocaleString("en-IN");
}

function truncate(str, max) {
    return str && str.length > max ? str.slice(0, max) + "…" : str || "";
}
