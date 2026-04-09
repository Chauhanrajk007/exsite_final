from app.core.config import SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, GEMINI_MODEL

# ── Supabase (lightweight, always loads) ────────────────────────
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Gemini (lightweight, always loads) ──────────────────────────
import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# ── Gemini Embeddings (replaces SentenceTransformer) ────────────
# Uses Gemini's text-embedding API instead of the heavy
# sentence-transformers + torch stack (~800MB).
# This is a simple API call — no local ML model needed.

class _GeminiEmbeddingModel:
    """
    Drop-in replacement for SentenceTransformer.
    Uses Gemini's text-embedding-004 model via API.
    Provides the same .encode() interface.
    output_dimensionality=384 matches the old all-MiniLM-L6-v2 vectors
    stored in Supabase, so no DB migration needed.
    """
    def __init__(self, model_name: str = "models/text-embedding-004", dimensions: int = 384):
        self.model_name = model_name
        self.dimensions = dimensions

    def encode(self, text, **kwargs):
        """
        Encode text into a vector embedding using Gemini API.
        Returns a list of floats (same format as SentenceTransformer).
        """
        if isinstance(text, list):
            # Batch encoding — embed each text separately
            return [self._embed_single(t) for t in text]

        return self._embed_single(text)

    def _embed_single(self, text: str) -> list:
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_query",
                output_dimensionality=self.dimensions
            )
            return result["embedding"]
        except Exception as e:
            print(f"[eXsite] Embedding error: {e}", flush=True)
            # Return a zero vector as fallback
            return [0.0] * self.dimensions


# This is what the rest of the app imports — same interface as before
embedding_model = _GeminiEmbeddingModel()
