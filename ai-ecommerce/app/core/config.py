import os
from dotenv import load_dotenv

# Load .env file for local dev (on Render env vars are injected directly)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Validate critical env vars at startup — print warnings instead of crashing
if not SUPABASE_URL:
    print("[eXsite] WARNING: SUPABASE_URL not set!", flush=True)
if not SUPABASE_KEY:
    print("[eXsite] WARNING: SUPABASE_KEY not set!", flush=True)
if not GEMINI_API_KEY:
    print("[eXsite] WARNING: GEMINI_API_KEY not set!", flush=True)

AVAILABLE_CATEGORIES = [
    "laptop", "mobile", "tv",
    "washing machine", "refrigerator", "smart watch"
]

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
GEMINI_MODEL = "gemini-2.5-flash"
