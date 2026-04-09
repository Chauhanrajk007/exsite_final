// ── popup.js ──────────────────────────────────────────────────────
// Orchestrates: content.js scraping → background.js AI comparison → UI rendering

document.addEventListener("DOMContentLoaded", async () => {
    const aiSearchBtn = document.getElementById("ai-search-btn");
    const defaultState = document.getElementById("default-state");
    const loadingState = document.getElementById("loading-state");
    const retailerState = document.getElementById("retailer-state");

    const productImg = document.getElementById("product-image");
    const productTitle = document.getElementById("product-title");
    const productPrice = document.getElementById("product-price");
    const productMarketplace = document.getElementById("product-marketplace");

    const bestDealCard = document.getElementById("best-deal-card");
    const bestRetailer = document.getElementById("best-retailer");
    const bestProductName = document.getElementById("best-product-name");
    const bestPrice = document.getElementById("best-price");
    const savingsRow = document.getElementById("savings-row");
    const savingsAmount = document.getElementById("savings-amount");
    const bestDealLink = document.getElementById("best-deal-link");

    const competitorsSection = document.getElementById("competitors-section");
    const competitorsList = document.getElementById("competitors-list");
    const noCompetitors = document.getElementById("no-competitors");

    // ── Show state helper ────────────────────────────────────────
    function showState(state) {
        defaultState.style.display = "none";
        loadingState.style.display = "none";
        retailerState.style.display = "none";

        if (state === "default") defaultState.style.display = "block";
        if (state === "loading") loadingState.style.display = "block";
        if (state === "retailer") retailerState.style.display = "block";
    }

    // ── Format price ─────────────────────────────────────────────
    function formatPrice(num) {
        if (!num || isNaN(num)) return "N/A";
        return "₹" + Number(num).toLocaleString("en-IN");
    }

    function capitalize(s) {
        if (!s) return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // ── Render current product ───────────────────────────────────
    function renderProduct(data) {
        showState("retailer");

        productTitle.innerText = data.shortTitle || data.title || "Unknown Product";
        productPrice.innerText = data.priceFormatted || formatPrice(data.price);
        productMarketplace.innerText = capitalize(data.marketplace || data.retailer || "");

        if (data.image) {
            productImg.src = data.image;
            productImg.style.display = "block";
        } else {
            productImg.style.display = "none";
        }
    }

    // ── Render competitor results from AI backend ────────────────
    function renderComparison(compareData, currentPrice) {
        // Best deal
        if (compareData.best_deal) {
            const best = compareData.best_deal;
            bestDealCard.style.display = "flex";

            bestRetailer.innerText = capitalize(best.marketplace);
            bestProductName.innerText = best.name || "";
            bestPrice.innerText = formatPrice(best.price);

            // Savings
            if (compareData.savings > 0) {
                savingsRow.style.display = "flex";
                savingsAmount.innerText = formatPrice(compareData.savings);
            } else {
                savingsRow.style.display = "none";
            }

            // Visit link
            if (best.product_url) {
                bestDealLink.href = best.product_url;
                bestDealLink.style.display = "block";
            } else {
                bestDealLink.style.display = "none";
            }
        } else {
            bestDealCard.style.display = "none";
        }

        // Other competitors (skip the best one)
        const others = (compareData.competitors || []).slice(1, 4);
        if (others.length > 0) {
            competitorsSection.style.display = "block";
            noCompetitors.style.display = "none";
            competitorsList.innerHTML = "";

            others.forEach((comp) => {
                const card = document.createElement("a");
                card.className = "competitor-card";
                card.href = comp.product_url || "#";
                card.target = "_blank";
                card.rel = "noopener noreferrer";

                card.innerHTML = `
                    <div class="competitor-left">
                        <div class="competitor-name">${comp.name || "Unknown"}</div>
                        <div class="competitor-marketplace">${capitalize(comp.marketplace)}</div>
                    </div>
                    <div class="competitor-right">
                        <div class="competitor-price">${formatPrice(comp.price)}</div>
                        <div class="competitor-arrow">Visit →</div>
                    </div>
                `;

                competitorsList.appendChild(card);
            });
        } else if (!compareData.best_deal) {
            // No competitors at all
            competitorsSection.style.display = "none";
            noCompetitors.style.display = "block";
        } else {
            competitorsSection.style.display = "none";
        }
    }

    // ── Main flow ────────────────────────────────────────────────
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        if (!activeTab || !activeTab.id || !activeTab.url) {
            showState("default");
            return;
        }

        const isShoppingSite =
            activeTab.url.includes("amazon") || activeTab.url.includes("flipkart");

        if (!isShoppingSite) {
            showState("default");
            return;
        }

        // Step 1: Get product info from content script
        showState("loading");

        chrome.tabs.sendMessage(activeTab.id, { action: "getProductInfo" }, (response) => {
            if (chrome.runtime.lastError || !response || !response.title) {
                // Content script not ready — show default
                showState("default");
                return;
            }

            // Step 2: Show product immediately
            renderProduct(response);

            // Step 3: Ask AI backend for cross-marketplace comparison
            chrome.runtime.sendMessage({
                type: "COMPARE_PRODUCT",
                payload: {
                    product_name: response.title,
                    marketplace: response.marketplace,
                    price: response.price
                }
            }, (compareData) => {
                if (chrome.runtime.lastError) {
                    console.error("Compare error:", chrome.runtime.lastError);
                    noCompetitors.style.display = "block";
                    return;
                }

                if (!compareData || compareData.error) {
                    console.error("Compare API error:", compareData?.error);
                    noCompetitors.style.display = "block";
                    return;
                }

                renderComparison(compareData, response.price);
            });
        });
    });

    // ── AI Search button → opens main eXsite website ─────────────
    aiSearchBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            let searchUrl = "http://localhost:3000/search";

            // If on a product page, pre-fill the search with product name
            if (activeTab && activeTab.url &&
                (activeTab.url.includes("amazon") || activeTab.url.includes("flipkart"))) {
                chrome.tabs.sendMessage(activeTab.id, { action: "getProductInfo" }, (response) => {
                    if (response && response.title) {
                        const query = response.shortTitle || response.title.split(" ").slice(0, 6).join(" ");
                        searchUrl = `http://localhost:3000/individual-search?q=${encodeURIComponent(query)}`;
                    }
                    chrome.tabs.create({ url: searchUrl });
                });
            } else {
                chrome.tabs.create({ url: searchUrl });
            }
        });
    });
});
