import os
from app.core.config import SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, EMBEDDING_MODEL, GEMINI_MODEL

# ── Supabase (lightweight, always loads) ────────────────────────
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Gemini (lightweight, always loads) ──────────────────────────
import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# ── SentenceTransformer LAZY LOADER ─────────────────────────────
# sentence-transformers + torch are HEAVY (~800MB).
# We load them ONLY on first API request, NOT at import time.
# This lets uvicorn bind the port immediately on Render.
_embedding_model_instance = None

def _load_embedding_model():
    global _embedding_model_instance
    if _embedding_model_instance is None:
        print("[eXsite] Loading SentenceTransformer model (first request)...", flush=True)
        try:
            from sentence_transformers import SentenceTransformer
            _embedding_model_instance = SentenceTransformer(EMBEDDING_MODEL)
            print(f"[eXsite] Model '{EMBEDDING_MODEL}' loaded successfully!", flush=True)
        except Exception as e:
            print(f"[eXsite] ERROR loading model: {e}", flush=True)
            raise
    return _embedding_model_instance


class _LazyEmbeddingModel:
    """
    Drop-in proxy for SentenceTransformer.
    Defers the heavy model load to the first .encode() call.
    """
    def encode(self, *args, **kwargs):
        return _load_embedding_model().encode(*args, **kwargs)

    def __getattr__(self, name):
        return getattr(_load_embedding_model(), name)


# This is what the rest of the app imports
embedding_model = _LazyEmbeddingModel()
