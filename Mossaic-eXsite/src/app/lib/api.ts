// ── API Service Layer ─────────────────────────────────────────────
// Connects Mossaic-eXsite frontend to ai-ecommerce FastAPI backend
// Backend endpoint: POST /api/search  { query: string }

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Types ───────────────────────────────────────────────────────

export interface BackendProduct {
  name: string;
  price: number;
  rating: number;
  category: string;
  marketplace: string;
  image_url?: string | null;
  similarity?: number;
}

export interface ProductIntent {
  type: "product";
  category?: string;
  max_price?: number | null;
  features?: string[];
  brand?: string | null;
}

export interface GoalIntent {
  type: "goal";
  goal?: string;
  max_price?: number;
  components?: { category: string; budget: number }[];
}

export interface BundleComponent {
  category: string;
  budget: number;
  best: BackendProduct | null;
  alternatives: BackendProduct[];
}

export interface ProductSearchResponse {
  type: "product";
  intent: ProductIntent;
  results: BackendProduct[];
}

export interface GoalSearchResponse {
  type: "goal";
  intent: GoalIntent;
  bundle: BundleComponent[];
  total_price: number;
}

export interface ErrorResponse {
  error: string;
  intent: null;
  results: [];
}

export type SearchResponse = ProductSearchResponse | GoalSearchResponse | ErrorResponse;

// ─── API Functions ───────────────────────────────────────────────

export async function searchProducts(query: string): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

// ─── Data Mappers ────────────────────────────────────────────────
// Transform backend responses → frontend component props

export interface MappedProduct {
  name: string;
  image: string;
  rating: number;
  features: string[];
  price: number;
  msrp?: number;
  badge?: string;
  retailers: { name: string; price: number; lowest?: boolean; delivery?: string }[];
  summary: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80";

const CATEGORY_IMAGES: Record<string, string> = {
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80",
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
  mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80",
  "washing machine": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=500&q=80",
  refrigerator: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80",
  "smart watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
};

function getProductImage(product: BackendProduct): string {
  if (product.image_url) return product.image_url;
  const cat = (product.category || "").toLowerCase().replace("_", " ");
  return CATEGORY_IMAGES[cat] || PLACEHOLDER_IMAGE;
}

/**
 * Groups products by name across marketplaces for price comparison
 * Backend returns separate rows for each marketplace — we group them
 * into a single ProductCard with multiple retailers
 */
export function mapProductResults(products: BackendProduct[]): MappedProduct[] {
  // Group by product name (normalized)
  const groups = new Map<string, BackendProduct[]>();

  for (const p of products) {
    const key = p.name.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  const mapped: MappedProduct[] = [];
  let index = 0;

  for (const [, group] of groups) {
    const primary = group.reduce((a, b) => (a.price <= b.price ? a : b));
    const lowestPrice = Math.min(...group.map(g => g.price));

    const retailers = group.map(g => ({
      name: capitalize(g.marketplace),
      price: g.price,
      lowest: g.price === lowestPrice && group.length > 1,
      delivery: g.marketplace.toLowerCase() === "amazon" ? "Free Delivery" : "Standard Delivery",
    }));

    // Sort retailers so lowest is first
    retailers.sort((a, b) => a.price - b.price);

    const category = capitalize((primary.category || "").replace("_", " "));
    const maxPrice = Math.max(...group.map(g => g.price));
    const savings = maxPrice - lowestPrice;

    mapped.push({
      name: primary.name,
      image: getProductImage(primary),
      rating: primary.rating || 0,
      features: [category, primary.rating ? `★ ${primary.rating}` : ""].filter(Boolean),
      price: lowestPrice,
      msrp: savings > 0 ? maxPrice : undefined,
      badge: index === 0 ? "Best Pick" : undefined,
      retailers,
      summary: savings > 0
        ? `Save ₹${savings.toLocaleString("en-IN")} by choosing ${retailers.find(r => r.lowest)?.name || retailers[0].name}.`
        : `Lowest price found on ${retailers[0].name}.`,
    });

    index++;
  }

  return mapped;
}

export interface MappedBundle {
  title: string;
  discount: string;
  products: { name: string; price: number; retailer: string; image: string }[];
  totalPrice: number;
  originalTotal: number;
  isBest?: boolean;
}

/**
 * Maps the backend bundle response to BundleCard props.
 * Creates marketplace-based combos from the bundle components.
 */
export function mapBundleResults(bundle: BundleComponent[]): MappedBundle[] {
  // Collect all unique marketplaces across bundle components
  const allProducts: { component: BundleComponent; product: BackendProduct; role: string }[] = [];

  for (const comp of bundle) {
    if (comp.best) {
      allProducts.push({ component: comp, product: comp.best, role: "best" });
    }
    for (const alt of comp.alternatives) {
      allProducts.push({ component: comp, product: alt, role: "alt" });
    }
  }

  // Strategy 1: "Best Value Pack" — cheapest product per component
  const bestValueProducts = bundle
    .filter(c => c.best)
    .map(c => {
      const all = [c.best!, ...c.alternatives];
      const cheapest = all.reduce((a, b) => (a.price <= b.price ? a : b));
      return { name: cheapest.name, price: cheapest.price, retailer: capitalize(cheapest.marketplace), image: getProductImage(cheapest) };
    });

  const bestValueTotal = bestValueProducts.reduce((s, p) => s + p.price, 0);

  // Strategy 2: Group by marketplace — Amazon combo
  const marketplaceCombos: MappedBundle[] = [];
  const seenMarketplaces = new Set<string>();

  for (const comp of bundle) {
    const allInComp = [comp.best, ...comp.alternatives].filter(Boolean) as BackendProduct[];
    for (const p of allInComp) {
      seenMarketplaces.add(p.marketplace.toLowerCase());
    }
  }

  for (const mp of seenMarketplaces) {
    const combo = bundle.map(comp => {
      const allInComp = [comp.best, ...comp.alternatives].filter(Boolean) as BackendProduct[];
      const fromMp = allInComp.find(p => p.marketplace.toLowerCase() === mp);
      const fallback = comp.best || allInComp[0];
      const pick = fromMp || fallback;
      if (!pick) return null;
      return { name: pick.name, price: pick.price, retailer: capitalize(pick.marketplace), image: getProductImage(pick) };
    }).filter(Boolean) as { name: string; price: number; retailer: string; image: string }[];

    if (combo.length === 0) continue;

    const total = combo.reduce((s, p) => s + p.price, 0);
    marketplaceCombos.push({
      title: `${capitalize(mp)} Combo`,
      discount: `${Math.round(((bestValueTotal * 1.08 - total) / (bestValueTotal * 1.08)) * 100)}%`,
      products: combo,
      totalPrice: total,
      originalTotal: Math.round(total * 1.08),
    });
  }

  // Build final list: Best Value first, then marketplace combos
  const results: MappedBundle[] = [];

  if (bestValueProducts.length > 0) {
    results.push({
      title: "Best Value Pack",
      discount: "Best",
      products: bestValueProducts,
      totalPrice: bestValueTotal,
      originalTotal: Math.round(bestValueTotal * 1.1),
      isBest: true,
    });
  }

  // Add marketplace combos (skip duplicates)
  for (const combo of marketplaceCombos) {
    if (combo.totalPrice !== bestValueTotal) {
      results.push(combo);
    }
  }

  return results;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
