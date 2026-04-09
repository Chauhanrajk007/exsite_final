from sentence_transformers import SentenceTransformer
from supabase import create_client
import os
from dotenv import load_dotenv
import time

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

model = SentenceTransformer('all-MiniLM-L6-v2')

# Paginate through ALL products that don't have embeddings yet
page_size = 1000
offset = 0
all_products = []

while True:
    batch = supabase.table("products").select("*").is_("embedding", "null").range(offset, offset + page_size - 1).execute().data
    if not batch:
        break
    all_products.extend(batch)
    if len(batch) < page_size:
        break
    offset += page_size

print(f"Fetched {len(all_products)} products without embeddings from database")

count = 0
for product in all_products:
    text = f"{product.get('name', '')} {product.get('description', '')}"

    if text.strip() == "":
        continue

    embedding = model.encode(text).tolist()

    # Retry logic for network timeouts
    max_retries = 3
    for attempt in range(max_retries):
        try:
            supabase.table("products").update(
                {"embedding": embedding}
            ).eq("id", product["id"]).execute()
            break
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Error on product {product['id']}, retrying... ({attempt + 1}/{max_retries})")
                time.sleep(2)
            else:
                print(f"Failed to update product {product['id']} after {max_retries} attempts: {e}")
                continue

    count += 1
    if count % 100 == 0:
        print(f"Processed {count}/{len(all_products)} embeddings...")

print(f"Embeddings generated for {count} products")