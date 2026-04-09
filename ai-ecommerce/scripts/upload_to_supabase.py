import pandas as pd
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

df = pd.read_csv("multi_market_products.csv")

print(f"Total rows in CSV: {len(df)}")

# Drop rows with any null in critical fields
df = df.dropna(subset=["name", "price", "category", "marketplace"])

# Fill remaining nulls so no null values reach the DB
df["description"] = df["description"].fillna("")
df["rating"] = df["rating"].fillna(0.0)

print(f"Rows after removing nulls: {len(df)}")

records = []
for _, row in df.iterrows():
    data = {
        "name": str(row["name"]),
        "description": str(row["description"]),
        "category": str(row["category"]),
        "price": float(row["price"]),
        "rating": float(row["rating"]),
        "marketplace": str(row["marketplace"])
    }
    records.append(data)

# Batch insert in chunks of 500 to avoid request size limits
chunk_size = 500
total_chunks = (len(records) + chunk_size - 1) // chunk_size

for i in range(0, len(records), chunk_size):
    chunk = records[i:i + chunk_size]
    chunk_num = (i // chunk_size) + 1
    supabase.table("products").insert(chunk).execute()
    print(f"Uploaded chunk {chunk_num}/{total_chunks} ({len(chunk)} records)")

print(f"All {len(records)} products uploaded successfully")