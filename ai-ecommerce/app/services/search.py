from app.core.database import supabase, embedding_model
from app.services.ranking import rank_products


def search_products(
    query: str,
    category: str | None = None,
    max_price: float | None = None,
    limit: int = 20
) -> list:
    query_vector = embedding_model.encode(query).tolist()

    response = supabase.rpc(
        "match_products",
        {"query_embedding": query_vector, "match_count": 50}
    ).execute()

    products = response.data or []

    filtered = []
    for p in products:
        db_cat = str(p.get("category", "")).lower().replace("_", " ")

        if category and category.lower() not in db_cat:
            continue

        if max_price and float(p.get("price", 0)) > max_price:
            continue

        filtered.append(p)

    # Deduplicate by name + marketplace
    unique = {}
    for p in filtered:
        key = (p["name"], p.get("marketplace", ""))
        unique[key] = p

    ranked = rank_products(list(unique.values()))

    return ranked[:limit]


def search_for_goal(components: list) -> list:
    results = []

    for comp in components:
        category = comp.get("category", "")
        budget = comp.get("budget")

        matches = search_products(
            query=category,
            category=category,
            max_price=budget,
            limit=5
        )

        results.append({
            "category": category,
            "budget": budget,
            "best": matches[0] if matches else None,
            "alternatives": matches[1:4] if len(matches) > 1 else []
        })

    return results
