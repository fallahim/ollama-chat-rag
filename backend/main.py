"""
چت‌بات با مدل زبانی اوپن‌سورس (Ollama)
"""
from contextlib import asynccontextmanager
import json
import httpx
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from config import OLLAMA_BASE_URL, DEFAULT_MODEL

OLLAMA_CHAT_URL = f"{OLLAMA_BASE_URL}/api/chat"
OLLAMA_TAGS_URL = f"{OLLAMA_BASE_URL}/api/tags"


class Message(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str | None = None
    stream: bool = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # cleanup if needed


app = FastAPI(
    title="ChatBot",
    description="چت‌بات با مدل اوپن‌سورس",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND = Path(__file__).resolve().parent.parent / "frontend"


@app.get("/api/health")
async def health():
    """بررسی اتصال به Ollama"""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if r.status_code != 200:
                return {"ok": False, "error": "Ollama not responding"}
            data = r.json()
            models = [m["name"] for m in data.get("models", [])]
            return {"ok": True, "models": models, "default": DEFAULT_MODEL}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.get("/api/models")
async def list_models():
    """لیست مدل‌های نصب‌شده"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(OLLAMA_TAGS_URL)
            r.raise_for_status()
            data = r.json()
            return {"models": [{"name": m["name"]} for m in data.get("models", [])]}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """ارسال پیام و دریافت پاسخ (استریم یا یک‌جا)"""
    model = req.model or DEFAULT_MODEL
    payload = {
        "model": model,
        "messages": [{"role": m.role, "content": m.content} for m in req.messages],
        "stream": req.stream,
    }

    async def generate():
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream(
                    "POST", OLLAMA_CHAT_URL, json=payload
                ) as response:
                    if response.status_code != 200:
                        err = await response.aread()
                        yield f"data: {json.dumps({'error': err.decode()})}\n\n"
                        return
                    async for chunk in response.aiter_lines():
                        if chunk:
                            yield f"data: {chunk}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

    if req.stream:
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    # Non-streaming: wait for full response
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            r = await client.post(OLLAMA_CHAT_URL, json=payload)
            r.raise_for_status()
            data = r.json()
            msg = data.get("message", {})
            return {"message": {"role": msg.get("role", "assistant"), "content": msg.get("content", "")}}
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Ollama در دسترس نیست. لطفاً Ollama را اجرا کرده و مدلی نصب کنید (مثلاً ollama run llama3.2)",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Serve frontend last so /api/* routes are matched first
if FRONTEND.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND), html=True), name="frontend")
