// ── content.js ────────────────────────────────────────────────────
// Runs on Amazon/Flipkart product pages.
// 1. Scrapes product data (robust selectors from price_tracker_extension)
// 2. Auto-stores to Supabase via background.js
// 3. Responds to popup.js requests for product info

// ── Detection ────────────────────────────────────────────────────

function isAmazonProductPage() {
    return location.pathname.includes("/dp/");
}

function isFlipkartProductPage() {
    return location.pathname.includes("/p/");
}

// ── Extraction (merged from both extensions) ─────────────────────

function extractAmazonData() {
    const title = document.querySelector("#productTitle")?.innerText?.trim();

    const priceText =
        document.querySelector(".a-price .a-offscreen")?.innerText ||
        document.querySelector("#corePriceDisplay_desktop_feature_div .a-price-whole")?.innerText ||
        document.querySelector("#corePrice_feature_div .a-offscreen")?.innerText ||
        document.querySelector(".a-price-whole")?.innerText ||
        document.querySelector(".a-color-price")?.innerText;

    const ratingText =
        document.querySelector("span.a-icon-alt")?.innerText ||
        document.querySelector("[data-hook='rating-out-of-text']")?.innerText ||
        document.querySelector("#acrPopover")?.title ||
        document.querySelector("#acrPopover")?.innerText;

    const image = document.querySelector("#landingImage")?.src ||
        document.querySelector("#imgBlkFront")?.src ||
        document.querySelector("#main-image-container img")?.src;

    if (!title || !priceText) return null;

    const parsedPrice = parseFloat(priceText.replace(/[^\d.]/g, ""));
    const parsedRating = ratingText ? parseFloat(ratingText.replace(/[^\d.]/g, "")) : null;

    return {
        title: title,
        shortTitle: title.split(" ").slice(0, 10).join(" "),
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        priceFormatted: `₹${parsedPrice.toLocaleString("en-IN")}`,
        rating: isNaN(parsedRating) ? null : parsedRating,
        image: image || "",
        marketplace: "amazon",
        url: location.href.split("?")[0]
    };
}

function extractFlipkartData() {
    const title =
        document.querySelector("h1.v1zwn21k.v1zwn26._1psv1zeb9._1psv1ze0")?.innerText?.trim() ||
        document.querySelector("h1")?.innerText?.trim() ||
        document.querySelector("span.VU-ZEz")?.innerText?.trim() ||
        document.querySelector("span.B_NuCI")?.innerText?.trim() ||
        document.title.split("|")[0].trim();

    const priceText =
        document.querySelector("div.v1zwn21k.v1zwn20._1psv1zeb9._1psv1ze0")?.innerText ||
        document.querySelector("div.Nx9bqj.CxhGGd")?.innerText ||
        document.querySelector("div._30jeq3._16Jk6d")?.innerText ||
        document.querySelector("div.Nx9bqj")?.innerText;

    const ratingText =
        document.querySelector("div.css-146c3p1")?.innerText ||
        document.querySelector("div.XQDdHH")?.innerText ||
        document.querySelector("div._3LWZlK")?.innerText;

    const image =
        document.querySelector("img._396cs4")?.src ||
        document.querySelector("img._2r_T1I")?.src ||
        document.querySelector(".CXW8mj img")?.src ||
        document.querySelector("._3kidJX img")?.src;

    if (!title || !priceText) return null;

    const parsedPrice = parseFloat(priceText.replace(/[^\d.]/g, ""));
    const parsedRating = ratingText ? parseFloat(ratingText.replace(/[^\d.]/g, "")) : null;

    return {
        title: title,
        shortTitle: title.split(" ").slice(0, 10).join(" "),
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        priceFormatted: `₹${parsedPrice.toLocaleString("en-IN")}`,
        rating: isNaN(parsedRating) ? null : parsedRating,
        image: image || "",
        marketplace: "flipkart",
        url: location.href.split("?")[0]
    };
}

// ── Main extraction function ─────────────────────────────────────

function extractProductInfo() {
    if (isAmazonProductPage()) return extractAmazonData();
    if (isFlipkartProductPage()) return extractFlipkartData();
    return null;
}

// ── Auto-store to Supabase (from price_tracker backend) ──────────

function autoStoreProduct() {
    const data = extractProductInfo();
    if (!data || !data.price || !data.title) {
        console.log("eXsite: No product data to store on this page");
        return;
    }

    const payload = {
        product_name: data.title,
        price: data.price,
        rating: data.rating,
        marketplace: data.marketplace,
        product_url: data.url
    };

    console.log("eXsite: Auto-storing product:", payload.product_name);

    if (!chrome.runtime || !chrome.runtime.sendMessage) {
        console.error("eXsite: Extension context invalidated");
        return;
    }

    chrome.runtime.sendMessage({
        type: "STORE_PRODUCT",
        payload
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.log("eXsite: Background not ready yet");
            return;
        }
        if (!response) {
            console.error("eXsite: No response from background script");
        } else if (response.error) {
            console.error("eXsite: Storage error:", response.error);
        } else {
            console.log("eXsite: ✅ Product stored successfully");
        }
    });
}

// ── Listen for popup requests ────────────────────────────────────

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProductInfo") {
        const info = extractProductInfo();
        sendResponse(info);
    }
});

// ── Auto-run: store product after page loads ─────────────────────
setTimeout(autoStoreProduct, 5000);
