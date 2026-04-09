import json
from app.core.database import gemini_model
from app.core.config import AVAILABLE_CATEGORIES


def parse_intent(query: str) -> dict | None:
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
  {", ".join(AVAILABLE_CATEGORIES)}

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
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()

        data = json.loads(text)

        if "query_type" in data:
            data["type"] = data.pop("query_type")

        if data.get("type") == "goal" and not data.get("components"):
            budget = data.get("max_price", 100000)
            data["components"] = [
                {"category": "laptop", "budget": int(budget * 0.5)},
                {"category": "tv", "budget": int(budget * 0.3)},
                {"category": "smart watch", "budget": int(budget * 0.2)}
            ]

        return data

    except Exception as e:
        print(f"Intent parsing error: {e}")
        return None
