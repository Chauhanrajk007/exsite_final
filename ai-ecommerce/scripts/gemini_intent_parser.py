import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# FIX 1: use a supported + stable model
model = genai.GenerativeModel("gemini-2.5-flash")


def parse_with_gemini(query):

    prompt = f"""
You are an AI shopping assistant.

Convert the user query into STRICT JSON.

Rules:
- Detect if query is "product" or "goal"
- Extract category (laptop, mobile, tv, washing machine, refrigerator, smart watch)
- Extract max price
- Extract features (if any)
- Extract brand (if any)

IMPORTANT:
- If goal-based → MUST include "components"
- Components must ONLY use these categories:
  laptop, mobile, tv, washing machine, refrigerator, smart watch

Return ONLY JSON in this format:

For product:
{{
  "type": "product",
  "category": "string",
  "max_price": number or null,
  "features": [],
  "brand": null
}}

For goal:
{{
  "type": "goal",
  "goal": "string",
  "max_price": number,
  "components": [
    {{"category": "laptop", "budget": number}},
    {{"category": "tv", "budget": number}}
  ]
}}

User Query:
{query}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        # FIX 2: clean markdown safely
        text = text.replace("```json", "").replace("```", "").strip()

        data = json.loads(text)

        # FIX 3: normalize keys (VERY IMPORTANT)
        if "query_type" in data:
            data["type"] = data["query_type"]

        # FIX 4: ensure goal always has components
        if data.get("type") == "goal" and not data.get("components"):

            budget = data.get("max_price", 100000)

            data["components"] = [
                {"category": "laptop", "budget": int(budget * 0.5)},
                {"category": "tv", "budget": int(budget * 0.3)},
                {"category": "smart watch", "budget": int(budget * 0.2)}
            ]

        return data

    except Exception as e:
        print("⚠ Parsing error:", e)
        print("Raw:", text)
        return None