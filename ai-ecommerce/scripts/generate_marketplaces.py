import pandas as pd
import random

df = pd.read_csv("clean_products.csv")

marketplaces = ["flipkart", "amazon", "meesho"]

rows = []

for _, row in df.iterrows():

    for market in marketplaces:

        new_row = row.copy()

        new_row["marketplace"] = market

        # simulate price differences
        variation = random.uniform(-0.15, 0.15)

        new_row["price"] = round(row["price"] * (1 + variation), 2)

        rows.append(new_row)

final_df = pd.DataFrame(rows)

final_df.to_csv("multi_market_products.csv", index=False)

print("Marketplace dataset generated")