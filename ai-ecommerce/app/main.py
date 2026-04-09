import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

from app.core.config import AVAILABLE_CATEGORIES
from app.core.database import supabase, embedding_model
from app.services.intent_parser import parse_intent
from app.services.search import search_products, search_for_goal

app = FastAPI(title="AI E-Commerce API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Only mount static files if the directory exists (won't exist on Render)
if os.path.isdir("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")


class SearchRequest(BaseModel):
    query: str


class CompareRequest(BaseModel):
    product_name: str
    current_marketplace: str
    current_price: Optional[float] = None


@app.get("/")
async def serve_ui():
    if os.path.isfile("static/index.html"):
        return FileResponse("static/index.html")
    return {"status": "ok", "service": "AI E-Commerce API", "docs": "/docs"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/categories")
async def get_categories():
    return {"categories": AVAILABLE_CATEGORIES}


@app.post("/api/compare")
async def compare_prices(req: CompareRequest):
    """
    Cross-marketplace price comparison for the browser extension.
    Takes a product name + current marketplace, finds similar products
    on OTHER marketplaces using vector search, returns them with URLs.
    """
    try:
        # Use vector search to find similar products
        query_vector = embedding_model.encode(req.product_name).tolist()

        response = supabase.rpc(
            "match_products",
            {"query_embedding": query_vector, "match_count": 20}
        ).execute()

        products = response.data or []

        # Filter to other marketplaces only
        competitors = []
        for p in products:
            mp = str(p.get("marketplace", "")).lower()
            if mp == req.current_marketplace.lower():
                continue  # Skip same marketplace

            competitors.append({
                "name": p.get("name", ""),
                "price": p.get("price", 0),
                "rating": p.get("rating", 0),
                "marketplace": p.get("marketplace", ""),
                "image_url": p.get("image_url"),
                "product_url": p.get("product_url", ""),
                "similarity": p.get("similarity", 0),
                "category": p.get("category", ""),
            })

        # Sort by price ascending (cheapest first)
        competitors.sort(key=lambda x: x["price"])

        # Find the best deal
        best = competitors[0] if competitors else None
        savings = 0
        if best and req.current_price:
            savings = req.current_price - best["price"]

        return {
            "product_name": req.product_name,
            "current_marketplace": req.current_marketplace,
            "current_price": req.current_price,
            "competitors": competitors[:5],  # Top 5 competitor matches
            "best_deal": best,
            "savings": max(savings, 0),
        }
    except Exception as e:
        return {"error": str(e), "competitors": [], "best_deal": None, "savings": 0}


@app.post("/api/search")
async def search(req: SearchRequest):
    intent = parse_intent(req.query)

    if not intent:
        return {"error": "Could not understand query", "intent": None, "results": []}

    if intent.get("type") == "goal":
        components = intent.get("components", [])
        bundle = search_for_goal(components)

        total = sum(
            comp["best"]["price"]
            for comp in bundle
            if comp["best"]
        )

        return {
            "type": "goal",
            "intent": intent,
            "bundle": bundle,
            "total_price": total
        }

    results = search_products(
        query=req.query,
        category=intent.get("category"),
        max_price=intent.get("max_price"),
        limit=20
    )

    return {
        "type": "product",
        "intent": intent,
        "results": results
    }
