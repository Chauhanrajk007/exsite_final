import pandas as pd
import os

data_folder = "data"

files = [
    "flipkart_laptops.csv",
    "flipkart_mobiles.csv",
    "flipkart_refrigerator.csv",
    "flipkart_smart_watch.csv",
    "flipkart_tv.csv",
    "flipkart_washing_machine.csv"
]

dfs = []

for file in files:
    path = os.path.join(data_folder, file)

    df = pd.read_csv(path, encoding='latin-1')

    # Map the actual columns to expected ones
    rename_map = {
        "Name": "name",
        "Details": "description",
        "Selling Price": "price",
        "Ratings": "rating"
    }
    
    # Extract a category from the filenames like flipkart_mobiles.csv -> mobiles
    category = file.replace('flipkart_', '').replace('.csv', '')

    df = df.rename(columns=rename_map)
    df["marketplace"] = "flipkart"
    df["category"] = category
    
    # Keep only the columns we care about, gracefully handling missing ones
    core_cols = ["name", "description", "price", "rating", "category", "marketplace"]
    
    # Some older files might not have 'rating', add it if missing
    for col in core_cols:
        if col not in df.columns:
            df[col] = None
            
    df = df[core_cols]

    dfs.append(df)

products = pd.concat(dfs, ignore_index=True)

# Price needs to be cleaned - currently strings like $2,300 or ₹14,999 - let's strip non-numeric
products['price'] = products['price'].astype(str).str.replace(r'[^\d.]', '', regex=True)
# Convert empty strings to NaN
products['price'] = pd.to_numeric(products['price'], errors='coerce')

products.dropna(subset=["name","price"], inplace=True)

products.to_csv("clean_products.csv", index=False)

print("Dataset merged successfully")