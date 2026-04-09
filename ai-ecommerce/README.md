# AI E-Commerce Backend

Smart product search API powered by **Gemini AI** + **Supabase vector search**.

Supports natural language queries like `"best laptop under 50000"` and goal-based queries like `"home entertainment setup under 200000"`.

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create .env file with your keys
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_key

# 3. Run the server
python -m uvicorn app.main:app --reload --port 8000

# 4. Open browser
# http://localhost:8000
```

---

## Project Structure

```
ai-ecommerce/
├── .env                  # API keys (gitignored)
├── .gitignore
├── requirements.txt
├── app/                  # FastAPI backend
│   ├── main.py           # API routes + CORS + static files
│   ├── core/
│   │   ├── config.py     # Centralized settings
│   │   └── database.py   # Supabase + AI model clients
│   └── services/
│       ├── intent_parser.py  # Gemini AI query parser
│       ├── search.py         # Vector search + filtering
│       └── ranking.py        # Price/rating sorting
├── static/               # Test UI
│   ├── index.html
│   ├── style.css
│   └── script.js
├── scripts/              # Data pipeline utilities (one-time use)
│   ├── merge_datasets.py
│   ├── generate_marketplaces.py
│   ├── upload_to_supabase.py
│   └── generate_embeddings.py
└── data/                 # Raw CSV files (gitignored)
```

---

## API Endpoints

### `POST /api/search`

Main search endpoint. Accepts natural language queries.

**Request:**
```json
{ "query": "best laptop under 50000" }
```

**Product Response:**
```json
{
  "type": "product",
  "intent": {
    "type": "product",
    "category": "laptop",
    "max_price": 50000,
    "features": [],
    "brand": null
  },
  "results": [
    {
      "id": 1,
      "name": "Lenovo IdeaPad...",
      "price": 33944.82,
      "rating": 4.2,
      "category": "laptops",
      "marketplace": "flipkart"
    }
  ]
}
```

**Goal Response** (e.g., `"home setup under 200000"`):
```json
{
  "type": "goal",
  "intent": { "type": "goal", "goal": "home setup", ... },
  "bundle": [
    {
      "category": "laptop",
      "budget": 100000,
      "best": { "name": "...", "price": ... },
      "alternatives": [...]
    }
  ],
  "total_price": 145000
}
```

### `GET /api/categories`

Returns available product categories.

### `GET /api/health`

Health check endpoint.

---

## How It Works

1. **User types a query** → sent to `POST /api/search`
2. **Gemini AI parses intent** → detects type (product/goal), category, budget, brand
3. **Vector search** → SentenceTransformer encodes query → Supabase `match_products` RPC finds similar products
4. **Filter & rank** → filters by category/price → deduplicates → sorts by price (rating as tiebreaker)
5. **Returns results** → product cards or goal bundles

---

## Data Pipeline (One-Time Scripts)

These scripts in `scripts/` are for initial data setup. Run in order:

```bash
# 1. Merge raw CSVs into clean_products.csv
python scripts/merge_datasets.py

# 2. Generate multi-marketplace data (flipkart, amazon, meesho)
python scripts/generate_marketplaces.py

# 3. Upload to Supabase
python scripts/upload_to_supabase.py

# 4. Generate vector embeddings for all products
python scripts/generate_embeddings.py
```

---

## Database (Supabase)

**Table: `products`**

| Column      | Type    | Description                  |
|-------------|---------|------------------------------|
| id          | int8    | Primary key                  |
| name        | text    | Product name                 |
| description | text    | Product details              |
| category    | text    | laptop, mobile, tv, etc.     |
| price       | float8  | Price in INR                 |
| rating      | float8  | User rating (0-5)            |
| marketplace | text    | flipkart, amazon, meesho     |
| embedding   | vector  | 384-dim vector (MiniLM)      |

**Required RPC function:** `match_products(query_embedding, match_count)` — cosine similarity search.

---

## Frontend Integration Guide

Your frontend developer can integrate with these endpoints:

```javascript
// Product search
const res = await fetch("/api/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "best laptop under 50000" })
});
const data = await res.json();

// Check response type
if (data.type === "product") {
  // data.results = array of products
} else if (data.type === "goal") {
  // data.bundle = array of components with best + alternatives
  // data.total_price = sum of best picks
}
```

**CORS is enabled** — the frontend can run on any origin during development.

---

## Environment Variables

| Variable      | Description              |
|---------------|--------------------------|
| SUPABASE_URL  | Supabase project URL     |
| SUPABASE_KEY  | Supabase service role key|
| GEMINI_API_KEY | Google Gemini API key   |

> ⚠️ Never commit `.env` to git. The `.gitignore` is already configured.

---

## Tech Stack

- **FastAPI** — API framework with auto-docs at `/docs`
- **Supabase** — Postgres + vector search (pgvector)
- **Gemini AI** — Natural language intent parsing
- **SentenceTransformers** — Text embedding (all-MiniLM-L6-v2)
- **Uvicorn** — ASGI server
