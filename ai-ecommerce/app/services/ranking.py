def sort_by_price(products: list) -> list:
    return sorted(products, key=lambda p: float(p.get("price", 0)))


def sort_by_rating(products: list) -> list:
    return sorted(products, key=lambda p: float(p.get("rating", 0)), reverse=True)


def rank_products(products: list) -> list:
    return sorted(
        products,
        key=lambda p: (float(p.get("price", 0)), -float(p.get("rating", 0)))
    )
