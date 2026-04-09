def sort_products_by_price(products):
    
    # Sort products by price ascending
    sorted_products = sorted(products, key=lambda x: x["price"])
    
    return sorted_products


def choose_best(products):

    sorted_products = sort_products_by_price(products)

    return sorted_products[0]